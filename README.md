# 🎨 Bash PS1 Generator

> Vibe Coding Project

一个现代化的、拖拽式的Bash命令行提示符(PS1)生成器，让您轻松创建和自定义个性化的终端提示符。

![Bash PS1 Generator](https://via.placeholder.com/800x400/667eea/ffffff?text=Bash+PS1+Generator)

## ✨ 功能特性

- 🎯 **拖拽式界面** - 直观的元素拖拽构建器
- 🎨 **颜色自定义** - 支持HEX和ANSI 256色
- 💻 **实时预览** - 终端样式的实时效果预览
- 📥 **导入导出** - 解析现有PS1字符串并导入编辑
- 🎭 **样式支持** - 粗体、斜体、下划线等文本样式
- 🌿 **Git集成** - 显示当前Git分支和状态
- 🔤 **Nerd Font** - 支持Nerd Font图标字形
- 🔄 **双向转换** - PS1字符串与可视化构建器之间的无缝转换

## 🚀 快速开始

### 环境要求

- Node.js 16+ 
- pnpm (推荐) 或 npm/yarn

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/your-username/bashrcps1.git
cd bashrcps1

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📖 使用指南

### 1. 构建你的PS1

1. **拖拽元素**: 从左侧面板拖拽所需的提示符元素到构建器区域
2. **自定义样式**: 点击元素来设置颜色、样式和自定义文本
3. **预览效果**: 在实时预览窗口查看终端效果
4. **复制代码**: 点击复制按钮获取生成的PS1字符串

### 2. 导入现有PS1

如果你已经有一个PS1配置，可以直接导入进行编辑：

1. 点击"Import PS1"按钮
2. 粘贴你的PS1字符串
3. 应用程序会自动解析并在构建器中显示各个元素

### 3. 应用到系统

将生成的PS1应用到你的bash环境：

```bash
# 编辑 ~/.bashrc 文件
nano ~/.bashrc

# 添加以下行（替换为你生成的PS1）
export PS1="你的生成的PS1字符串"

# 重新加载配置
source ~/.bashrc
```

## 🧩 支持的元素

### 📅 时间和日期
- 当前日期
- 格式化日期
- 24小时制时间
- 12小时制时间
- 不含秒的时间

### 👤 用户和系统信息
- 用户名 (`\u`)
- 主机名短格式 (`\h`)
- 主机名完整格式 (`\H`)
- 当前工作目录 (`\w`)
- 目录基名 (`\W`)

### 🔧 命令信息
- 命令编号 (`\#`)
- 历史编号 (`\!`)
- 退出状态 (`$?`)
- 提示符号 (`\$`)
- 后台任务数量 (`\j`)

### 🌿 Git集成
- 当前Git分支
- 高级Git状态显示

### 🎨 自定义元素
- 自定义文本
- 符号和特殊字符
- Nerd Font图标
- 环境变量
- 命令输出

### 🔧 控制字符
- 换行符 (`\n`)
- 回车符 (`\r`)
- 响铃 (`\a`)

## 🎨 样式和颜色

### 文本样式
- **粗体** - `$(tput bold)`
- *斜体* - 斜体支持
- <u>下划线</u> - 下划线支持
- 闪烁效果
- 反转显示
- 暗淡显示
- 删除线

### 颜色选项
- **HEX颜色** - #FF5733 格式
- **ANSI 256色** - 0-255 颜色编号
- **前景色和背景色**支持

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI框架**: Tailwind CSS + DaisyUI
- **状态管理**: Pinia
- **路由**: Vue Router

## 📁 项目结构

```
src/
├── components/           # Vue组件
│   ├── PS1Builder.vue   # 主构建器组件
│   └── SymbolPicker.vue # 符号选择器
├── views/               # 页面视图
│   ├── HomeView.vue     # 主页
│   └── AboutView.vue    # 关于页面
├── utils/               # 工具函数
│   └── ps1Generator.ts  # PS1生成和解析逻辑
├── types/               # TypeScript类型定义
│   └── ps1.ts          # PS1相关类型
├── assets/              # 静态资源
└── stores/              # Pinia状态管理
```

## 📝 示例

### 简单的彩色提示符
```bash
export PS1="\[$(tput bold)\]\[\033[38;5;39m\]\u\[$(tput sgr0)\]@\[\033[38;5;46m\]\h\[$(tput sgr0)\]:\[\033[38;5;226m\]\w\[$(tput sgr0)\]$ "
```
显示效果: `user@hostname:/path/to/directory$ `

### 多行Git提示符
```bash
export PS1="[\[\033[38;5;213m\]\u\[$(tput sgr0)\] @ \[\033[38;5;213m\]\h\[$(tput sgr0)\]]:\[\033[38;5;74m\]\w\[$(tput sgr0)\]\n\[\033[38;5;46m\]\$(git branch 2>/dev/null | grep '^*' | colrm 1 2)\[$(tput sgr0)\] \[\033[38;5;196m\]\t\[$(tput sgr0)\] $ "
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Bash Manual - Prompting](https://www.gnu.org/software/bash/manual/html_node/Controlling-the-Prompt.html)
- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [Nerd Fonts](https://www.nerdfonts.com/)
- [Git Prompt Scripts](https://github.com/git/git/tree/master/contrib/completion)

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Tailwind CSS 和 DaisyUI 的美观设计
- Bash 社区的贡献和文档

---

**享受自定义你的终端体验！** 🎉