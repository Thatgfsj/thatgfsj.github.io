# 强制记忆文件

每次任务开始之前，必须先执行以下操作：

1. 读取 `C:/Users/thatg/.claude/SKILLS.md`，判断是否有合适的技能可以使用

---

## 用户信息

- **用户名**：Thatgfsj
- **系统用户名（Sam Account Name）**：thatg
- **用户目录**：`C:\Users\thatg`
- **GitHub 用户名**：Thatgfsj
- **GitHub PAT**：从环境变量 `GITHUB_TOKEN` 读取（fine-grained）
- **PyPI 用户名**：Thatgfsj
- **PyPI API Token**：从环境变量 `PYPI_TOKEN` 读取

---

## 技术偏好

| 类型 | 首选技术 |
|------|---------|
| 爬虫、抓包、发包、脚本类小程序 | Python |
| 大型程序 | Rust |
| 安卓应用 | Gradle（直接构建） |
| 其他可接受的语言 | Go、C++、C#、C、Java |
| 数据库 | MySQL |

---

## 开发环境（已安装）

| 工具 | 路径 | 版本 |
|------|------|------|
| Python | `C:\Users\thatg\AppData\Local\Programs\Python\Python311` | 3.11.9 |
| Java (Amazon Corretto) | `C:\Program Files\Amazon Corretto\jdk21.0.10_7` | 21.0.10 |
| Rust | `C:\Users\thatg\.cargo` | 1.95.0 stable |
| Gradle | `O:\Gradle\gradle-current` | 8.10.2 |
| MySQL | `C:\Program Files\MySQL\MySQL Server 8.4` | 8.4.8 |
| Android SDK | `O:\Android-sdk` | cmdline-tools + platform-tools + build-tools 34/35/36 + platforms android-34/36 |

---

## 环境变量（通过 setx 已持久化）

- `JAVA_HOME` = `C:\Program Files\Amazon Corretto\jdk21.0.10_7`
- `ANDROID_HOME` = `O:\Android-sdk`
- `GRADLE_HOME` = `O:\Gradle\gradle-current`
- `PATH` 已包含：Python311、Python311\Scripts、Java bin、Gradle bin、Android cmdline-tools、Android platform-tools、Rust cargo bin

---

## 开发文档规则

- **范围**：无论大小程序开发，都必须在用户指定的工作目录下创建详细的开发文档
- **内容要求**：技术栈、开发思路与流程、目录结构说明、主要模块说明
- **更新策略**：每次有大改时，必须同步更新文档

---

## Git 提交规则

- 当用户要求提交（commit）skills 时，**必须以用户身份（Thatgfsj）提交**，不得以 AI 身份提交
- 向 GitHub 提交（push、PR、commit）时，**始终使用用户身份（Thatgfsj）**，不得以 Claude/AI 身份提交

---

## 行为准则

### 1. 先思考，再编码

- **不要假设。不要隐藏疑惑。讲清楚取舍。**
- 实现之前：明确说明你的假设。如果不确定，就问。
- 如果一个需求有多种解释，列出来——不要默默选一个。
- 如果有更简单的方案，说出来。该反对时就反对。
- 如果某件事不清楚，停下来。指出哪里困惑。提问。

### 2. 简洁优先

- 用最少的代码解决问题。不要写推测性代码。
- 不要实现未要求的特性。
- 不要为一次性代码做抽象。
- 不要为不会发生的场景写错误处理。
- 如果你写了 200 行但它可以是 50 行，重写。

问自己：「资深工程师会觉得这过于复杂吗？」如果是，简化。

### 3. 精准修改

- 只动必须动的地方。只清理自己造成的混乱。
- 编辑现有代码时：不要「改进」相邻的代码、注释或格式。
- 不要重构没坏的东西。匹配现有风格，即使你有不同偏好。
- 如果发现无关的死代码，提一句——但不要删。
- 当你的修改产生了孤儿代码：删掉被你改动**弄成未使用**的 import/变量/函数。
- 不要删本来就存在的死代码，除非被要求。

检验标准：每一行改动的代码都应该能追溯到用户的请求。

### 4. 目标驱动执行

- 明确成功标准。循环直到验证通过。
- 把任务转化为可验证的目标：
  - 「加验证」→「先写对非法输入的测试，然后让测试通过」
  - 「修 bug」→「先写复现 bug 的测试，然后让测试通过」
  - 「重构 X」→「确保测试前后都通过」
- 多步骤任务列出简要计划：
  ```
  1. [步骤] → 验证：[检查项]
  2. [步骤] → 验证：[检查项]
  3. [步骤] → 验证：[检查项]
  ```
- 强有力的成功标准让你可以独立迭代。弱标准（「让它工作」）需要不断澄清。
