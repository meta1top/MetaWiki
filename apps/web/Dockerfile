# 构建阶段
FROM node:24-alpine AS builder

# 安装 pnpm（版本需与 lockfile 兼容）
RUN npm install -g pnpm@10

# 设置工作目录
WORKDIR /app

# 复制 package 文件（利用 Docker 缓存层）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY libs ./libs

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/web ./apps/web
COPY tsconfig.json tsconfig.build.json tsconfig.web.json ./

# 构建应用
RUN pnpm build:web

# 运行阶段
FROM node:24-alpine AS runner

# 安装 pm2（可选，用于进程管理）
RUN npm install -g pm2

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 设置工作目录
WORKDIR /app

# 从构建阶段复制 standalone 输出
# Next.js standalone 模式会在 .next/standalone 下创建包含 node_modules 的独立结构
# 复制整个 standalone 目录结构（包含根目录的 node_modules）
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# 复制静态资源到应用目录内的正确位置
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# 复制 public 目录
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# 设置工作目录为应用目录（server.js 所在位置）
WORKDIR /app/apps/web

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3110

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3110

# 启动应用
# 选项 1: 使用 pm2 管理进程（推荐用于生产环境）
CMD ["pm2-runtime", "start", "server.js", "--name", "nextjs-app"]

# 选项 2: 直接使用 node 启动（如果不需要 pm2，可以取消注释下面这行，并注释掉上面的 CMD）
# CMD ["node", "server.js"]

