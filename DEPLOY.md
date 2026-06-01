# 未来鹅项目 - 部署指南

> 项目版本：V1.5  
> 更新日期：2026-06-01  
> 文档类型：部署指南

---

## 📋 目录

1. [部署前准备](#部署前准备)
2. [方案一：Vercel 部署（推荐）](#方案一vercel-部署推荐)
3. [方案二：Netlify 部署](#方案二netlify-部署)
4. [方案三：GitHub Pages 部署](#方案三github-pages-部署)
5. [环境变量配置](#环境变量配置)
6. [自定义域名配置](#自定义域名配置)
7. [部署后验证清单](#部署后验证清单)
8. [常见问题排查](#常见问题排查)
9. [持续集成/持续部署](#持续集成持续部署)

---

## 🚀 部署前准备

### 1. 本地验证

在部署前，请确保本地构建通过所有检查：

```bash
# 1. 安装依赖
npm install

# 2. 运行 ESLint 检查（应为 0 错误 0 警告）
npm run lint

# 3. TypeScript 类型检查（应为 0 错误）
npm run check

# 4. 运行测试（应 199/199 全部通过）
npm run test:run

# 5. 构建生产版本
npm run build
```

**成功标志**：
- `npm run lint` 输出：`0 problems (0 errors, 0 warnings)`
- `npm run check` 输出：无错误信息
- `npm run test:run` 输出：`199 passed (199)`
- `npm run build` 生成 `dist/` 目录，包含 `index.html` 和 `assets/`

### 2. 构建产物确认

构建成功后，`dist/` 目录应包含：

```
dist/
├── index.html                    # 入口文件
├── assets/
│   ├── css/
│   │   └── index-XXXXXX.css      # 样式文件
│   └── js/
│       ├── index-XXXXXX.js       # 主入口 JS
│       ├── Home-XXXXXX.js        # 首页 chunk
│       ├── Chat-XXXXXX.js        # 对话页 chunk
│       ├── Profile-XXXXXX.js     # 个人画像页 chunk
│       ├── Growth-XXXXXX.js      # 成长规划页 chunk
│       ├── Tencent-XXXXXX.js     # 鹅厂专区 chunk
│       ├── AISettings-XXXXXX.js  # AI 设置页 chunk
│       ├── NotFound-XXXXXX.js    # 404 页 chunk
│       ├── react-vendor-XXXX.js  # React 依赖 chunk
│       ├── chart-vendor-XXXX.js  # Chart.js 依赖 chunk
│       ├── markdown-vendor-X.js  # Markdown 依赖 chunk
│       ├── dompurify-vendor-X.js # DOMPurify 依赖 chunk
│       └── utils-vendor-XXXXX.js # 工具依赖 chunk
```

### 3. 代码推送（如使用 Git 部署）

```bash
# 初始化 Git 仓库（如尚未初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: V1.5 视觉升级完成，准备部署"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/weilai-e.git

# 推送到主分支
git push -u origin main
```

---

## 📦 方案一：Vercel 部署（推荐）

### 方式 A：Vercel CLI 命令行部署

**步骤 1：安装 Vercel CLI**

```bash
npm install -g vercel
```

**步骤 2：登录 Vercel**

```bash
vercel login
```

选择登录方式（GitHub/GitLab/Bitbucket/邮箱）。

**步骤 3：部署到预览环境**

```bash
cd c:\Users\MECHREVO\OneDrive\Desktop\未来鹅
vercel
```

按照提示操作：
- `Set up and deploy?` → **Yes**
- `Which scope?` → 选择你的账户
- `Link to existing project?` → **No**（首次部署）
- `What's your project's name?` → **weilai-e**（或自定义）
- `In which directory is your code located?` → **./**（当前目录）
- `Want to override the settings?` → **No**（使用 vercel.json）

部署成功后，会获得一个预览 URL：`https://weilai-e-xxxx.vercel.app`

**步骤 4：部署到生产环境**

```bash
vercel --prod
```

生产环境 URL 会替换预览 URL。

### 方式 B：Vercel 控制台拖拽部署

**步骤 1：访问 Vercel 拖拽部署页面**

打开浏览器访问：https://vercel.com/new

**步骤 2：上传 dist 文件夹**

1. 点击 **"Deploy"** 按钮
2. 选择 **"Import Project"**
3. 在本地文件管理器中，将 `dist` 文件夹拖拽到 Vercel 页面中

**步骤 3：等待部署完成**

Vercel 会自动识别静态文件并部署，通常需要 30 秒 - 2 分钟。

### 方式 C：GitHub 仓库集成部署

**步骤 1：推送代码到 GitHub**

```bash
git push -u origin main
```

**步骤 2：在 Vercel 中导入项目**

1. 访问 https://vercel.com/new
2. 点击 **"Continue with GitHub"**
3. 搜索并选择你的仓库 `weilai-e`
4. 点击 **"Import"**

**步骤 3：确认构建设置**

Vercel 会自动识别 Vite 项目，确认以下设置：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**步骤 4：点击 Deploy**

等待部署完成，获得生产环境 URL。

### Vercel 优势

| 特性 | 说明 |
|------|------|
| **自动 HTTPS** | 免费 SSL 证书 |
| **全球 CDN** | 多节点加速，中国可访问 |
| **自动部署** | Git push 自动触发 |
| **预览部署** | 每个 PR 生成预览 URL |
| **环境变量** | 控制台配置，安全存储 |
| **免费额度** | 100GB 带宽/月，足够个人项目 |

---

## 🌐 方案二：Netlify 部署

### 方式 A：Netlify CLI 命令行部署

**步骤 1：安装 Netlify CLI**

```bash
npm install -g netlify-cli
```

**步骤 2：登录 Netlify**

```bash
netlify login
```

浏览器会自动打开 Netlify 授权页面。

**步骤 3：初始化项目**

```bash
cd c:\Users\MECHREVO\OneDrive\Desktop\未来鹅
netlify init
```

按照提示操作：
- `What would you like to do?` → **Create & configure a new site**
- `Team:` → 选择你的账户
- `Site name:` → **weilai-e**（或留空自动生成）
- `Your build command:` → **npm run build**
- `Directory to deploy:` → **dist**

**步骤 4：部署到预览环境**

```bash
netlify deploy
```

**步骤 5：部署到生产环境**

```bash
netlify deploy --prod
```

### 方式 B：Netlify 拖拽部署（最简单）

**步骤 1：访问拖拽部署页面**

打开浏览器访问：https://app.netlify.com/drop

**步骤 2：拖拽 dist 文件夹**

在本地文件管理器中，将 `dist` 文件夹直接拖拽到浏览器窗口中。

**步骤 3：等待部署完成**

通常 10-30 秒即可完成部署。

### 方式 C：GitHub 仓库集成部署

**步骤 1：推送代码到 GitHub**

```bash
git push -u origin main
```

**步骤 2：在 Netlify 中导入项目**

1. 访问 https://app.netlify.com/start
2. 点击 **"New site from Git"**
3. 选择 **"GitHub"**
4. 授权并选择仓库 `weilai-e`
5. 点击 **"Deploy site"**

**步骤 3：确认构建设置**

Netlify 会自动识别 `netlify.toml` 配置，无需手动设置。

### Netlify 配置文件说明

项目根目录的 `netlify.toml` 已包含：

```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

此配置确保 React Router 的 SPA 路由正常工作（刷新页面不会 404）。

### Netlify 优势

| 特性 | 说明 |
|------|------|
| **拖拽部署** | 最简单的部署方式 |
| **自动 HTTPS** | 免费 SSL 证书 |
| **全球 CDN** | 多节点加速 |
| **表单处理** | 内置表单提交功能 |
| **分支部署** | 每个分支独立部署 |
| **免费额度** | 100GB 带宽/月 |

---

## 🐙 方案三：GitHub Pages 部署

### 方式 A：GitHub Actions 自动部署

**步骤 1：推送代码到 GitHub**

```bash
git push -u origin main
```

**步骤 2：启用 GitHub Pages**

1. 访问仓库设置：`https://github.com/YOUR_USERNAME/weilai-e/settings/pages`
2. 在 **"Source"** 中选择：**GitHub Actions**
3. 保存设置

**步骤 3：触发部署**

推送代码到 `main` 分支会自动触发部署工作流（`.github/workflows/deploy.yml`）。

或手动触发：
1. 访问仓库的 **Actions** 页面
2. 选择 **"Deploy to GitHub Pages"** 工作流
3. 点击 **"Run workflow"**

**步骤 4：查看部署状态**

在 Actions 页面中查看工作流运行状态，成功后会显示部署 URL。

GitHub Pages URL 格式：`https://YOUR_USERNAME.github.io/weilai-e/`

### 方式 B：手动部署到 gh-pages 分支

**步骤 1：安装 gh-pages 工具**

```bash
npm install -D gh-pages
```

**步骤 2：添加部署脚本**

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**步骤 3：配置 Vite 基础路径**

修改 `vite.config.ts`：

```typescript
export default defineConfig({
  base: '/weilai-e/',  // 替换为你的仓库名
  // ... 其他配置
})
```

**步骤 4：执行部署**

```bash
npm run deploy
```

### GitHub Pages 注意事项

| 项目 | 说明 |
|------|------|
| **仓库可见性** | 公开仓库免费，私有仓库需 Pro 账户 |
| **自定义域名** | 支持配置自定义域名 |
| **HTTPS** | 自动启用 |
| **构建限制** | 每次构建限时 30 分钟 |
| **带宽限制** | 每月 100GB |

---

## 🔑 环境变量配置

> ⚠️ **架构变更（2026-06-01）**：项目已从"前端直调智谱 API"改为"后端代理模式"，API Key 不再暴露给客户端。

### 核心环境变量

| 变量名 | 值 | 环境 | 说明 |
|--------|-----|------|------|
| `ZHIPU_API_KEY` | `你的智谱 API Key` | Production, Preview, Development | **服务端密钥**，用于代理转发请求到智谱 AI |
| `VITE_DEFAULT_API_KEY` | `enabled`（任意非空值即可） | Production, Preview, Development | **前端开关**，非空即启用 AI 模式，值本身不再敏感 |

### Vercel 环境变量配置

**步骤 1：获取智谱 API Key**

1. 访问 https://open.bigmodel.cn/
2. 注册/登录账号
3. 进入"API Keys"页面创建新的 Key
4. 复制 Key（格式如：`82d88992499d42a2bd0f48747c4ace49.xxxxxxxx`）

**步骤 2：在 Vercel 控制台配置**

1. 登录 Vercel 控制台
2. 选择项目 `weilai-e`
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加以下变量：

| 变量名 | 值示例 | 环境 |
|--------|-------|------|
| `ZHIPU_API_KEY` | `82d88992499d42a2bd0f48747c4ace49.xxxxxxxx` | Production, Preview, Development |
| `VITE_DEFAULT_API_KEY` | `enabled` | Production, Preview, Development |

**步骤 3：重新部署**

```bash
vercel --prod
```

### 为什么需要两个环境变量？

- **`ZHIPU_API_KEY`**（服务端）：存储在 Vercel Serverless Function 中，用于后端代理调用智谱 API。这个值**永远不会发送到浏览器**。
- **`VITE_DEFAULT_API_KEY`**（前端）：只是一个开关标志。前端通过判断它是否存在来决定是否显示"AI 模式"。实际值不重要，非空即可。

### Netlify 环境变量

Netlify 也支持 Serverless Function，但需要额外配置。推荐使用 Vercel 部署（已内置 `api/chat.ts` 代理）。

如必须使用 Netlify：
1. 在 Netlify 后台添加 `ZHIPU_API_KEY` 环境变量
2. 将 `api/chat.ts` 放到 `netlify/functions/chat.ts`
3. 添加 `netlify.toml` 函数配置

### 环境变量安全说明

✅ **现在已安全**：
- 智谱 API Key 存储在 Vercel 服务端，不会泄露给浏览器
- `.env` 文件已在 `.gitignore` 中，不会提交到 Git
- 前端无法看到真实的 API Key，只能走 `/api/chat` 代理接口
- 后端代理内置限流（每分钟 30 次/IP），防止滥用

⚠️ **仍需注意**：
- 不要在 GitHub 等公开仓库中提交包含真实 `ZHIPU_API_KEY` 的代码
- 定期在智谱后台查看用量，设置额度上限
- 如发现 Key 泄露，立即在智谱后台作废并重新生成

---

## 🌍 自定义域名配置

### Vercel 自定义域名

**步骤 1：在项目设置中添加域名**

1. 访问 Vercel 项目设置
2. 点击 **"Domains"**
3. 输入你的域名（如 `weilai-e.com`）
4. 点击 **"Add"**

**步骤 2：配置 DNS 记录**

Vercel 会提供两种配置方式：

**方式 A：CNAME 记录（推荐子域名）**

```
类型    名称         值
CNAME   www        cname.vercel-dns.com
```

**方式 B：A 记录（根域名）**

```
类型    名称         值
A       @          76.76.21.21
```

**步骤 3：等待 DNS 生效**

通常 5 分钟 - 24 小时生效。

### Netlify 自定义域名

**步骤 1：在项目设置中添加域名**

1. 访问 Netlify 项目设置
2. 点击 **"Domain management"**
3. 点击 **"Add custom domain"**
4. 输入你的域名

**步骤 2：配置 DNS 记录**

**方式 A：CNAME 记录（推荐）**

```
类型    名称         值
CNAME   www        your-site-name.netlify.app
```

**方式 B：A 记录（根域名）**

```
类型    名称         值
A       @          75.2.60.5
```

**步骤 3：启用 HTTPS**

Netlify 会自动申请 Let's Encrypt 证书，等待 DNS 生效后自动启用。

---

## ✅ 部署后验证清单

部署完成后，请按以下清单逐项验证：

### 基础功能验证

- [ ] **首页访问**：访问根 URL，首页正常加载
- [ ] **路由切换**：点击导航，各页面正常切换
  - [ ] `/profile` - 个人画像
  - [ ] `/chat` - AI 对话
  - [ ] `/growth` - 成长规划
  - [ ] `/tencent` - 鹅厂专区
- [ ] **页面刷新**：在非首页刷新，不会 404
- [ ] **404 页面**：访问不存在的 URL，显示自定义 404

### AI 功能验证

- [ ] **API Key 配置**：在设置页面配置 API Key
- [ ] **AI 对话**：发送消息，收到 AI 回复
- [ ] **流式响应**：回复内容逐步显示，有打字机效果
- [ ] **Mock 模式**：无 API Key 时，Mock 模式正常工作
- [ ] **多场景切换**：职业咨询/模拟面试/简历诊断 切换正常

### 视觉与交互验证

- [ ] **暗色模式**：切换暗色模式，所有页面正常显示
- [ ] **系统跟随**：系统切换主题时，页面自动跟随
- [ ] **企鹅动画**：Logo hover 有点头动画
- [ ] **页面过渡**：页面切换有滑入/滑出动画
- [ ] **响应式**：在手机/平板/桌面尺寸下正常显示

### 性能验证

- [ ] **首屏加载**：LCP < 2.5s
- [ ] **交互响应**：INP < 200ms
- [ ] **布局稳定**：CLS < 0.1
- [ ] **Lighthouse 跑分**：Performance ≥ 90

### 安全验证

- [ ] **HTTPS**：地址栏显示安全锁标志
- [ ] **CSP 策略**：浏览器控制台无 CSP 错误
- [ ] **API Key 掩码**：设置页面 API Key 显示为 `sk-****`

---

## 🔍 常见问题排查

### 问题 1：部署后页面空白

**可能原因**：
- `dist/` 目录未正确上传
- Vite `base` 配置不正确（仅 GitHub Pages 需要）

**解决方案**：
```bash
# 确认 dist 目录存在
ls dist/

# 如使用 GitHub Pages，检查 vite.config.ts
# base 应设置为 '/仓库名/'
```

### 问题 2：刷新页面出现 404

**可能原因**：
- SPA 路由未正确配置

**解决方案**：
- **Vercel**：确认 `vercel.json` 包含 rewrites 配置
- **Netlify**：确认 `netlify.toml` 包含 redirects 配置
- **GitHub Pages**：确认 `.htaccess` 或 `_redirects` 文件存在

### 问题 3：样式文件未加载

**可能原因**：
- CSS 文件路径错误
- CDN 缓存未刷新

**解决方案**：
```bash
# 检查构建产物
ls dist/assets/css/

# 硬刷新浏览器
# Chrome: Ctrl + Shift + R
# Firefox: Ctrl + Shift + R
```

### 问题 4：API 请求失败

**可能原因**：
- CORS 限制
- API Key 无效
- 网络连接问题

**解决方案**：
1. 打开浏览器控制台，查看 Network 标签
2. 检查 API 请求的状态码
3. 确认 API Key 正确且有余额
4. 智谱 AI API 地址：`https://open.bigmodel.cn/api/paas/v4`

### 问题 5：暗色模式不生效

**可能原因**：
- `class="dark"` 未正确添加到 `<html>` 标签
- CSS 变量未覆盖暗色模式

**解决方案**：
1. 检查浏览器开发者工具中 `<html>` 标签是否有 `class="dark"`
2. 确认 `index.css` 中 `.dark` 样式定义完整

### 问题 6：部署后构建失败

**可能原因**：
- Node.js 版本不兼容
- 依赖安装失败
- TypeScript 类型错误

**解决方案**：
```bash
# 本地验证构建
npm ci
npm run lint
npm run check
npm run test:run
npm run build

# 确认 Node.js 版本
node -v  # 应 ≥ 18.0.0
```

---

## 🔄 持续集成/持续部署

### Vercel 自动部署

配置 GitHub 集成后，每次 push 到 `main` 分支会自动触发部署：

```
推送代码 → Vercel 自动构建 → 自动部署 → 生成 URL
```

### Netlify 自动部署

配置 GitHub 集成后，每次 push 到 `main` 分支会自动触发部署：

```
推送代码 → Netlify 自动构建 → 自动部署 → 生成 URL
```

### GitHub Pages 自动部署

使用 `.github/workflows/deploy.yml` 工作流：

```yaml
on:
  push:
    branches: [ main, master ]
```

每次 push 到 `main` 分支会自动触发：
1. 安装依赖
2. 运行 ESLint
3. TypeScript 类型检查
4. 运行测试
5. 构建项目
6. 部署到 GitHub Pages

### 分支部署策略

| 分支 | 环境 | 说明 |
|------|------|------|
| `main` | Production | 生产环境，稳定版本 |
| `develop` | Preview | 预览环境，开发中版本 |
| `feature/*` | Preview | 功能分支，测试用 |

---

## 📞 支持与反馈

如部署过程中遇到问题，可通过以下方式获取帮助：

- **Vercel 文档**：https://vercel.com/docs
- **Netlify 文档**：https://docs.netlify.com
- **GitHub Pages 文档**：https://pages.github.com
- **项目 Issue**：https://github.com/YOUR_USERNAME/weilai-e/issues

---

> **总结**：未来鹅项目已具备完整的部署配置，支持 Vercel、Netlify 和 GitHub Pages 三种部署方式。推荐使用 **Vercel CLI** 或 **Netlify 拖拽部署**，最快 5 分钟即可完成上线。
