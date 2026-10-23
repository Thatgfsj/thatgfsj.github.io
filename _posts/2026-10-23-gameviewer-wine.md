---
layout: post
title: "让网易UU远程在 Debian 13 的 Wine 下稳定运行：对照实验、状态机与自愈启动器"
date: 2026-10-23 21:30:00 +0800
tags: [Wine, Linux, 排障, 状态机, 工具链]
description: "从空白窗口、启动页一闪、双击没反应，到连续运行数天：用对照实验找出 Windows 远程桌面客户端在 Wine 下的启动机制，再把启动器重写成状态机，逐一消掉并发、托盘隐藏、脏状态堆积这些坑。"
---

> 本文记录我把网易UU远程（NetEase GameViewer）主控端跑在 Debian 13 + Wine 上的完整排查过程。重点不是「装什么包」，而是**怎么把一个黑盒 Windows 程序的行为，用对照实验变成可验证的机制，再据此写一个不会自己抽风的启动器**。文中的所有主机名、用户名、路径、设备码、进程 GUID、内网域名与令牌均已脱敏。

---

## 目录

1. [背景](#1-背景)
2. [环境与选型](#2-环境与选型)
3. [方法：先证伪，再动手](#3-方法先证伪再动手)
4. [观测面：进程与窗口](#4-观测面进程与窗口)
5. [判活：窗口存在不等于界面可见](#5-判活窗口存在不等于界面可见)
6. [状态机与决策表](#6-状态机与决策表)
7. [启动器的工程细节](#7-启动器的工程细节)
8. [踩坑记录](#8-踩坑记录)
9. [验证：没有 GUI 也能看见界面](#9-验证没有-gui-也能看见界面)
10. [结果与边界](#10-结果与边界)
11. [方法论](#11-方法论)
12. [附录](#12-附录)

---

## 1. 背景

我有两台机器：主力是一台 Debian 13（trixie）的 Linux 工作站，另一台是 Windows。需求很朴素——**在 Linux 上作为主控端**，远程控制那台 Windows。

网易UU远程（内部名 GameViewer，版本 4.42.0.2770）是 Windows 上比较好用的一个选择：免费、延迟可以、支持被控端无人值守。它没有 Linux 版，于是只能走 Wine。

装上之后，症状是一串而不是一个：

| 阶段 | 现象 |
|------|------|
| 一开始 | 窗口能起来，界面一片空白 |
| 当时判断 | 以为是 WebView2 缺运行时，补装后能出启动页 |
| 然后 | 启动页一闪就没了，什么都没有 |
| 于是 | 双击图标打不开，`Alt+Tab` 里也找不到窗口 |
| 某次 | 屏幕上「只有角落里一个标志」，别的什么都没有 |
| 连续跑了两天 | 又打不开了 |

这些现象看起来像同一个 bug 在一层层加深，实际上**至少是四类不同的问题**：Wine 版本兼容性、窗口可见性判据、并发启动、以及进程状态堆积。

更麻烦的是我一开始的调试方式：看到「打不开」，就去改启动脚本——加个 `sleep`、加个重试、加个 `pkill`。结果反而造出了第五个症状：**应用一直重启**。

真正的转折点是承认：**我不知道这个程序是怎么启动的。** 于是停掉所有猜测，开始做实验。

---

## 2. 环境与选型

最终可用的组合：

| 项 | 值 |
|----|----|
| 发行版 | Debian GNU/Linux 13 (trixie)，内核 6.12 |
| Wine | **wine-staging 11.19**（`/opt/wine-staging/bin/wine`），非系统自带 |
| 前缀 | `~/.wine`（原地升级，不重建，保留登录态） |
| 架构 | WoW64 前缀（`dpkg --add-architecture i386` + `wine-staging-i386:i386`） |
| WebView2 | **Fixed Version 133.0.3065.92** @ `C:\EdgeWebView2\133.0.3065.92` |
| 环境变量 | `WINEDLLOVERRIDES='wevtapi=n,b;winemenubuilder.exe=d'`、`WEBVIEW2_BROWSER_EXECUTABLE_FOLDER='C:\EdgeWebView2\133.0.3065.92'`、`WINEDEBUG=-all` |

四个选型都不是随便定的：

**Wine 必须 ≥ 11。** Debian 13 仓库里的 `wine` 是 `10.0~repack-6`，用它客户端永远停在启动页。改用 OBS 的 `Emulators:Wine:Debian_13` 源拿到 `11.19~trixie-1`（trixie 原生编译）。WineHQ 官方的 bookworm 包在 trixie 上依赖对不上，装不上。

**必须补 32 位。** 主程序是 `PE32+ x86-64`，但安装目录里混着一堆 32 位 PE——`Uninstall.exe`、`bin/aria2c.exe`、`bin/MicrosoftEdgeWebview2Setup.exe`、几个附带 DLL。而且 `wine-staging` 这个元包的依赖里也含 `wine-staging-i386`。只装 amd64 会在安装/卸载路径上直接断掉。

**WebView2 只能用固定版本。** 客户端界面是 WebView2 渲染的，但 Evergreen 运行时（Omaha 引导器）在这个前缀里装不上，报 `0x800703E5`。于是改用 **Fixed Version** 分发模式：解压一个固定版本到 `C:\EdgeWebView2\<ver>`，然后用两个手段让它被找到：

```bash
# 1) 环境变量指向固定版本目录
export WEBVIEW2_BROWSER_EXECUTABLE_FOLDER='C:\EdgeWebView2\133.0.3065.92'
# 2) 写入 EdgeUpdate 的「已安装」登记，让程序的版本探测得到结果
wine reg add 'HKLM\Software\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-…}' /v pv /t REG_SZ /d 133.0.3065.92 /f
wine reg add 'HKLM\Software\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-…}' /v path /t REG_SZ /d 'C:\EdgeWebView2\133.0.3065.92' /f
```

顺带还要清掉外部可能继承进来的 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`、`WEBVIEW2_RELEASE_CHANNELS` 等变量，否则 WebView2 会去选别的运行时。

**`wevtapi` 需要 native override。** 这个 DLL 是 Windows 事件日志 API，Wine 的实现不完整，客户端启动时会碰它。处理办法是打个 forwarding 的 DLL 并声明 `wevtapi=n,b`；同时关掉 `winemenubuilder.exe`（它会往桌面乱塞快捷方式）。

---

## 3. 方法：先证伪，再动手

之前的调试有个共同毛病：**把观察到的相关性当成因果**。看到「没窗口」就假设「进程死了」，于是写代码去杀进程、重启进程——这是拿同一个错误假设反复确认自己。

改成对照实验法，规则只有三条：

1. **一次只改一个变量**；
2. **构造明确的状态**，而不是等它自然出现；
3. **结论必须能被下一次观测推翻**。

围绕「主窗口为什么不出来」这个核心问题，做了四组实验（只保留有信息量的）：

| 实验 | 构造的状态 | 观察 | 结论 |
|------|-----------|------|------|
| E1 | 只起 service，不起 server/healthd | 客户端卡在启动页 **10 小时 16 分**，不退出、不报错 | 客户端是**无限耐心轮询者**，没有超时 |
| E2 | 给上述卡了 10 小时的客户端补上 server | **30 秒内**自己恢复出主窗口 | 它在轮询 server，一就绪就恢复 |
| E4 | 杀 server，保留 healthd | 等 **120 秒**，healthd 没有重启 server；客户端不受影响 | **healthd 不是看门狗** |
| E5 | 只起 service + healthd，无 server | 卡启动页 **180 秒+**，无主窗口 | **server 是出主窗口的唯一硬前置条件** |

这四组实验直接推翻了三个我原本坚信的判断：

- **「客户端等不到服务就自己死掉」是错的。** 它会一直等。以前那些「客户端静默退出」的记录，查下来相当一部分是**我自己清理进程时杀的**。
- **「healthd 负责守护」是错的。** 名字像 watchdog，行为是普通辅助进程。server 死了它不管。
- **「要精确判断服务就绪」是没必要的。** 既然客户端无限耐心，我只要保证「server 在，客户端在」就够了，不需要等 server 的 ready 信号。

顺带确认了两个对判据很关键的事实：

- **server 会自己正常退出**（exit code 0，不是崩溃；crashpad 的 `reports/` 目录是空的），而客户端在 server 消失后照常工作——说明 server 只在启动链路里是必需的，稳态不需要。
- **webview 渲染进程树会衰减**：主窗口还在、映射也正常，但 `renderer` 进程数会从 8 → 1 → 0，此时界面白屏、点不动。这是唯一「窗口在但实际已死」的情形。

到这里，「机制」就有了，接下来只需要把机制翻译成判据和动作。

---

## 4. 观测面：进程与窗口

启动完成后，进程是这样分工的：

| 进程 | 角色 | 稳态内存 |
|------|------|---------|
| `GameViewerService.exe` | 常驻 Windows 服务，负责拉起/管理 | ~14 MB |
| `GameViewerHealthd.exe` | 辅助守护（**不重启 server**） | ~24 MB |
| `GameViewerServer.exe` | 会话/串流服务，**出主窗口的必要条件** | ~226 MB |
| `GameViewer.exe`（UI） | 主界面，WebView2 承载 | ~53 MB |
| `msedgewebview2.exe` ×8 | browser / gpu / renderer×2 / utility×2 / crashpad | ~100 MB 合计 |

两个观测陷阱：

**一是客户端进程的 cmdline 被改写了。** 启动器通过 `start.exe /exec` 拉起 UI，之后进程标题变成 `source=start.exe <固定GUID>`，`ps | grep GameViewer.exe` **永远匹配不到它**。正确做法是按 GUID 匹配：

```bash
CLIENT_GUID='<安装时生成的固定 GUID>'   # 单实例标识，此处脱敏
client_pids() { pgrep -f "$CLIENT_GUID" | grep -v "^$$\$" || true; }
```

**二是「渲染进程数」比「窗口是否存在」更能反映真实状态。** WebView2 的子进程类型可以枚举：

```
--type=renderer    ← 真正的页面渲染，界面活着就看它
--type=gpu-process
--type=utility
--type=crashpad-handler
```

主窗口 + `renderer ≥ 1` 才算健康；主窗口在但 `renderer == 0` 就是我前面说的「假活/白屏」。

窗口本身也有固定特征：主窗口 920×680，标题「网易UU远程」，`WM_CLASS = gameviewer.exe`；启动阶段还有一个 352×245 的无标题小窗——**它太小、太不起眼，用户看到的就是「启动页一闪就没了」**。

---

## 5. 判活：窗口存在不等于界面可见

这是整个排查里最关键的一节，也是我踩得最深的坑。

原来的判据很简单粗暴：

```bash
# 错误示范
xwininfo -root -tree | grep -c '网易UU远程'
```

只要返回 ≥1 就算「主窗口在，健康」。于是出现了最诡异的现象：**诊断工具说「✅ 健康」，但屏幕上什么都没有，点 Dock 图标也没反应**——因为启动器一看到「健康」就直接退出了。

真正看一眼窗口的属性就明白了：

```bash
$ xprop -id 0x680000b WM_STATE      # 窗口 ID 为示例
WM_STATE(WM_STATE):
        window state: Withdrawn
```

`Withdrawn` 是 ICCCM 定义的三种窗口状态之一（`Normal` / `Iconic` / `Withdrawn`）。含义是：**这个窗口被应用程序从窗口管理器那里撤下了**——对象还在，X server 里还能查到，但它不显示。典型场景就是「关闭时最小化到系统托盘」。

而问题在于：**GNOME 没有系统托盘**。传统 XEmbed 托盘协议在 GNOME Shell 里没有宿主，需要额外装 AppIndicator 扩展才有。于是应用把窗口撤到托盘，托盘图标无处显示，用户看到的是——什么都没有。

知道了「缩到托盘」这个状态，就有一个很自然的问题：**能不能把它叫醒？** 试了一下，可以，而且很稳：

> 对同一个程序**再启动一次**，它会走单实例逻辑，检测到已有实例后把主窗口重新显示出来。实测 **5 秒内** `WM_STATE` 从 `Withdrawn` 变回 `Normal`，窗口变成 `IsViewable`。

于是判据升级为「必须真的看得见」：

```bash
mainwin_count() {                       # 只有 IsViewable 才算 1
    local w; w=$(xwininfo -root -tree | grep -F '网易UU远程' | head -1 | awk '{print $1}')
    [ -z "$w" ] && { echo 0; return; }
    [ "$(xwininfo -id "$w" | awk '/Map State/{print $3}')" = "IsViewable" ] && echo 1 || echo 0
}
```

这一条改动之后，用户侧最直观的体验变化是：**点图标终于有反应了**。以前是「以为在跑 → 什么都不做 → 用户等」；现在是「检测到被缩到托盘 → 主动再启一次 → 5 秒出界面」。

---

## 6. 状态机与决策表

有了可靠的观测原语，启动器就不该是「一堆 if 加 sleep」，而应该是一个显式状态机。

```bash
# 状态: none | splash | hidden | zombie | healthy
ui_state() {
    [ -z "$(client_pids)" ] && { echo none; return; }
    if [ "$(mainwin_count)" -gt 0 ]; then
        [ "$(webview_renderers)" -gt 0 ] && echo healthy || echo zombie
    elif [ "$(any_viewable)" = "1" ]; then
        echo splash        # 有可见窗口（启动页），但主窗口没出来
    else
        echo hidden        # 客户端在跑，但一个可见窗口都没有（缩到托盘）
    fi
}
```

| 状态 | 动作 | 依据 |
|------|------|------|
| `healthy` | 直接退出；有 `xdotool` 就顺手激活窗口 | 稳态不需要 service/server，多做事只会引入不确定性 |
| `hidden` | 再启一次客户端触发单实例唤醒，等 5×5 秒；仍不行才重启 | 实测 5 秒生效，重启太浪费 |
| `splash` | 先保证 server 在，**等 45 秒**让它自愈；不恢复才重启客户端 | E2 证明会自愈，但实测卡死的实例重试节奏 >90 秒，超过 45 秒就不值得等了 |
| `zombie` | **睡眠 6 秒复核**，仍满足「窗口在 && 渲染为 0」才重启 | 避免把重启过程中的瞬态当成僵死 |
| `none` | 走完整启动流程 | — |

三个设计决定值得单独说：

**① 快速通道。** 最早的版本不管什么状态，都先去查服务、等 server 就绪，实测在「已经健康」的情况下白等 **60 秒**——用户的感受是「点了图标半天没反应」。现在健康判定放在最前面，命中就 0 秒返回。

**② 等待时间要有上限，而且上限由数据决定。** `splash` 等 45 秒不是拍脑袋：E2 里自愈用了 30 秒，留一点余量；而实测卡住的实例很少在 45 秒后突然恢复，继续等纯属浪费用户时间。

**③ 瞬态必须复核。** 重启客户端的过程中，一定会短暂出现「窗口还在、渲染进程还没起来」和「客户端实例有两个」。如果按瞬时状态做决定，用户连点两下图标就会看到应用反复重启。所有破坏性动作前都加一次 `sleep 6` + 二次判定，这个改动直接消灭了「一直重启」的表象。

---

## 7. 启动器的工程细节

状态机只是决策层，真正让它「不抽风」的是下面这些底层处理。

### 7.1 单实例锁：用 mkdir，而不是 flock

用户会连点图标。两个启动器同时执行，就会互相杀客户端、互相重启——这是「一直重启」的第一个成因。

第一版用 `flock`：

```bash
exec 9>"$LOCK"
flock -n 9 || exit 0
```

看起来没问题，实际上留了一个大坑：**文件描述符会被子进程继承**。`wine` 拉起的整棵进程树（wineserver、services.exe、winedevice、服务、客户端）全都持着这个 fd，于是锁一直持有到最后一个 wine 进程退出——实测有 **31 个进程**持有它，后续任何点击都被判定为「已有启动器在运行」，全部退出。

改成 `mkdir` 原子锁：不占任何 fd，从根上不可能被继承。

```bash
LOCKDIR="${XDG_RUNTIME_DIR:-/tmp}/uuyc-run.lock.d"
mkdir "$LOCKDIR" 2>/dev/null || { notify "正在启动中，请稍候…"; exit 0; }
trap 'rmdir "$LOCKDIR" 2>/dev/null' EXIT
```

再补两条健壮性：属主进程已消失、或锁目录超过 6 分钟，就清理重建；客户端拉起后**立刻释放锁**，不要等整个流程结束。

### 7.2 后台拉起：setsid --fork

启动器需要把客户端放到后台且自己退出。第一版这样写：

```bash
( cd "$GV" && setsid timeout 86400 "$WINE" GameViewerServer.exe >>"$LOG" 2>&1 & )
```

两个问题：

- `timeout 86400` 的包装进程会活 24 小时——完全没必要，wine 进程该活多久就活多久；
- bash 会**等直接子进程**。客户端是由 `start.exe /exec` 拉起的进程树，父进程一直不退出，于是启动器挂在 `wait4` 里不走，`ps` 里能看到它卡在 `do_wait`，子进程是 `start.exe /exec`。

正确的写法是双 fork，让 bash 的直接子进程立即消失：

```bash
launch_bg() {
    local _d="$1"; shift
    ( cd "$_d" && setsid --fork "$WINE" "$@" >>"$LOG" 2>&1 </dev/null & )
    disown -a 2>/dev/null || true
}
```

实测改完后：启动器 10 秒内收工，零残留。

### 7.3 三层超时

`wine` 在异常状态下会卡在任何一次调用上（比如 wineserver 无响应）。所以每一层都要有上限：

| 层 | 手段 |
|----|------|
| 单次 wine 调用 | `timeout 20 wine …` |
| 探测 wine 是否可用 | `timeout 15 wine --version`，失败就强清 wineserver |
| 整个启动器 | `timeout -k 5 300 bash "$0"`，用环境变量标记避免重复包装 |

### 7.4 看门狗只在需要的阶段工作

既然 server 是出主窗口的必要条件，而 healthd 又不管事，那就需要一个自己的看门狗。但它的边界要划清楚：

```bash
watchdog() {
    for i in $(seq 1 24); do                      # 最长约 4 分钟
        [ "$(mainwin_count)" -gt 0 ] && return 0  # 主窗口一出，立刻退出
        alive 'GameViewerServer\.exe' || { start_server; sleep 5; }
        sleep 10
    done
}
```

**出了主窗口就退出**，绝不在稳态里插手应用——因为稳态下 server 本来就可以不在，看门狗如果一直「补启动」，反而会不断往用户正在用的实例旁边塞进程。

### 7.5 脏状态检测与彻底清理

最长的一次故障是「连续跑两天后打不开」。当时的状态：

- `GameViewerService.exe` 有 **3 个**孤儿实例（分别跑了 10 小时、8 小时、2 小时）；
- 一个 **僵尸 server**（父进程已是 systemd --user，wine 没回收），10 小时；
- 客户端有 **2 个**实例。

这种状态下，客户端**永远卡在启动页**，重启客户端完全无效——因为问题不在客户端，在 prefix 的进程状态已经脏了。

处置办法是「彻底清空再从头来」：

```bash
full_clean() {
    for im in GameViewer.exe GameViewerServer.exe GameViewerHealthd.exe \
              msedgewebview2.exe GameViewerService.exe crashpad_handler.exe; do
        timeout 20 "$WINE" taskkill /F /IM "$im" >/dev/null 2>&1
    done
    for p in $(client_pids); do kill -9 "$p"; done
    pkill -9 -f 'msedgewebview2'
    timeout 20 "$WINE" wineserver -k
    sleep 4
    # 再扫一遍残余
    for p in $(pgrep -f 'GameViewer|msedgewebview2|bin/wineserver'); do kill -9 "$p"; done
}
```

触发条件要谨慎——**只在「状态不健康」且「确认有残留」时**动手，并且要先复核 6 秒（启动过程中本来就会有短暂重复实例）。判据也必须来自实测：

| 判据 | 阈值 | 为什么 |
|------|------|--------|
| 客户端实例数 | **> 1** | 干净启动恒为 1 |
| 僵尸进程（`comm` 匹配） | 年龄 **> 60 秒** | 启动瞬间的正常僵尸不算残留 |
| 服务实例数 | **不作判据** | 实测 0~3 个都正常，它按需启停 |

### 7.6 失败升级，但只升级一次

如果拉起了两次都没出窗口，说明大概率是 7.5 的脏状态。此时：

```bash
full_clean
[ -z "${UUYC_RETRY:-}" ] && { export UUYC_RETRY=1; exec bash "$0"; }
```

用环境变量限制重试一次，避免「重置失败 → 再重置」的死循环。

---

## 8. 踩坑记录

### 8.1 「一直重启」是我自己造成的

**现象：** 应用反复重启，用户以为程序坏了。

**根因：** 两层。① 我的回归测试 T1~T4 每条都要杀一次、重启一次应用，屏幕上当然是在反复重启；② 测试脚本用 `timeout N bash "$L" & p=$!` 时多套了一层 subshell，`kill $p` 杀的是外层壳，真正的启动器还活着，继续执行「重启客户端」的逻辑。

**修法：** 直接 `timeout N bash "$L" & p=$!` 持有真实 PID；判据改成「间隔 5 秒连续两次采样都健康」才算通过；破坏性测试前打印 5 秒倒计时。

### 8.2 `pkill -f` 杀掉自己的 shell

**现象：** 执行清理命令后，当前终端直接消失。

**根因：** 命令行本身就含匹配串。`pkill -9 -f "GameViewerService.exe"` 的发起进程（我的 shell）命令行里也有这串字符，于是把自己 SIGKILL 了。同理 `pgrep -f '<客户端 GUID>'` 会匹配到自己。

**修法：** 所有杀进程逻辑写进**脚本文件**执行（此时 cmdline 只有 `bash /tmp/x.sh`）；匹配模式用字符类打断自匹配，例如 `'GameViewerServic[e]\.exe'`。

### 8.3 僵尸进程用 `pgrep -f` 抓不到

**现象：** 明明 `ps` 里能看到 `<defunct>`，`dirty_reason` 却报「无残留」。

**根因：** 僵尸进程的 `/proc/<pid>/cmdline` 是**空的**（内存已释放，只剩进程表项），`pgrep -f` 匹配命令行自然匹配不到。

**修法：** 用 `ps -o comm=` 匹配进程名，再用 `/proc/<pid>/stat` 第 22 字段（starttime）换算年龄：

```bash
proc_age() {
    _st=$(awk '{print $22}' "/proc/$1/stat")
    _up=$(cut -d. -f1 /proc/uptime)
    echo $(( _up - _st / $(getconf CLK_TCK) ))
}
```

### 8.4 `xwininfo` 的窗口树里包含不可见窗口

见第 5 节。**修法：** 判据从「存在」改成 `Map State == IsViewable`。

### 8.5 XWD 截图的字节序陷阱

**现象：** 自己写的 XWD→PNG 转换器一跑就把内存吃爆，随后被 OOM。

**根因：** `xwd` 输出默认是 **MSBFirst（大端）**，而文件的 `byte_order` 字段实测写的是 0（LSBFirst），按字段解析就把 920×680 读成了 2550333440×2818703360 —— 于是试图分配几十 EB 的缓冲区。

**修法：** 不信 `byte_order` 字段，用「`header_size ∈ (0, 4096)` 且 `width/height ∈ (0, 20000)`」双端试探；像素通道顺序也不猜，32bpp 下第 4 个字节是 X/alpha，**恒为 `0xff`**，找到这个恒定字节就知道 R/G/B 的排列。

---

## 9. 验证：没有 GUI 也能看见界面

远程排查最难的一点：我没法「看一眼」。所以验证拆成三层。

**第一层：状态机单测（构造状态）。** 不去等它自然出现，而是主动制造：

```python
# 用 Xlib 把主窗口撤下 → 构造 hidden 状态
x.XUnmapWindow(dpy, 0x680000b); x.XSync(dpy, 0)   # 窗口 ID 为示例
```

| 目标状态 | 构造手法 |
|---------|---------|
| `hidden` | `XUnmapWindow` 主窗口 |
| `splash` | 杀掉 server，再启动客户端 |
| `zombie` | 杀掉 webview 的 `renderer` 进程 |
| `none` | `full_clean` |

**第二层：端到端时序。** 记录「点击 → 出现可见主窗口」的秒数，而不是只看最终状态对不对。

**第三层：像素级内容验证。** 只确认「窗口可见」还不够，得知道里面画没画东西：

```
xwd -id <winid> -out win.xwd  →  Python 解析（修好字节序）→ PNG
                              →  统计：颜色数 / 亮度标准差 / 分区亮度 / 品牌色占比
```

当时手上没有能直接看图的工具，于是把窗口缩成 92×30 的 ASCII 亮度图，再配合统计量判断：

```
┌────────────────────────────────────────────┐
│  .                                          │  ← 左侧竖排图标（侧边栏）
│ ... .....        =++*+ : -:-..::::.:        │
│.   .... .. .     :-::: . .... .. ...        │  ← 主卡片标题
│    ..  .....     ............................│
│                  :::::::::::::::-----------│
│                  ======-===================│  ← 底部渐变横幅（插画）
│                  ==========================│
└────────────────────────────────────────────┘
白底 42% · 品牌蓝 11% · 深色文字 1%
```

侧边栏、主卡片、底部横幅、右上角窗口按钮都在，说明界面是**真的渲染出来了**，不是白屏。

最后是生产环境的验证——这套自愈逻辑在真实的使用中自己抓到了脏状态：

```
[2026-10-23 20:54:14] ── 启动 ── 使用 Wine: … (wine-11.19 (Staging))
[2026-10-23 20:54:15] 检测到残留状态: 存在僵死进程(PID … 已 41708 秒) → 复核中…
[2026-10-23 20:54:21] 复核确认 → 彻底清理
[2026-10-23 20:54:29] 清理完成: 组件=0
[2026-10-23 20:54:33] 服务状态: RUNNING
[2026-10-23 20:54:37] 启动 GameViewerServer → Server存活=是
[2026-10-23 20:54:37] 客户端状态: none → 启动客户端
[2026-10-23 20:54:52] 主窗口已显示
```

一个已经僵死了 **11.6 小时**的 server 被自动识别、清理，然后 15 秒出窗口。这次用户只点了一次图标。

---

## 10. 结果与边界

最终指标：

| 场景 | 耗时 |
|------|------|
| 冷启动（完全停止后） | 15~20 秒出主窗口 |
| 已在运行，再点图标 | **0 秒**返回，不打扰现有窗口 |
| 被缩到托盘后点图标 | **5 秒**唤醒出界面 |
| 检测到脏状态 → 自动重置 → 出窗口 | 约 38 秒 |
| 重复点击（并发） | 后续实例立即退出，应用不受影响 |

资源占用：server ~226 MB、客户端 ~53 MB、healthd ~24 MB、service ~14 MB、WebView2 合计 ~100 MB。

边界也要说清楚：

- **主窗口必须依赖 `GameViewerServer.exe`**，这是应用自身的设计，绕不过去，只能保证它在。
- **托盘图标无宿主**。我没有去伪造托盘，而是把「被缩到托盘」当成一个可识别状态，用单实例唤醒对抗它。
- **WebView2 固定版本不可升级**。升级要重新做一遍版本登记，收益不大，风险不小。
- 只覆盖**主控端**（登录窗 + 设备列表 + 发起连接）。被控端在 Linux 上没有意义。

---

## 11. 方法论

把整个过程压缩成一句话：**先把黑盒变成机制，再把机制变成判据，最后把判据写进状态机。**

几个具体的教训：

1. **「修不好」通常不是代码写错了，而是判据错了。** 我的诊断工具曾经信心十足地报「✅ 健康」，而屏幕上什么都没有。判据错的时候，后面的所有逻辑都是在错误的地基上盖楼。
2. **相关性不等于因果。** 「没窗口」和「进程死了」经常同时出现，但真实原因是「窗口被撤下了，进程活得好好的」。要证伪，就得能构造状态。
3. **不要和瞬态赛跑。** 重启过程中必然出现中间态，基于瞬时观测做破坏性决策，就会得到「一直重启」这种自我实现的行为。
4. **让清理逻辑可重入。** 彻底清理必须能处理「已经清过一半」的状态（僵尸、孤儿、残留 fd），否则第二次执行会更糟。
5. **一个反直觉的点：少做事比多做事稳。** 稳态下不碰 service、不等 server、不干预应用，比「每次都全量重启一遍」可靠得多。

---

## 12. 附录

### 12.1 文件与职责

| 文件 | 职责 |
|------|------|
| `~/uuyc-run` | 启动器：wine 选择、单实例锁、状态机、看门狗、脏状态清理 |
| `~/uuyc-diag` | 只读诊断：各组件/窗口状态/残留检测 + 结论 + 日志尾部 |
| `~/uuyc-selftest` | 回归自检：冷启动 / 幂等 / 启动页自愈 / 假活重启 |
| `~/uuyc-client-stderr.log` | 启动器里程碑 + wine 子进程输出 |

### 12.2 日志里程碑

```
── 启动 ── 使用 Wine: …            → 服务状态: RUNNING
→ 启动 GameViewerServer(客户端出主界面的必要条件) → Server存活=是
→ 客户端状态: <none|splash|hidden|zombie|healthy>
→ 启动客户端 / 尝试唤醒界面 / 客户端卡在启动页,等待其自行恢复
→ 主窗口已显示 → 已提交看护任务 → 看门狗: 主窗口已出现,退出
```

### 12.3 常用命令

```bash
uuyc-run              # 点图标做的事：判定状态 → 启动/唤醒/重置
uuyc-run --state      # 只读：当前状态、残留检测、各计数
uuyc-run --stop       # 彻底停止（full_clean）
uuyc-diag             # 完整体检 + 处置建议
uuyc-selftest         # 回归测试（会重启应用，别在远程会话中跑）
```

### 12.4 参考

- Wine OBS 仓库（Debian 13 原生包）：<https://software.opensuse.org/download/package?package=wine-staging-amd64&project=Emulators%3AWine%3ADebian>
- WebView2 分发模式（Evergreen / Fixed Version）：<https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution>
- ICCCM 4.1.4 `WM_STATE`：<https://tronche.com/gui/x/icccm/sec-4.html>
- GNOME AppIndicator 扩展（托盘宿主）：<https://extensions.gnome.org/extension/615/appindicator-support/>

---

> 写这篇的动力其实很朴素：这类「Windows 程序在 Linux 上能跑但不好用」的问题，网上大多是「装个包就好了」级别的答案，真正难的是**长期稳定**。而长期稳定从来不是靠多写几个 `if`，是靠把程序的行为搞清楚。
