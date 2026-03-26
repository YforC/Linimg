# Linimg

Linimg 是一个基于 Next.js App Router 的图片与视频生成工作台。前端提供统一的创作输入、结果查看与历史记录，服务端通过兼容 OpenAI SDK 的接口代理生成请求，适合部署为单独的内部工具或轻量 Web 应用。

## 项目特性

- 单页工作台，支持图片生成、视频生成与历史记录切换
- 服务端代理调用，密钥保存在服务端环境变量中
- 兼容 OpenAI SDK 风格接口，当前接入 `gemini-imagen` 与 `gemini-veo`
- 历史记录持久化到浏览器本地存储，刷新页面后仍可查看
- 提供 Dockerfile 与 `docker-compose.yml`，可直接用于容器化部署

## 界面能力

- 图片生成：输入提示词后请求 `/api/generate-image`
- 视频生成：输入提示词后请求 `/api/generate-video`
- 历史记录：展示历史生成条目，并保留资源链接与提示词复用入口

说明：
- 视频时长在当前实现中固定为 8 秒
- 历史记录保存在浏览器本地，不会同步到服务端
- 资源展示依赖上游接口返回可访问的 URL

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vitest + Testing Library
- OpenAI Node SDK

## 接口说明

项目的服务端代理层并不依赖 OpenAI 官方图片或视频专用端点，而是按兼容接口的方式调用 `chat.completions.create`。

- 图片模型：`gemini-imagen`
- 视频模型：`gemini-veo`
- 上游地址：由 `OPENAI_BASE_URL` 指定
- 鉴权方式：`Authorization: Bearer <OPENAI_API_KEY>`

接口细节可参考项目中的 [api.md](./api.md)。

## 环境变量

启动前请准备 `.env.local`：

```env
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=http://your-host:7860/v1
```

变量说明：

- `OPENAI_API_KEY`：上游兼容接口的访问密钥
- `OPENAI_BASE_URL`：上游接口基础地址，示例中指向 `/v1`

可直接复制 [.env.example](./.env.example) 为 `.env.local` 后再填写实际值。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 质量验证

运行测试：

```bash
npm test
```

执行生产构建：

```bash
npm run build
```

## Docker 部署

### 构建镜像

```bash
docker build -t bilon/linimg:latest .
```

### 直接运行

```bash
docker run --rm -p 3000:3000 --env-file .env.local bilon/linimg:latest
```

### 使用 Docker Compose

```bash
docker compose up -d --build
```

Compose 文件位于 [docker-compose.yml](./docker-compose.yml)，默认映射端口为 `3000`，并从 `.env.local` 读取运行时环境变量。

## 镜像发布

Docker Hub 镜像名：

```text
bilon/linimg:latest
```

拉取命令：

```bash
docker pull bilon/linimg:latest
```

## 项目结构

```text
app/
  api/
    generate-image/
    generate-video/
  page.tsx
src/
  components/workbench/
  config/
  lib/
  server/
  types/
Dockerfile
docker-compose.yml
api.md
```

目录说明：

- `app/page.tsx`：工作台页面入口
- `app/api/*`：图片与视频生成代理接口
- `src/components/workbench`：工作台组件
- `src/server`：上游客户端封装与返回解析逻辑
- `api.md`：兼容接口调用说明

## 仓库与发布地址

- GitHub：`https://github.com/YforC/Linimg`
- Docker Hub：`https://hub.docker.com/r/bilon/linimg`

## 许可

当前仓库未附带单独的 License 文件。如需开源发布，请补充明确的许可证声明。
