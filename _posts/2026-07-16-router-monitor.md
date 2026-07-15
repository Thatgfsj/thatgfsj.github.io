---
layout: post
title: "用 C++ 写一个 ZTE 路由器实时网速监控小工具"
date: 2026-07-16 04:30:00 +0800
tags: [C++, Win32, 逆向, 网络, 工具]
description: "从浏览器抓包逆向 ZTE 路由器的私有协议，到用纯 Win32 + WinHTTP 写一个 ~1.5 MB 单文件 Windows 监控程序。涵盖协议分析、C++ 工程结构、GDI+ 自绘表格、HUD 悬浮窗、以及开发过程中踩过的几个坑。"
---

> 本文记录我从零开始写一个 ZTE 家用路由器实时网速监控工具的全过程，重点是抓包 → 协议逆向 → 工程实现 → 修 bug 这条主线。文中的所有路由器地址、MAC、SSID、设备名、密码、token 均经过脱敏处理。

---

## 目录

1. [背景：为什么自己写](#1-背景为什么自己写)
2. [目标拆解](#2-目标拆解)
3. [抓包：找路由器的私有 API](#3-抓包找路由器的私有-api)
4. [协议分析：三步登录](#4-协议分析三步登录)
5. [协议分析：设备列表轮询](#5-协议分析设备列表轮询)
6. [工程结构](#6-工程结构)
7. [核心模块实现](#7-核心模块实现)
8. [UI：GDI+ 自绘表格 + HUD](#8-uigdi-自绘表格--hud)
9. [踩坑记录](#9-踩坑记录)
10. [凭证独立存储](#10-凭证独立存储)
11. [构建与产物](#11-构建与产物)
12. [附录：关键文件位置](#12-附录关键文件位置)

---

## 1. 背景：为什么自己写

家里那台 ZTE 路由器的后台管理页面只提供「设备列表」+「每个设备当前总流量」，看不到实时速度，也看不到每个设备的上下行峰值曲线。市面上有几款通用网速监控工具，要么要装 NPcap 抓全网流量（太重），要么只能监控本机（解决不了问题）。

我想要的很简单——一个常驻系统托盘的小窗，告诉我：

- 现在路由器上每个接入设备**当前的上下行速率**是多少
- 总速率是多少
- 选中某个设备能看到近 10 分钟的速率曲线

为了不绕弯路，我决定直接读路由器自己的 API：反正管理页面已经在展示设备信息了，那些数据一定来自某个我能调用的接口。

---

## 2. 目标拆解

把目标拆成几个明确的子问题：

| 子问题 | 决定 |
|--------|------|
| UI 框架 | 不用 MFC/Qt/ATL，原生 Win32 + GDI+，单文件 exe，无运行时依赖 |
| HTTP 客户端 | WinHTTP（系统自带） |
| JSON 解析 | 自己写一个 ~300 行的极简 parser（项目依赖少一个就少一个坑） |
| 加密 | 系统 bcrypt 算 SHA-256（路由器密码 = sha256(token + 明文密码)） |
| 轮询频率 | 2 秒一次 |
| 历史曲线 | 每个设备保存最近 300 个采样点（10 分钟） |

单文件 ~1.5 MB、零运行时依赖、CPU 占用几乎为零——这是验收标准。

---

## 3. 抓包：找路由器的私有 API

### 3.1 准备

浏览器登录管理后台（一般是 `http://192.168.x.1/`），打开 DevTools → Network → 过滤 `middleware.cgi`。这是 ZTE 系路由器最常用的私有接口端点，所有管理类操作都走这里。

### 3.2 观察到的请求模式

抓到的请求长这样（脱敏）：

```
POST http://192.168.x.1/cgi-bin/middleware.cgi
Content-Type: application/json

{
  "key": "login",
  "method": "login",
  "param": {
    "user": "admin",
    "passwd": "<sha256-hex>",
    "level": 3
  }
}
```

响应：

```json
{
  "result": 0,
  "sessionId": "Njxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "account_level": 3
}
```

也就是说：**单个端点 + JSON body + 字段路由**（`key` 表示模块，`method` 表示动作，`param` 是参数包）。这是典型的中移 / ZTE 设备私有协议风格。

继续翻 DevTools 又看到：

- 登录前会发一次 `devinfo/getaccount`，返回设备信息（用户、本机 IP、临时密码）
- 登录前还会发一次 `devinfo/login_prepare`，拿到一个 per-session 的 token
- 登录后所有请求的 body 都会带 `sessionId` 字段

这三步不是冗余——`login_prepare` 返回的 token 是用来混淆密码的，登录时实际提交的是 `sha256(token + 明文密码)`。

### 3.3 找到设备列表接口

在「设备列表」页面刷新一次，观察到的请求是：

```
POST /cgi-bin/middleware.cgi

{
  "key": "laninfo",
  "method": "list",
  "sessionId": "..."
}
```

响应里有个巨大的 `data` 数组，每个元素是一台接入设备，含 `mac`、`devname`、`ipaddr`、`radio`、`txrate`、`rxrate`、`uptime` 等字段。

到这里协议已经齐了，可以开始写代码。

---

## 4. 协议分析：三步登录

```
客户端                                 路由器
  │                                     │
  │  ① POST devinfo/getaccount          │
  │────────────────────────────────────>│
  │<────────────────────────────────────│
  │   { user, addr=<本机IP>, ... }       │
  │                                     │
  │  ② POST devinfo/login_prepare       │
  │     param: { devipaddr: addr }      │
  │────────────────────────────────────>│
  │<────────────────────────────────────│
  │   { token: "9876543210" }           │
  │                                     │
  │  ③ POST login/login                  │
  │     param: { user,                   │
  │               passwd: sha256(        │
  │                 token + password),   │
  │               level: 3 }             │
  │────────────────────────────────────>│
  │<────────────────────────────────────│
  │   { sessionId: "...", result: 0 }   │
```

### 4.1 为什么是 sha256(token + password)

`getaccount` 拿到的 `newpasswd` 字段很多人会以为是新密码，其实是路由器为这次登录生成的临时密码，**login 步骤里完全用不到**——这只是路由器在告诉你「如果你想改密码，请用这个」。

真正的口令混淆方式是：

```
sha256_hex(login_prepare.token + 用户明文密码)
```

这样服务器端能验证（双方都知道 token），但网络抓包里看不到明文密码。

### 4.2 sessionId 的本质

`sessionId` 实际就是 `base64("1a2b3c...")` 一段随机串的 base64 编码。后续所有请求把它放在 body 的 `sessionId` 字段里，**不需要 Cookie**——这是这套协议和 HTTP 标准认证最大的区别。

---

## 5. 协议分析：设备列表轮询

登录成功后，每 2 秒轮询一次：

```
POST /cgi-bin/middleware.cgi

{
  "key": "laninfo",
  "method": "list",
  "sessionId": "..."
}
```

响应：

```json
{
  "result": 0,
  "data": [
    {
      "mac": "AA:BB:CC:DD:EE:FF",
      "devname": "anonymous",
      "ipaddr": "192.168.x.10",
      "radio": "5G",
      "ssid": "Example-WiFi-5G",
      "rssi": -45,
      "txrate": "33.150",
      "rxrate": "0.000",
      "uptime": 12345
    },
    ...
  ]
}
```

### 5.1 单位坑

`txrate` / `rxrate` 字段单位是 **Mbps（字符串）**，不是 KB/s，也不是 Byte/s。所以读出来后要做一次换算：

```
KB/s = Mbps × 1024 / 8
```

注意是 1024 不是 1000——路由器内部用的就是 1024 进制。

### 5.2 「平均速率」字段

仔细看响应里其实还有两个嵌套对象：

```
ifaRate: { averrxrate: "...", avertxrate: "...", maxrxrate: "...", maxtxrate: "..." }
if6Rate: { averrxrate: "...", avertxrate: "...", maxrxrate: "...", maxtxrate: "..." }
```

`ifaRate` 是 IPv4 累计平均，`if6Rate` 是 IPv6 的。这俩字段在「当前是否在传数据」这件事上比 `txrate/rxrate` 更准——后者是瞬时采样，前者是滑动窗口。我优先用 `ifaRate.avertxrate`，为空才退化到 `txrate`。

### 5.3 设备去重

路由器偶尔会返回同一个 MAC 的多条记录（5G 和 2.4G 同一台设备时会出两条）。我用 `unordered_set<MAC>` 做一次去重，保留第一条。

---

## 6. 工程结构

```
RouterMonitor/
├── CMakeLists.txt
├── build.bat                   # 一键编译
├── README.md
├── include/
│   ├── HttpClient.h            # WinHTTP 封装
│   ├── JsonParser.h            # 极简 JSON 解析
│   ├── Config.h                # INI 配置（非凭证部分）
│   ├── Credentials.h           # 凭证 JSON 文件
│   ├── Sha256.h                # SHA-256 封装
│   ├── RouterApi.h             # 路由器协议封装
│   ├── PollerThread.h          # 后台轮询
│   ├── RingBuffer.h            # 历史采样环形缓冲
│   └── ui/
│       ├── MainWindow.h
│       ├── HudWindow.h
│       └── TrayIcon.h
└── src/
    ├── main.cpp
    ├── HttpClient.cpp
    ├── JsonParser.cpp
    ├── Config.cpp
    ├── Credentials.cpp
    ├── Sha256.cpp
    ├── RouterApi.cpp
    ├── PollerThread.cpp
    └── ui/
        ├── MainWindow.cpp
        ├── HudWindow.cpp
        └── TrayIcon.cpp
```

11 个源文件 + 11 个头文件，单线程模型（轮询是 worker thread，UI 是主线程，通过 PostMessage 投递快照）。

---

## 7. 核心模块实现

### 7.1 HttpClient

只做一件事：`POST application/json`，自动管理 Cookie（实际登录后只用 sessionId 字段，但 Cookie 兜底）。

WinHTTP 用法不复杂，重点是：

- `WinHttpOpen` → `WinHttpConnect` → `WinHttpOpenRequest` → `WinHttpSendRequest` → `WinHttpReceiveResponse` → 循环 `WinHttpReadData`
- `WINHTTP_QUERY_SET_COOKIE` 提取服务器下发的 Cookie 并合并

请求体里的非 ASCII 字符直接当 UTF-8 字节流塞进 `WinHttpSendRequest` 的 lpOptional 即可。

### 7.2 JsonParser

只读 parser，~300 行。结构如下：

```cpp
enum class JsonType { Null, Bool, Number, String, Array, Object };

struct JsonValue {
    JsonType type = JsonType::Null;
    bool   b = false;
    double n = 0.0;
    std::string s;
    JsonArray  a;
    JsonObject o;        // vector<pair<string, unique_ptr<JsonValue>>>
};
```

便利接口：

- `Str("key", default)`：取字符串，找不到或类型不对返回默认值
- `Num("key", default)`：取数字
- `Find("key")`：取子节点指针
- `At(i)`：数组下标

登录响应、设备列表这种 JSON 复杂度，一个 parser 完全够用。**没有 escape/unescape 之外的复杂场景**——`\uXXXX` 转 UTF-8 也实现了，少数路由器会在某些字段里夹带中文设备名。

### 7.3 RingBuffer

历史采样用模板化的环形缓冲，固定容量 300：

```cpp
template <typename T>
class RingBuffer {
public:
    explicit RingBuffer(size_t capacity);
    void Push(T v);
    std::vector<T> Snapshot() const;
    size_t Size() const;
    size_t Capacity() const { return capacity_; }
private:
    std::vector<T> buf_;
    size_t head_ = 0;
    size_t size_ = 0;
    size_t capacity_;
};
```

`Snapshot()` 返回一个 vector 给 UI 线程画曲线。每次快照是 O(n) 拷贝，但 n = 300 可以忽略。

### 7.4 RouterApi

封装三步登录 + 设备列表轮询，**成员变量非常薄**：

```cpp
class RouterApi {
public:
    bool Login(std::string* err = nullptr);
    std::vector<Device> GetDevices(std::string* err = nullptr);

    bool IsLoggedIn() const { return logged_in_; }
    const std::string& MyIp() const { return my_ip_; }
private:
    HttpClient http_;
    std::string host_, user_, pass_;
    std::string session_id_;
    std::string my_ip_;
    bool logged_in_ = false;
};
```

`Login()` 失败时清掉 `session_id_` 并清空 HttpClient 的 Cookie，下次重新走完整三步。`GetDevices()` 在结果里发现 `result != 0` 就把错误冒泡上去，由上层决定是否重试。

### 7.5 PollerThread

后台线程，2 秒 tick 一次：

```cpp
while (running_.load()) {
    auto snap = std::make_shared<Snapshot>();
    if (!api_->IsLoggedIn()) api_->Login(&err);
    if (api_->IsLoggedIn()) {
        auto devices = api_->GetDevices(&err);
        snap->login_ok = true;
        snap->my_ip   = api_->MyIp();
        // 增量更新 state_，每个设备 push 一个 sample
        for (const auto& d : devices) {
            auto& s = state_[d.mac];
            s.info = d;
            s.history.Push({d.tx_kbps, d.rx_kbps, snap->unix_ms});
            snap->devices.emplace(d.mac, copy_of(s));
        }
    }
    on_snapshot_(snap);    // 通过 PostMessage 投递到 UI 线程

    next_tick += 2s;
    // sleep_for(50ms) 切片，Stop() 50ms 内生效
}
```

**为什么用 shared_ptr 投递？** UI 线程画曲线要遍历 history，worker 不能释放老 snapshot。shared_ptr 让 UI 线程用完就自动释放，无需手动 delete。

---

## 8. UI：GDI+ 自绘表格 + HUD

### 8.1 主窗口

原生 Win32，无 GDI+ 模板。WM_PAINT 里：

1. `CreateCompatibleDC` 双缓冲
2. 画分区背景（summary / header / table / trend）
3. `DrawTextW` 画文字
4. `FillSolid` 画行背景 + 选中/hover 高亮
5. `BitBlt` 一次性贴到屏幕

每行 30px 高，5 列：设备名、IP、频段、下行速率、上行速率。速率列右下角画一根 4px 高的速率条，长度按 10 MB/s 满量程映射。

### 8.2 排序

表头是 5 个按钮，点一下切排序键。同一列再点切升降序。排序逻辑放在 worker 线程里做：

```cpp
auto cmp = [this](const DeviceState* a, const DeviceState* b) {
    switch (sort_.col) {
        case ColRx: return sort_.descending ? a->info.rx_kbps > b->info.rx_kbps
                                            : a->info.rx_kbps < b->info.rx_kbps;
        // ...
    }
};
std::sort(sorted_.begin(), sorted_.end(), cmp);
```

`std::sort` + 指针数组，O(n log n) 完全够用——设备数最多两位数。

### 8.3 历史趋势

选中某一行后，底部画一条曲线：横轴时间（最近 10 分钟），纵轴 KB/s。把采样点 normalize 到窗口坐标系，`Polyline` 连起来。下行绿色，上行橙色。

### 8.4 HUD 悬浮窗

半透明 `WS_EX_LAYERED`，`SetLayeredWindowAttributes` 设 alpha = 200，永远置顶。显示两行字：总下行、总上行。每秒刷新一次数值，颜色按速率档位变（灰 < 100 KB/s < 绿 < 橙 < 红 5 MB/s+）。

---

## 9. 踩坑记录

### 9.1 `session error` 偶发

**现象：** 轮询日志里每隔几秒能看到一次 `{"result": -255, "failreason": "session error"}`，紧接着的下一次轮询又正常。

**根因：** 上一版的 worker tick 里忘了在轮询失败后复位 `login_attempted`，结果连续几个 tick 共用同一个失效 session，每隔 N 次轮询都会报错。直到下一次偶然的 Login 才恢复。

**修法：** 检测到 `result != 0` 或会话失效类错误时立即 `login_attempted = false`，下一个 tick 强制重新登录。

### 9.2 设备列表双份显示

**现象：** UI 上每台设备显示两行。

**根因：** 一行 `sorted_.push_back(&kv.second);` 被复制粘贴时多打了一次：

```cpp
sorted_.push_back(&kv.second);
sorted_.push_back(&kv.second);   // ← 多余的这一行
```

肉眼测过几次没看出来，因为渲染时上下两行看起来像「选中态」。

**修法：** 删掉重复的那一行。

### 9.3 本机无法识别

**现象：** 不知道自己哪台设备是「我」。

**根因：** `login_prepare` 步骤拿到的 `devipaddr` 是路由器的 IP 字段（路由器视角的本机 IP），但代码当时只把它放在 `Login()` 的局部变量里，没保存下来。

**修法：** 在 `RouterApi` 加 `my_ip_` 成员，`Login()` 里 `my_ip_ = root->Str("addr")`。`Snapshot` 增加 `my_ip` 字段，`Worker` 拷过去。`ApplySnapshot` 把 `snap->my_ip` 存到 `MainWindow::my_ip_`，`DrawTable` 绘制设备名时如果 `d.ipaddr == snap->my_ip` 就追加「(本机)」后缀。

副作用：之前一直不可用的「仅本机」过滤器也一并修好了。

### 9.4 show_only_* 几个 UI 状态变量没声明

**现象：** 编译报 `undeclared identifier 'show_only_online_'`。

**根因：** 这些是「仅在线 / 仅本机」复选框对应的成员变量，只在 `.cpp` 里被引用，`.h` 里没声明。是早期一次重构留下的尾巴。

**修法：** 在 `MainWindow.h` 私有区补上：

```cpp
bool show_only_online_  = false;
bool show_only_local_   = false;
HWND hwnd_only_local_btn_ = nullptr;
```

---

## 10. 凭证独立存储

### 10.1 早期结构

最初 host / user / pass 跟 interval、hud_enabled、start_minimized 等其他设置一起塞在 `%APPDATA%\RouterMonitor\config.ini` 里。问题是：

- 用户在路由器官网改了密码后，得手动找到并编辑 INI 里的 `pass_b64=...`，否则下次启动就登不上
- INI 是给程序读的，不是给人读的
- 改密码不应该影响其他 UI 偏好设置

### 10.2 拆分方案

把凭证独立成 `Credentials` 模块，存到一份 JSON：

```json
{
  "host": "192.168.x.1",
  "user": "admin",
  "pass": "<plain-or-base64>"
}
```

加载顺序：

1. `<exe-dir>\credentials.json` —— 用户手动管理的副本，优先
2. `<exe-dir>\accounts.ini` —— 旧版遗留，自动迁移并弃用
3. `%APPDATA%\RouterMonitor\credentials.json` —— 全局默认

写入顺序：

- 优先写 exe-dir（用户改起来最方便）
- 写不动再写 APPDATA

### 10.3 后果

`Config` 模块只剩 UI 偏好（轮询间隔、HUD 默认开关、是否最小化启动、历史容量）。`main.cpp` 启动流程变成：

```cpp
rm::Config cfg;
cfg.Load();

rm::Credentials cred;
if (force_login || !cred.Load() || !cred.Valid()) {
    // 弹登录框
    cred.host = cr.host;
    cred.user = cr.user;
    cred.pass = cr.pass;
    cred.Save();
}

mw.StartPolling(cred.host, cred.user, cred.pass,
                cfg.poll_interval_ms, cfg.history_capacity);
```

下次路由器改密码，删掉 `credentials.json`、重启即可触发重新登录对话框，UI 偏好（窗口大小、轮询频率）不会丢。

> 注：密码目前是明文存 JSON。和原来 config.ini 里的 base64 一样，都不是真的加密。如果想要更稳的方案，下一步可以上 DPAPI（`CryptProtectData` / `CryptUnprotectData`，用户级密钥绑定）。

---

## 11. 构建与产物

### 11.1 工具链

- Windows 10/11 x64
- Visual Studio 2022（C++ 桌面开发工作负载）
- CMake 3.15+ 或直接 `build.bat`

### 11.2 一键编译

`x64 Native Tools Command Prompt for VS 2022` 里：

```bat
cd O:\try\RouterMonitor
build.bat
```

或者 Git Bash / PowerShell：

```bash
cmake -S . -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release
```

### 11.3 链接选项

```cmake
target_link_libraries(RouterMonitor PRIVATE
    winhttp      # HTTP 客户端
    bcrypt       # SHA-256
    gdiplus      # 表格 / 趋势曲线绘制
    comctl32     # 通用控件
    shell32      # Shell_NotifyIcon (托盘)
    user32 gdi32 advapi32 msimg32
)

set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreadedRelease")
if(CMAKE_BUILD_TYPE STREQUAL "Release")
    add_compile_options(/Os /GL)
    add_link_options(/LTCG /OPT:REF /OPT:ICF)
endif()
```

关键是 **静态 CRT + LTCG + /OPT:REF,ICF**。Release 模式最终 exe 大小 **~1.5 MB**，零运行时依赖。

---

## 12. 附录：关键文件位置

| 功能模块 | 文件 |
|----------|------|
| 三步登录 / 设备列表协议 | `src/RouterApi.cpp` |
| SHA-256 封装 | `src/Sha256.cpp` |
| WinHTTP 封装 | `src/HttpClient.cpp` |
| 极简 JSON 解析 | `src/JsonParser.cpp` |
| INI 配置（非凭证） | `src/Config.cpp` |
| 凭证 JSON 存取 | `src/Credentials.cpp` |
| 后台轮询 + 环形缓冲 | `src/PollerThread.cpp`, `include/RingBuffer.h` |
| 主窗口 / 表格 / 趋势 | `src/ui/MainWindow.cpp` |
| HUD 悬浮窗 | `src/ui/HudWindow.cpp` |
| 托盘图标 | `src/ui/TrayIcon.cpp` |
| 启动 / 凭证对话框 | `src/main.cpp` |

> 项目还在持续打磨中。下一步计划：(1) 把轮询改成 WebSocket / SSE 长连接模式，省掉 2 秒一次的请求风暴；(2) 接入 Windows DPAPI 加密本地凭证；(3) 增加设备上下线告警。