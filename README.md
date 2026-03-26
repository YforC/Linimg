# Linimg

一个基于 Next.js 的图片与视频生成前端，服务端通过兼容 OpenAI SDK 的接口代理调用 `gemini-imagen` 和 `gemini-veo`。

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写：

```env
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=http://your-host:7860/v1
```

3. 启动开发环境

```bash
npm run dev
```

4. 打开页面

`http://localhost:3000`

## 验证

```bash
npm test
npm run build
```

## Docker

### 本地构建镜像

```bash
docker build -t bilon/linimg:latest .
```

### 本地运行容器

```bash
docker run --rm -p 3000:3000 --env-file .env.local bilon/linimg:latest
```

### 使用 Docker Compose

```bash
docker compose up -d --build
```

## Docker Hub

目标镜像名：

```text
bilon/linimg:latest
```

推送命令：

```bash
docker push bilon/linimg:latest
```

## GitHub

目标仓库：

```text
https://github.com/YforC/Linimg
```
