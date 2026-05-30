# 喝水打卡 - 部署指南

## 方式一：Railway（推荐，免费，30秒完成）

1. 访问 https://railway.app，用 GitHub 登录
2. 把项目推到 GitHub 仓库
3. Railway 点 "New Project" → "Deploy from GitHub repo"
4. 选仓库，Railway 会自动识别 Node.js 项目并部署
5. 部署后会给你一个公网 URL，所有人都能访问

## 方式二：Vercel

1. 需要把 Express 改为 Vercel Serverless Functions（稍复杂）
2. 适合纯前端，不推荐本项目

## 方式三：阿里云 ECS

```bash
# SSH 登录服务器后
git clone <你的仓库>
cd water-tracker
npm install
npm run build
npm start
```

用 nginx 反向代理 3000 端口即可。

## 方式四：Docker

```bash
# 本地先构建前端
npm run build

# 构建镜像
docker build -f deploy/Dockerfile -t water-tracker .

# 运行
docker run -p 3000:3000 water-tracker
```

## 部署后前端需要的改动

部署到真实服务器后，前端 `src/utils/api.ts` 需要把 API_BASE 改回 `/api`：

```typescript
const API_BASE = "/api";
```

然后重新 `npm run build` 生成 dist 目录即可。

## 数据持久化

当前数据存在内存中，服务重启会丢失。如需持久化：
- 简单方案：把 `server/data.js` 改为读写 JSON 文件
- 正式方案：接入 SQLite 或 PostgreSQL
