---
layout: post
title: "在骁龙 8 Elite 上给 llama.cpp 做硬件加速：NPU 被 SELinux 挡住、OpenCL 被命名空间挡住、Vulkan 能跑但打不过 CPU"
date: 2026-10-30 00:40:00 +0800
tags: [Android, llama.cpp, NPU, Vulkan, 性能]
description: "从交叉编译 Hexagon HTP 后端，到让 Adreno 840 通过 Vulkan 跑起来，三条加速路线各撞一堵墙。用实测数据说明：为什么手机上给本地大模型做硬件加速，比想象中难得多。"
---

手机是 Redmi K90 Pro Max（骁龙 8 Elite Gen 5，SM8850），日常在 Termux + proot Debian 里跑 llama.cpp 当本地助手。CPU 推理大概 20 tok/s，能接受，但总觉得"这块 SoC 明明有 NPU 和很强的 GPU，为什么用不上"。

于是花了一整晚，把三条路都试了一遍：Hexagon NPU、Adreno OpenCL、Adreno Vulkan。结论先说：**三条路都撞墙了，最后回退 CPU**。但这几个墙的性质完全不同，值得记下来。

## 目录

1. [起点：这块 SoC 到底有什么](#1-起点这块-soc-到底有什么)
2. [NPU：编译成功了，被 SELinux 拒之门外](#2-npu编译成功了被-selinux-拒之门外)
3. [OpenCL：被 Android 的 linker namespace 挡住](#3-opencl被-android-的-linker-namespace-挡住)
4. [Vulkan：能跑，但 prefill 打不过 CPU](#4-vulkan能跑但-prefill-打不过-cpu)
5. [结论：为什么最终回到 CPU](#5-结论为什么最终回到-cpu)
6. [附：实测数据与复现命令](#6-附实测数据与复现命令)

---

## 1. 起点：这块 SoC 到底有什么

先把硬件摸清楚，避免瞎猜：

| 项目 | 值 |
|---|---|
| SoC | SM8850（骁龙 8 Elite Gen 5），`ro.board.platform=canoe` |
| NPU | Hexagon，HTP 架构 **v81** |
| GPU | Adreno 840，`ro.hardware.vulkan=adreno` |
| 系统 | Android 17，**无 root** |
| 内存 | 16 GB LPDDR5X，CPU 与 GPU 共享 |

系统里已经有完整的 DSP 运行时：

```
/vendor/lib64/libcdsprpc.so
/vendor/lib64/libadsprpc.so
/vendor/lib64/libSNPE.so
/vendor/lib/rfsa/adsp/libSnpeHtpV81Skel.so
/vendor/lib64/hw/vulkan.adreno.so
```

看起来什么都不缺。而 llama.cpp 上游其实**自带** Hexagon 后端（`ggml/src/ggml-hexagon/`）和 Snapdragon 的构建文档（`docs/backend/snapdragon/`），官方示例在 HTP 上跑 Llama-3.2-1B 能到 51 tok/s。所以"理论上可行"不是错觉。

---

## 2. NPU：编译成功了，被 SELinux 拒之门外

### 2.1 交叉编译链路

Hexagon 后端的编译需要 Qualcomm 提供的工具链镜像（内含 Android NDK + OpenCL SDK + Hexagon SDK 6.6），因为 DSP 侧的 `skel` 二进制必须用 x86_64 的 `hexagon-clang` 交叉编译——**手机本体是 ARM，跑不了这套工具链**。

在电脑上用官方流程：

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

# 一条命令：拉镜像 → 编译 → adb push 到手机
./scripts/snapdragon/build.py --target adb --push
```

编译产物里能看到：

```
libggml-hexagon.so
libggml-htp-v73.so
libggml-htp-v75.so
libggml-htp-v79.so
libggml-htp-v81.so     ← 对应 SM8850
```

`v81` 正好匹配这台机器，交叉编译这步是成功的。

### 2.2 三个证据，定位到 SELinux

把包放到手机上运行，第一步就失败：

```
E ggml-hex: failed to load libcdsprpc.so: dlopen failed: library "libcdsprpc.so" not found
```

补上库路径后，问题变成设备打不开。逐层排查：

**证据一：设备节点存在，但打不开**

```bash
$ open("/dev/fastrpc-cdsp")      # Python 实测
PermissionError: [Errno 13] Permission denied

$ stat /dev/fastrpc-cdsp
stat: cannot statx '/dev/fastrpc-cdsp': Permission denied
```

注意是 `EACCES` 而不是 `ENOENT`——节点在，权限不够。

**证据二：不是所有设备都被拒**

同一进程里对比：

```bash
$ head -c 1 /dev/kgsl-3d0 >/dev/null && echo ok
ok                                   # GPU 节点可以访问

$ head -c 1 /dev/fastrpc-cdsp >/dev/null
Permission denied                    # NPU 通道被拒
```

`/dev/null`、`/dev/urandom` 也都正常。所以不是 `/dev` 目录的问题，是**特定节点的策略限制**。

**证据三：进程的 SELinux 域**

```bash
$ cat /proc/self/attr/current
u:r:untrusted_app_27:s0:c144,c257,c512,c768

$ ls -Z /dev/kgsl-3d0
u:object_r:gpu_device:s0 /dev/kgsl-3d0
```

关键在 `untrusted_app_27` 这个域名——后缀 `_27` 表示 targetSdk ≤ 27 的旧应用域，Android 对这类域有更严格的 vendor 设备访问限制。Termux 的 targetSdk 是 28，正好落在这一档。

### 2.3 为什么换容器没用

一开始我以为把 Termux 换到 proot 容器里会不一样，实测发现：

```
proot 启动参数里有 --bind=/dev     → 容器的 /dev 就是宿主 /dev
容器内 open("/dev/fastrpc-cdsp")   → 一样 EACCES
```

**SELinux 域由 app 身份决定，不由容器决定。** Termux 原生 shell、proot Debian、甚至 adb 推上去的二进制，只要还是这个 app 的进程，标签都一样。

那 localdream 这类应用为什么能用 NPU？它们的 targetSdk 是新的，落在 `untrusted_app`（无 `_27` 后缀）域，策略允许访问 fastrpc 设备。这是 app 身份带来的差异，Termux 改不了。

### 2.4 重打包 Termux 可行吗

想过把 Termux 的 targetSdk 改成 34 重新签名打包。评估下来不可行：

1. **targetSdk ≥ 29 会触发 W^X**：Android 10+ 禁止应用从可写目录执行代码，而 Termux 的全部功能就是"在可写目录跑二进制"——这一条直接判死刑
2. **scoped storage**：改完之后 `/sdcard/models` 这类路径也读不了
3. **签名冲突**：自签名 APK 无法覆盖安装官方 Termux，必须先卸载，`/data/data/com.termux` 整个家目录会被清空
4. **不保证成功**：即使改完，`untrusted_app` 新域在这台 ROM 上是否真的放行 fastrpc，没有证据

所以 NPU 这条路的结论是：**非 root 环境下无解，不是配置问题，是安全模型问题。**

> 顺带纠正一个流传很广的说法：「HTP 只支持 Q4_0」。翻源码 `ggml/src/ggml-hexagon/ggml-hexagon.cpp` 的 MUL_MAT 分支，实际支持 Q4_0 / Q4_1 / Q8_0 / IQ4_NL / MXFP4 / **Q4_K / Q5_K / Q6_K**。官方示例清一色 Q4_0 只是基线模型。真正的硬限制是 HTP 单 session 约 3.5 GB 地址空间，以及 FLASH_ATTN 的 K/V 只接受 F16/Q8_0。

---

## 3. OpenCL：被 Android 的 linker namespace 挡住

NPU 走不通，转 GPU。Android 上的 OpenCL 实现来自 GPU 驱动 `/vendor/lib64/libOpenCL.so`，llama.cpp 也有 `ggml-opencl` 后端，看起来顺理成章。

### 3.1 后端根本没注册

先编译（`-DGGML_OPENCL=ON`），产物里有 `libggml-opencl.so`。但运行：

```bash
$ ./bin/llama-bench -m model.gguf -ngl 99 -dev GPUOpenCL
error: invalid device: GPUOpenCL

$ ./bin/llama-bench -m model.gguf -ngl 99
| ... | backend | CPU |    ← -ngl 完全没生效
```

查符号：

```bash
$ readelf -Ws lib/libggml-opencl.so | grep ggml_backend_init
（无输出）

$ nm -D lib/libggml.so | grep -c opencl
0
```

既没有作为独立后端模块导出 `ggml_backend_init`，也没有静态链接进主库。**这个 .so 是个编出来但接不上的产物。**

### 3.2 就算编对了，还有第二堵墙

手动指定后端路径加载时，终于走到了真正的障碍：

```bash
$ dlopen("/vendor/lib64/libOpenCL.so")
WARNING: linker: library "libOpenCL.so" ... is not accessible for the namespace:
[name="(default)", permitted_paths="/system/lib64:...:/data:..."]
```

`permitted_paths` 里**没有 `/vendor/lib64`**。这是 Android 10+ 的 linker namespace 机制：普通 app 的默认命名空间只允许访问 `/system`、`/data` 等路径，vendor 库属于 vendor namespace。

试过两个绕法：

| 做法 | 结果 |
|---|---|
| 软链 `/vendor/lib64/libOpenCL.so` 到 lib 目录 | 仍然是 `not accessible for the namespace`（解析后还是 vendor 路径） |
| 复制真实文件到 `/data` 目录 | dlopen 成功，但报 `failed to find ggml_backend_init`，且库内部还要加载 `/vendor/lib64/libOpenCL_adreno.so`，再次被拦 |

所以 OpenCL 在这台机器上对普通 app 基本是不可用的——不是性能问题，是加载不进来。

### 3.3 那 Vulkan 为什么可以

登录同一个 linker 配置就能看到答案：

```
permitted_paths="...:/system/lib64/vulkan:/product/lib64/vulkan:..."
```

Vulkan 的 loader 在 `/system/lib64/libvulkan.so`，属于**系统公共库**，在允许列表里；Adreno 驱动由 loader 自己去 `/vendor/lib64/hw/` 找，不需要 app 直接接触 vendor 路径。

---

## 4. Vulkan：能跑，但 prefill 打不过 CPU

### 4.1 编译与识别

用 Android NDK r28b + Vulkan SDK（需要 `glslc`）交叉编译：

```bash
cmake -B build-vulkan -G Ninja \
  -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
  -DANDROID_ABI=arm64-v8a \
  -DANDROID_PLATFORM=android-28 \
  -DGGML_VULKAN=ON -DGGML_OPENCL=OFF -DGGML_HEXAGON=OFF \
  -DVULKAN_SDK=$VULKAN_SDK
```

设备识别一次成功，**不需要任何环境变量**：

```
Available devices:
  Vulkan0: Adreno (TM) 840 (19196 MiB, 19196 MiB free)
```

驱动自报的能力：

```
uma: 1 | fp16: 1 | bf16: 0 | fp4: 0 | warp size: 64
shared memory: 32768 | int dot: 1 | matrix cores: none
```

### 4.2 实测数据

用 llama-bench 跑同机同模型对照：

| 模型 | 后端 | prefill | decode |
|---|---|---|---|
| Spark-1.7B Q8_0 | CPU（8 线程） | **93.2 t/s** | 17.7 t/s |
| Spark-1.7B Q8_0 | Vulkan | 9.7 t/s | **22.0 t/s** |
| Spark-4B Q4_K_M | CPU（8 线程） | **30.8 t/s** | 9.9 t/s |
| Spark-4B Q4_K_M | Vulkan | 11.3 t/s | **16.2 t/s** |

规律很清楚：

- **decode（逐 token 生成）**：GPU 快 1.2~1.6 倍，模型越大优势越明显
- **prefill（处理 prompt）**：GPU 慢 **3~10 倍**

这和"GPU 算力更强"的直觉是反的。prefill 是大 batch 矩阵乘、典型 compute-bound 场景，本该是 GPU 的主场。

### 4.3 为什么 prefill 反了

三个原因叠加：

1. **`matrix cores: none`**：Adreno 的矩阵加速单元没有被 Vulkan 后端利用。llama.cpp 的 Vulkan shader 是通用实现，对移动 GPU 的张量单元没有专门适配。
2. **shader 效率**：移动 GPU 的 warp size 是 64（桌面是 32），llama.cpp 针对 Adreno 的调优一直在补——上游近期还有 PR 专门「cap scalar flash attention at 8 rows for large heads on Qualcomm Adreno GPUs」，说明这块仍在打补丁。
3. **kernel launch 开销**：prefill 的 batch 不大时，调度开销占比高，GPU 的占用率上不去。

而 decode 之所以只快一点，是因为它本质是 memory-bound：每生成一个 token 要把全部权重读一遍。1.7B Q8_0 约 1.7 GB，LPDDR5X 带宽共享的情况下，CPU 和 GPU 面对的是同一条带宽，GPU 的算力优势用不上。

### 4.4 更麻烦的是不稳定

| 场景 | 结果 |
|---|---|
| 1.7B，`-p 32 -n 8` | 正常 |
| 1.7B，`-p 64 -n 16` | **Segmentation fault** |
| 4B，`-p 128` 配 `-ub 64/128/256` | 全部失败 |

小 batch 能跑，一旦 batch 变大就崩。drivers 或 shader 在大 batch 下不稳，这意味着它连"稳定可用"都算不上。

---

## 5. 结论：为什么最终回到 CPU

把三条路的结论放在一起：

| 路线 | 状态 | 卡点 |
|---|---|---|
| Hexagon NPU | 不可用 | SELinux `untrusted_app_27` 域拒绝 fastrpc 设备 |
| Adreno OpenCL | 不可用 | 后端未注册 + linker namespace 禁止加载 vendor 库 |
| Adreno Vulkan | 可用但无收益 | prefill 慢 3~10 倍，大 batch 崩溃 |

关键判断是：**聊天场景看的是 prefill**。日常对话的 prompt 往往几百到几千 token（系统提示 + 历史），prefill 慢 10 倍会直接变成"首字等很久"，而 decode 快的那 1.2 倍根本补不回来。

GPU 真正的优势场景是"短 prompt + 长输出"，比如让它写长文。但 llama.cpp 不支持把 prefill 留给 CPU、decode 交给 GPU 的分段方案，所以这个优势实际上没法单独利用。

所以最后的决定很朴素：**继续用 CPU，约 21 tok/s，稳定、可预测。**

这次折腾唯一留下的可复用经验是：

1. NPU 在非 root 的 Android 上基本是禁区，除非应用本身有对应的 SELinux 域
2. OpenCL 在 Android 10+ 对普通 app 形同虚设，vendor 库不在命名空间里
3. Vulkan 是唯一干净可用的 GPU 路径，但移动端的 llama.cpp Vulkan 后端还没到"能打"的程度
4. **"算力更强"不等于"更快"**——LLM 推理的两阶段里，只有 prefill 吃算力，decode 吃带宽，而移动端两者共享内存

如果哪天 llama.cpp 的 Vulkan 后端能把 Adreno 的矩阵单元用起来，或者高通把 QNN 的运行时像 Vulkan 一样做成系统公共库，这件事才值得重来一次。

---

## 6. 附：实测数据与复现命令

复现环境：Termux + proot Debian，跑 Android AArch64 二进制；Vulkan 包用 NDK r28b + `-DGGML_VULKAN=ON` 编译。

```bash
# 设备识别
LD_LIBRARY_PATH=$PWD/lib ./bin/llama-cli --list-devices

# 基准（Vulkan）
LD_LIBRARY_PATH=$PWD/lib ./bin/llama-bench \
  -m /sdcard/models/Spark-X2.6-1.7B-Q8_0.gguf -p 32 -n 32 -r 1 -ngl 99

# 基准（CPU，用纯 CPU 包，Vulkan 存在时默认会走 Vulkan）
LD_LIBRARY_PATH=$PWD/lib ./bin/llama-bench \
  -m /sdcard/models/Spark-X2.6-1.7B-Q8_0.gguf -p 32 -n 32 -r 1
```

CPU 单次生成的实测参考：Spark-1.7B Q8_0 在 8 线程下约 17.7 tok/s，
配合 512 token 思考预算，端到端首字延迟约 2~3 秒——这是目前日常使用的配置。

---

**后记**：写这篇不是为了证明"手机不能跑大模型"，恰恰相反，20 tok/s 的 CPU 推理已经够日常用。想记下来的是：当"理论上更快"撞上"实际跑不动"时，中间隔着的往往不是性能，而是安全模型、ABI 边界和驱动生态。这三样东西，比调参难解决得多。
