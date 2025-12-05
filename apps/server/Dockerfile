# 构建阶段
FROM node:24-alpine AS builder

# 安装 pnpm（版本需与 lockfile 兼容）
RUN npm install -g pnpm@10

WORKDIR /app

# 第一步：只复制依赖文件（利用 Docker 缓存层）
# 只有当依赖文件变化时，才会重新安装依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 安装所有依赖（包括开发依赖，用于构建）
# 这一步会被缓存，除非上面的依赖文件发生变化
RUN pnpm install --frozen-lockfile

# 第二步：复制构建配置文件
COPY nest-cli.json tsconfig*.json ./

# 第三步：复制源代码（代码变化不会触发依赖重新安装）
COPY libs ./libs
COPY apps/server ./apps/server
COPY . .

# 构建项目
RUN pnpm run build:server

# 清理开发依赖，只保留生产依赖（减小镜像体积）
# 设置 CI=true 避免 pnpm prune 在非交互式环境中失败
RUN CI=true pnpm prune --prod && \
    rm -rf /root/.pnpm-store

# 运行阶段
FROM node:24-alpine

# 安装 pm2
RUN npm install -g pm2

WORKDIR /app

# 从构建阶段复制构建产物
COPY --from=builder /app/dist/apps/server ./dist/apps/server

# 从构建阶段复制已安装的生产依赖（避免重复下载）
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 设置工作目录为构建产物目录（生产环境）
WORKDIR /app/dist/apps/server

# 注意：.env 文件将通过 Kubernetes ConfigMap 挂载到容器中
# 不需要在镜像中创建占位符

# 暴露端口（默认 3710，可通过环境变量覆盖）
EXPOSE 3710

# 设置环境变量，确保生产环境模式
ENV NODE_ENV=production

# 使用 pm2 运行应用
# 工作目录设置为 /app/dist/apps/server，执行 main.js
# main.ts 中的路径逻辑：
# - 生产环境工作目录：/app/dist/apps/server
# - .env: process.cwd() + ".env" = /app/dist/apps/server/.env
# - i18n: 已在构建时复制到 /app/dist/apps/server/i18n，无需运行时同步
# pm2-runtime 会保持容器运行，并在应用崩溃时自动重启
CMD ["pm2-runtime", "start", "main.js", "--name", "wiki-server"]

