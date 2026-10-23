---
layout: post
title: "让 WorkBuddy 在 Debian 13 的 Wine 下显示窗口：隐藏窗口首帧、ready-to-show 与二次唤醒启动器"
date: 2026-10-23 22:00:00 +0800
tags: [Wine, Linux, 排障, Electron, 工具链]
description: "进程全在、窗口对象也在，屏幕上却什么都没有。WorkBuddy 这个 Electron 应用在 Wine 里永远不触发 ready-to-show，于是永远不 show()。用对照实验把黑盒拆成机制，再用「二次启动唤醒」把不稳定的首帧变成 16 秒稳定出窗口。"
---

> 本文记录我让腾讯 WorkBuddy（Windows 桌面端 AI Agent）在 Debian 13 + Wine 上真正显示窗口的完整过程。它和上一篇 UU远程 是同一台机器、同一套「对照实验 → 判据 → 状态机」的方法，但踩到的是另一类坑：**程序没崩、进程没死、连窗口对象都在，只是 Electron 永远不触发 `ready-to-show`，于是永远不 `show()`。** 文中的主机名、用户名、路径、窗口 ID、设备标识与令牌均已脱敏。

---

## 目录

1. [背景](#1-背景)
2. [环境与选型](#2-环境与选型)
3. [方法：把黑盒拆成机制](#3-方法把黑盒拆成机制)
4. [观测面：进程、窗口与日志](#4-观测面进程窗口与日志)
5. [发现一：wine 10 下首帧永远不来](#5-发现一wine-10-下首帧永远不来)
6. [发现二：换成 wine 11 之后，它依然时好时坏](#6-发现二换成-wine-11-之后它依然时好时坏)
7. [发现三：再启动一次就能催帧](#7-发现三再启动一次就能催帧)
8. [启动器设计](#8-启动器设计)
9. [踩坑记录](#9-踩坑记录)
10. [验证：没有 GUI 也能验收](#10-验证没有-gui-也能验收)
11. [结果与边界](#11-结果与边界)
12. [方法论](#12-方法论)
13. [附录](#13-附录)

---

## 1. 背景

WorkBuddy 是腾讯出的 Windows 桌面端 AI Agent。它没有 Linux 版，而我这台主力机是 Debian 13（trixie）——于是又只能走 Wine。

一开始的现象很「程序员」：**双击图标，什么都没发生。**

不是崩溃、不是报错、不是闪退。打开任务管理器（或 `ps`），能看见一整排进程：主进程、GPU 进程、网络进程、渲染进程、daemon、CLI 预热进程，全都在，内存占着，日志每秒都在写心跳。但屏幕上就是什么都没有，`Alt+Tab` 里也没有。

这套症状和上一篇 UU远程 完全不同：

| 对比项 | UU远程（见上一篇） | WorkBuddy（本文） |
|--------|------------------|------------------|
| 应用形态 | 原生 Win32 + WebView2 | 纯 Electron（Chromium 138） |
| 症状 | 启动页一闪、缩托盘后消失、卡启动页 | **窗口从来没出现过（一次都没有）** |
| 进程状态 | 有时缺 Server、有时残留堆积 | 一直健康，心跳正常 |
| 第一直觉 | 「界面被隐藏了」 | 「Electron 是不是根本没跑起来」 |

第一直觉是错的：**Electron 跑得很完整，启动流程都走完了，唯一没发生的事是「窗口显示」。** 后面的排查基本都围绕一个问题：

> 一个 `BrowserWindow`，进程活着、窗口对象也创建了，为什么永远不显示？

---

## 2. 环境与选型

最终可用的组合：

| 项 | 值 |
|----|----|
| 发行版 | Debian GNU/Linux 13（trixie），GNOME / Wayland 会话（XWayland 提供 `:0`） |
| Wine | **wine-staging 11.19**（`/opt/wine-staging/bin/wine`），非系统自带 |
| 前缀 | `~/.wine`（与 UU远程 共用，见第 8 节的运维约束） |
| 应用 | WorkBuddy 5.8.3，Electron 37.10.3 / Chromium 138 / Node 22.21.1 |
| 启动参数 | Chromium 默认参数 + 启动器自己的「二次唤醒」，不需要额外 flag |

这里有两个和前作相同、值得先说的选型：

**一、Wine 必须用 staging 11.19，不能用 Debian 仓库里的 10.0。** 这不是拍脑袋：Debian 13 仓库里是 `10.0~repack-6`，用它启动 WorkBuddy，窗口永远不显示；换成 staging 11.19 后，主窗口 4 秒内就出来了。**同一个根因在不同应用上的表现完全不同**——UU 是「卡启动页」，WorkBuddy 是「永不显示窗口」，但两者都是 Chromium 系应用在旧 Wine 下的首帧问题。

**二、一开始试过的「参数疗法」全都不必要。** 网上常见建议是给 Electron 加 `--disable-gpu`、给 WebView2 应用加 `Version=win8` 注册表……我逐项做了对照实验（见第 6 节），结论是：**没有任何一个开关能稳定解决它**。真正的解法在启动时序上，不在参数上。

---

## 3. 方法：把黑盒拆成机制

上一篇总结的三条规则，这次原样复用：

1. **一次只改一个变量**；
2. **构造明确的状态**，而不是等它自然出现；
3. **结论必须能被下一次观测推翻**。

但这次多了一层：WorkBuddy 是闭源应用，行为藏在 98 MB 的 `app.asar` 里。光靠外部观测猜不到「它为什么不 show」，于是把排查拆成三条并行线：

| 线 | 问题 | 手段 |
|----|------|------|
| A. 外部观测 | 什么状态下窗口不显示？和哪些变量相关？ | 进程 / X 窗口 / 日志 / 截图 |
| B. 静态分析 | 它的窗口显示逻辑到底长什么样？ | 解包 `app.asar`，读窗口创建与事件回调 |
| C. Wine 层对照 | 为什么同一个 prefix 里另一个 Chromium 应用能显示？ | 两套 Wine 的版本、注册表、GPU 路径对比 |

三条线的交叉点，就是根因。

核心实验只保留了 5 组（有信息量的）：

| 实验 | 构造的状态 | 观察 | 结论 |
|------|-----------|------|------|
| E1 | Debian wine 10.0 启动 | 进程全在、窗口对象存在但 `IsUnMapped`；**7 天日志里 0 条 `ready-to-show`** | 首帧从未成立，`show()` 从未被调用 |
| E2 | 换 staging 11.19 启动 | 4 秒内 `IsViewable`，首次出现 `firstPaintMs=1647` | Wine 版本是决定变量 |
| E3 | staging + 8 组 Chromium 参数矩阵 | 3 组 4 秒出窗口；2 组必失败；无参数时好时坏 | 参数只能改变概率，不能保证 |
| E4 | 可重复性测试（每轮清场） | 同一参数多次运行成功率 1/3 ~ 2/2 不等 | 首帧本身有抖动 |
| E5 | 首帧卡住时「再启动一次」 | 5/5 在 16 秒内出窗口 | 单实例路径会强制 `show()` |

---

## 4. 观测面：进程、窗口与日志

启动完成后，WorkBuddy 的进程分工大致是：

| 进程（按 `--type=` 区分） | 角色 | 备注 |
|--------------------------|------|------|
| `WorkBuddy.exe`（无 `--type`） | 主进程 / Browser | Electron 主进程，窗口与 IPC |
| `--type=gpu-process` | GPU 进程 | 合成、栅格化 |
| `--type=renderer` | 页面渲染 | 界面「活着」的关键 |
| `--type=utility`（network） | 网络服务 | 代理、证书、请求 |
| `daemon-app-server-entry.js` | 后台 daemon | Agent 运行时 |
| `cli/bin/codebuddy --prewarm` | CLI 预热 | 模型 / 工具预热 |

窗口只有一个主窗口：

```
0x2e00007 "WorkBuddy"  1440x900+240+106   class=workbuddy.exe
  └─ (子窗口) 1432x720+4+62
```

**坑一：窗口对象存在 ≠ 窗口可见。** 这正是上一篇的核心教训，这次又踩了一遍。`xwininfo -root -tree` 里能查到 `"WorkBuddy"`，但它的属性是：

```bash
$ xwininfo -id <winid> | grep 'Map State'
  Map State: IsUnMapped
$ xprop -id <winid> WM_STATE
  WM_STATE: not found.
```

没有 `WM_STATE`，说明这个窗口**从来没被窗口管理器接管过**——不是被最小化、也不是被撤到托盘，而是根本没有 map 过。对照上一篇，UU 是 `Withdrawn`（被撤到托盘），这里是「从未出现」。

**坑二：应用自己的日志比 X 更早暴露问题。** 应用把渲染进程的角色写进了内存监控日志：

```json
{"level":"info","scope":"main",
 "message":["[RendererMemWatch] pid=832 type=Tab wcIds=1 wcTypes=window
             windowIds=1 role=hidden-window rss=183MB cpuPercent=0.0"]}
```

`role=hidden-window` 来自 `BrowserWindow.isVisible()`。也就是说：**应用自己也知道窗口不可见**。而它每秒都在写心跳、写 GC、写 perf 采样——程序完全健康，只是「不显示」。

**坑三：关键事件在日志里是「缺失」而不是「报错」。** 我最初一直在找 ERROR，其实真正的证据是一条**从来没出现过的 INFO**：

```bash
$ grep -a 'Window ready to show' ~/.wine/drive_c/users/<user>/.workbuddy/logs/main.log
$ echo $?
1
```

从安装到排查当天，`main.log` 里一条都没有。这个事件正是 Electron 文档里定义的那个：

> **ready-to-show**：*Emitted when the web page has been rendered (while not being shown) and window can be displayed without a visual flash.*

而应用代码里，主窗口是 `show: false` 创建的，`show()` **只**出现在 `once('ready-to-show')` 的回调里。所以逻辑链是一条死锁：

```
窗口以隐藏状态创建
   → 等待首帧（ready-to-show）
      → 首帧不成立
         → 永远不调用 show()
            → 窗口永远隐藏
```

这条链一旦成立，「进程健康」和「界面不显示」就完全不矛盾了。

---

## 5. 发现一：wine 10 下首帧永远不来

E2 是整件事的转折点。把启动器从 Debian 自带的 `wine`（10.0）换成 `/opt/wine-staging/bin/wine`（11.19）后，同一个应用、同一个 prefix、同样的参数：

```
[2026-10-23 21:36:52] [WindowManager] Window created
[2026-10-23 21:36:54] [WindowManager] Window ready to show (firstPaintMs=1647)
```

窗口 4 秒内 `IsViewable`，登录页正常渲染。**同一个二进制，换了个 Wine，就从「永不显示」变成「1.6 秒出首帧」。**

为什么偏偏是 Wine 版本？两条线索：

**线索一：旧版 Wine 的 stderr 里有明确的 GL 报错。** wine 10.0 下启动 WorkBuddy，GPU 进程会打：

```
err:d3d:wined3d_context_gl_set_pixel_format
    wglSetPixelFormatWINE failed to set pixel format 1 on device context ...
```

这条链路是「窗口 GL surface / pixel format 的设置」。它失败，意味着合成器拿不到一个可 present 的窗口 surface；拿不到 surface，就没有首帧；没有首帧，Electron 的 `ready-to-show` 就永远不会来。

**线索二：Wine 10.0 之后，这条链被整体重写过。** 翻阅 Wine 的提交记录，能看到 2025 年底有一批正好打在「窗口 DC / GL drawable / swapchain 生命周期」上的改动，例如：

- `win32u: Get rid of window internal pixel format` + `Set the DC pixel format too in wglSetPixelFormatWINE`（Wine-Bug 58846，黑屏类回归）
- `wined3d: Create / release the window DCs with the swapchains`（Wine-Bug 58491，D3D11 闪烁类回归）

这些是有据可查的同类症状（黑屏、闪烁、窗口内容不更新），**和 WorkBuddy 的「首帧不成立」属于同一类失败**。但要诚实：我**没有**逐行验证 WorkBuddy 具体死在哪个分支（是 `prev != format` 还是 `create_gl_drawable() == 0`），只能说「版本差异 + 报错位置 + 症状类型」三者吻合，且换版本后现象消失。

顺带排除了两个看起来很可疑、实际无关的变量：

| 候选 | 结论 |
|------|------|
| wine-staging 独有的 dcomp 补丁集 | **不是触发点**：实测 WorkBuddy 的所有 Wine 进程都没有加载 `dcomp.dll` |
| `HKCU\Software\Wine\AppDefaults\WorkBuddy.exe\Version=win8`（照搬 WebView2 做法） | **不必要**：可用的运行环境里根本没有这个键 |

---

## 6. 发现二：换成 wine 11 之后，它依然时好时坏

如果故事停在上一节，这篇就不用写了。真实情况是：**换 Wine 只是把成功率从 0% 抬到了「看运气」。**

用受控矩阵跑出来的数据（每轮清场后启动，最多等 45 秒）：

| 变体 | 结果 | 用时 |
|------|------|------|
| 无参数 #1 | ❌ 未显示 | 15s |
| 无参数 #2 | ❌ 未显示 | 4s |
| 预置「崩溃守卫 = 2」（看起来像 safe mode） | ❌ 未显示 | 47s |
| `--disable-gpu` | ✅ 显示 | 4s |
| `--disable-gpu-compositing` | ✅ 显示 | 4s |
| `--disable-direct-composition` | ✅ 显示 | 4s |
| `--in-process-gpu` | ❌ 未显示 | 46s |
| 写 `gpu-crash-info.json` 让应用自动降级 | ❌ 未显示 | 46s |

看起来 `--disable-gpu` 一类的开关有效？继续做可重复性测试（每轮清场，最多等 30 秒）：

| 变体 | 成功次数 |
|------|---------|
| 无参数 | 1/2 |
| `--disable-direct-composition` | 1/3 |
| `--disable-gpu-compositing` | 2/2 |
| `--disable-gpu --disable-gpu-compositing` | 2/2 |

**没有任何参数能保证成功。** 而且失败不是「快速失败」，而是「一直等」——`ready-to-show` 不触发，窗口就一直不显示。

更麻烦的是，首帧的延迟本身也极不稳定。把当天所有成功触发的 `firstPaintMs` 拉出来看：

```
1647 / 150562 / 976 / 826 / 688 / 737 / 1418 / 786
```

单位是毫秒。大多数是 0.7 ~ 1.7 秒，但**有一次拖到了 150.6 秒**。

这条数据直接改变了两件事：

1. **不能把「慢」当「死」。** 如果启动器 30 秒没看到窗口就杀进程重启，很可能杀掉的是一个正在慢慢出首帧的实例，然后进入「永远重启」的循环——和上一篇里我自己制造的那个 bug 一模一样。
2. **启动器的等待预算要按最坏情况给。** 应用自己有个 180 秒的 `RendererLoadGuard`，但它只管「renderer 的 JS 没跑完」；JS 早就跑完了、就是不出首帧的情况，它救不了。

到这里，「为什么展示不出来」已经清楚了，但还缺最后一块：**既然应用自己不会 show，能不能从外部逼它 show？**

---

## 7. 发现三：再启动一次就能催帧

答案来自静态分析（线 B）。`app.asar` 里主窗口有 5 处显示相关的调用，其中一处非常关键：

```js
// 伪代码（来自 main-bootstrap.js，已简化）
showOrCreate() {
  if (this.mainWindow && !this.mainWindow.isDestroyed()) {
    this.mainWindow.isMinimized() && this.mainWindow.restore();
    this.mainWindow.show();      // ← 直接 show()，不等 ready-to-show
    this.mainWindow.focus();
    return;
  }
  this.createWindow();
}
```

而它的调用方之一，就是**单实例路径**：再启动一次 `WorkBuddy.exe` → 第二个进程拿不到单实例锁 → 走 `second-instance` 处理 → `showOrCreateMainWindow()` → `showOrCreate()` → **直接 `show()`**。

换句话说：**「再点一次图标」不只是唤醒隐藏窗口，它还是首帧卡住时的「催帧」手段。** 窗口被强制 map 之后，合成器有了可 present 的 surface，首帧随即到来，`ready-to-show` 再触发一次 `show()`（幂等，无副作用）。

实测 5 轮：

| 轮次 | 启动参数 | 前 12 秒内显示 | 唤醒后显示 | 总用时 |
|------|---------|---------------|-----------|--------|
| 1 | 无参数 | 否 | ✅ | 16s |
| 2 | 无参数 | 否 | ✅ | 16s |
| 3 | 无参数 | ✅ | — | 6s |
| 4 | 软件渲染参数 | ✅ | — | 6s |
| 5 | 软件渲染参数 | 否 | ✅ | 16s |

**5/5 都在 16 秒内出窗口**，其中 3 轮原本会一直卡住。对照 E4 的数据，这就把「看运气的 1/3 ~ 2/2」变成了「确定可用」。

顺便确认了单实例行为本身也是健康的：第二次启动的进程约 350ms 就退出，不会留下重复实例；它只是把「显示窗口」这个请求转交给了第一个实例。

---

## 8. 启动器设计

到这里，机制齐了，启动器只是把机制翻译成状态机：

```
启动器
 ├─ 更新安装中？→ 等安装结束（否则拉起即退出，见坑 4）
 ├─ 已有实例跑在旧 wine10 栈？→ 清掉（否则窗口永远不显示）
 ├─ 已有实例且窗口可见？→ 激活前置，0 秒返回
 ├─ 已有实例但窗口不可见？→ 二次启动唤醒
 └─ 全新启动：
      启动 → 每 2 秒判活（Map State == IsViewable？）
        ├─ 显示 → 完成（约 16~20 秒）
        └─ 8s / 25s / 60s 仍未显示 → 各补一次二次启动唤醒
             └─ 180 秒仍未显示 → 换软件渲染参数再试一次（兜底）
```

判活只有一条硬标准（来自上一篇的教训）：

```bash
# 只有 Map State == IsViewable 才算「窗口真的显示出来了」
mainwin_count() {
    local _w _n=0
    for _w in $(win_ids); do
        [ "$(win_mapstate "$_w")" = "IsViewable" ] && _n=$((_n+1))
    done
    echo "$_n"
}
```

核心的「启动 + 唤醒」循环，去掉边界处理后是这样：

```bash
start_with_wake() {          # $1=等待预算（秒） 其余=启动参数
    local _budget="$1"; shift
    launch_bg "$@"
    local t0=$(date +%s) woke=0 next=8
    while :; do
        sleep 2
        visible && return 0                      # ← 判据：IsViewable
        el=$(( $(date +%s) - t0 ))
        [ "$el" -ge "$_budget" ] && return 1
        # 首次失败不是「重启」，而是「再启动一次」：
        # 第二个进程会走单实例路径，强制第一个实例 show()
        if [ "$woke" -lt 3 ] && [ "$el" -ge "$next" ]; then
            launch_bg "$@"
            woke=$((woke+1))
            case $woke in 1) next=25 ;; 2) next=60 ;; *) next=99999 ;; esac
        fi
    done
}
```

几个工程细节：

**8.1 更新安装中不能拉启动。** WorkBuddy 的自动更新是「下载就绪 → 下次启动时在出窗口前直接退出安装」。诊断期间正好撞上 5.8.2 → 5.8.3：进程起来 2.5 秒就退，日志写着 `ready update restored before window, quitting to install`，然后跑 NSIS 安装器，约 2 分 17 秒装完，再自动拉起。如果启动器在这种状态下反复拉起，就会形成「装更新 → 被拉起 → 又装更新」的循环。判据有两层：

```bash
updating() {
    [ -e "$PROGDIR/.update-installing" ] && return 0      # 应用自己写的安装标记
    pgrep -f 'WorkBuddy-Setup-[0-9.]*\.exe' >/dev/null && return 0
    return 1
}
```

**8.2 旧 wine 栈要识别并清掉。** 如果用户之前点过旧的 `.lnk`（走 `wine-stable`），会留下跑在 wine 10.0 上的实例；启动器通过进程的真实 exe 路径判断它属于哪套 Wine：

```bash
build=$(readlink "/proc/$pid/exe")
case "$build" in
    /opt/wine-staging/*) wine=staging ;;
    /usr/lib/wine/*)     wine=debian  ;;   # 旧栈 → 先清掉再按 staging 启动
esac
```

**8.3 和另一个 Wine 应用共用 prefix，所以绝不 `wineserver -k`。** 这台机器上 WorkBuddy 和 UU远程 共用 `~/.wine` 和同一个 staging wineserver。`wineserver -k` 会把 UU 一起杀掉，所以本启动器只做 `taskkill /IM WorkBuddy.exe`：

```bash
kill_wb() {
    timeout 25 "$WINE" taskkill /F /IM WorkBuddy.exe >/dev/null 2>&1 || true
    for p in $(pgrep -f 'WorkBuddy[.]exe'); do kill -9 "$p" 2>/dev/null; done
}
```

**8.4 不装 xdotool 也能把窗口带到前台。** 本机没有 `xdotool`，用 Xlib 发一个 EWMH `_NET_ACTIVE_WINDOW` 客户端消息就行（几行 `ctypes`，`wb-run` 里内置）。

**8.5 启动器自己的三层防护**：`timeout -k 5 600` 硬超时、`mkdir` 原子锁防连点、`setsid --fork` 双 fork 避免被长命 wine 子进程留住——这三条都是从上一篇抄来的，实测有效。

---

## 9. 踩坑记录

### 9.1 「崩溃守卫 / safe mode」是个红鲱鱼

排查中途发现应用目录下有个 `.window-crash-guard`，值累计到了 2，日志里还会打：

```
[WindowManager] Crash guard triggered: 2 consecutive crashes, entering safe mode
```

「safe mode」听起来像是会改变显示行为，于是设了个假设：删掉它导致不显示。结果解包 `app.asar` 逐行读完，**`shouldEnterSafeMode` 只用来打这一行 warn**：不参与窗口构造、不改 `webPreferences`、不影响首帧。写它、删它、留着它，行为完全一致——**相关性被误当成了因果**，这是本次最大的时间浪费。

### 9.2 「加个参数就好了」是采样偏差

矩阵里 `--disable-gpu` 一次 4 秒成功，很容易就此收工。但把同一参数重复跑，成功率立刻掉下来（1/3 ~ 2/2）。**单次成功不能证明因果**，尤其当底层本来就有 50% 抖动时。

### 9.3 `pgrep -f` 会匹配到自己

清理进程时写了一行：

```bash
for p in $(pgrep -f 'WorkBuddy\.exe'); do kill -9 "$p"; done
```

结果当前 shell 直接消失——因为这条命令本身的命令行里就包含 `WorkBuddy\.exe`。修法和上一篇一样：杀进程逻辑写进脚本文件，匹配模式用字符类打断自匹配（`'WorkBuddy[.]exe'`）。

### 9.4 XWayland 下 `xwd -root` 抓不了全屏

想截整个屏幕做证据，`xwd -root` 直接 `BadMatch`；换 `ffmpeg x11grab` 出来的是一张纯黑图（1920×1080 只有 1 种颜色）。**XWayland 下根窗口没有可读像素**，只能对具体窗口 `xwd -id`。隐藏窗口则完全无法截图——没有 map 就没有像素，只能靠 Map State 和日志判断。

### 9.5 窗口 ID 每次重启都会变

`0x2e00007` 只是本次会话的 ID，重启后变成 `0x2800007`、`0x3200007` 之类。所有脚本必须**现查**，不能缓存。顺手提一句：`xwininfo` 的窗口树里混着 `WineD3D fake window`、`DXGI device window` 这类同名干扰项，按名字匹配时要认准带 `"WorkBuddy"` 标题的那个。

### 9.6 一个不该忽略的实验污染源

应用有个自我降级逻辑：`gpu-crash-info.json` 存在且 24 小时内发生过错 → 下次启动自动 `disableHardwareAcceleration()` + `--disable-gpu` + `--disable-gpu-compositing`。做参数实验时我手动构造过这个文件，结果**后续几轮实验全被它污染**。教训：做过一次实验后要清理所有「实验残留状态」（`gpu-crash-info.json`、崩溃守卫、窗口状态），否则后面的对照都不干净。

---

## 10. 验证：没有 GUI 也能验收

远程/无头环境下的验收，这次同样分三层：

**第一层：应用侧。** 只看两个信号——窗口 `Map State == IsViewable`，以及 `main.log` 里出现新的 `Window ready to show (firstPaintMs<10000)`。

**第二层：像素级。** 对主窗口 `xwd`，再用纯 Python 解析成 PNG，统计「颜色数 / 亮度标准差 / 四分区亮度」：

```
target=0x... 1440x900  parse=32bpp/LE/... start=3182(size-derived) bpl=5760 ncolors=256
colors=2379  brightness: mean=252.0 std=22.2
quad(TL/TR/BL/BR)=252.8/253.2/251.1/251.0  white=97.7% dark=0.7%
verdict=rendered
```

再把图缩成 92×30 的 ASCII 亮度图，避免「大图逐像素」把自己 OOM 掉。这次能直接从 ASCII 里认出中间的 logo、标题和登录按钮：

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@*@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@# .--: +@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%.  ..:..#@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=    ..-%@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*-    -#@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%      . %@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@#+##***##**%@@=+=+=#@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@%@@%%%%%%%%@%%%%%@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@#====++====*@@@@@@@@@@
```

**第三层：端到端时序。** 记录「点击 → 可见主窗口」的秒数，而不是只看最终状态。启动器三连测：

| 轮次 | 结果 | 耗时 |
|------|------|------|
| 1 | ✅ `visible(healthy)` | 16s |
| 2 | ✅ `visible(healthy)` | 17s |
| 3 | ✅ `visible(healthy)` | 17s |

已在运行时的幂等行为：再点图标 **0 秒**返回并前置已有窗口，不打扰当前会话。

---

## 11. 结果与边界

最终指标：

| 场景 | 耗时 |
|------|------|
| 冷启动（完全停止后） | 16~20 秒出主窗口 |
| 已在运行，再点图标 | 0 秒返回并前置 |
| 窗口被隐藏到托盘后 | 4~16 秒唤醒 |
| 首帧卡住（本来会一直等） | 二次唤醒后 4~8 秒出窗口 |
| 更新安装中 | 自动等待安装结束再拉起，无需人工干预 |

边界也要说清楚：

- **首帧的抖动没法从根上消除**（wine 11.19 下仍有概率），启动器只是用「二次唤醒 + 长等待」把它变成确定可用的体验；偶尔窗口先出骨架屏、20~40 秒才出登录页，属正常。
- **Chromium 参数只能提高概率**，不能作为解决方案；作为兜底保留。
- **Wine 版本必须 ≥ 11.x**，具体最低版本没有逐版二分（只验证了 10.0 必坏、11.19 可用）。
- **与另一个 Wine 应用共用 prefix 是当前环境的约束**。真要彻底隔离，可以给 WorkBuddy 单独开 prefix，但需要重装 + 迁移用户数据（登录态、会话库），性价比不高，没做。
- **旧的 `.lnk` / MIME 打开方式仍是 wine10**，这次只改了桌面与 Dock 入口；从文件管理器双击旧快捷方式仍会退回「永不显示」。
- 只覆盖主窗口显示链路；登录、会话、Agent 运行这些功能层面的东西没动。

---

## 12. 方法论

整件事压缩成一句话：**先证明「程序没坏」，再证明「显示链路的哪一环没发生」，最后用外部手段补上那一环。**

几条具体的体会：

1. **「没有报错」不等于「没有问题」。** 这次的关键证据是一条**从未出现的 INFO 日志**。排障时不能只 `grep -i error`，还要问「按照它的设计，本来应该出现什么日志」。
2. **窗口对象存在，和窗口可见，是两件事。** 上一篇用 `WM_STATE=Withdrawn` 掰开过一次，这次换成 `Map State=IsUnMapped` 又来一次。判活永远要看到「真的显示出来了」这一层。
3. **单一成功样本不能推出因果。** 参数矩阵里 3 个「成功」的变体，重复跑之后成功率全部下降。要证伪，就要重复、要构造。
4. **闭源应用也能做机制分析。** `app.asar` 是打包的 JS，虽然没有源码，但字符串、事件名、函数逻辑都在。把「它自己以为发生了什么」读出来，比从外部猜快得多。
5. **抖动不是敌人，「把抖动当崩溃」才是。** 首帧可能 0.7 秒，也可能 150 秒；正确的做法是给足预算 + 提供催促手段，而不是超时就杀。上一篇的「一直重启」也是这么来的。

---

## 13. 附录

### 13.1 文件与职责

| 文件 | 职责 |
|------|------|
| `~/wb-run` | 启动器：Wine 校验、更新等待、旧栈清理、状态机、二次唤醒、兜底 |
| `~/wb-diag` | 只读诊断：Wine 版本 / 实例数 / 窗口 MapState / 渲染进程 / 更新中 / 结论 |
| `~/wb-debug/tools/wb-probe.sh` | 结构化探针（`visible/hidden/broken-wine/no-process/updating/zombie`） |
| `~/wb-debug/tools/wb-shot.py` | `xwd` → PNG + 颜色数/亮度统计 + ASCII |
| `~/wb-debug/tools/wb-monitor.sh` | 窗口状态变化监控 / `--until-visible` |
| `~/wb-client-stderr.log` | 启动器里程碑 + wine 子进程输出 |

### 13.2 日志里程碑

```
── 启动 ── wine=… (wine-11.19 (Staging))
当前 WB wine build: staging
启动客户端（staging 11.19 + 二次启动唤醒）
首帧/窗口未就绪，执行第 1 次二次启动唤醒（t=8s）
主窗口已显示（用时 16s，唤醒次数=1）
启动完成
```

### 13.3 常用命令

```bash
wb-run                # 点图标做的事：前置 / 唤醒 / 启动
wb-run --state        # 只读状态
wb-run --wake         # 窗口隐藏或首帧卡住时手动催一下
wb-run --stop         # 只停 WorkBuddy（不碰共用 wineserver）
wb-diag               # 完整体检 + 处置建议

# 判活（关键：Map State 必须 IsViewable）
DISPLAY=:0 xwininfo -root -tree | grep '"WorkBuddy"'
DISPLAY=:0 xwininfo -id <winid> | grep 'Map State'

# 首帧是否触发
grep -a 'Window ready to show' ~/.wine/drive_c/users/<user>/.workbuddy/logs/main.log | tail -1
```

### 13.4 参考

- Electron `BrowserWindow` 文档（`ready-to-show` 事件定义）：<https://www.electronjs.org/docs/latest/api/browser-window#event-ready-to-show>
- ICCCM 4.1.4 `WM_STATE`（窗口状态语义）：<https://tronche.com/gui/x/icccm/sec-4.html>
- Wine-Bug 58846（`wglSetPixelFormatWINE` / 窗口像素格式不同步，黑屏类回归）：<https://bugs.winehq.org/show_bug.cgi?id=58846>
- Wine-Bug 58491（窗口 DC 与 swapchain 生命周期，D3D11 闪烁类回归）：<https://bugs.winehq.org/show_bug.cgi?id=58491>
- Wine OBS 仓库（Debian 13 原生 staging 包）：<https://software.opensuse.org/download/package?package=wine-staging-amd64&project=Emulators%3AWine%3ADebian>

---

> 上一篇写 UU远程 时我说，长期稳定不是靠多写几个 `if`，而是靠把程序的行为搞清楚。这篇算是同一句话的另一个注脚：**这次连「多写几个 if」的机会都没有——因为程序没有坏，坏的是「显示」这一步的前提条件。** 搞清楚它缺哪一环，比修一个不存在的 bug 有用得多。
>
> 姐妹篇：[《让网易UU远程在 Debian 13 的 Wine 下稳定运行》](/blog/2026/10/gameviewer-wine/)
