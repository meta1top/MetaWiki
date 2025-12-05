import * as path from "node:path";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";

import { syncLocales } from "@meta-1/nest-common";
import { loadNacosConfig } from "@meta-1/nest-nacos";
import { AppModule } from "./app.module";
import { setupSwagger } from "./app.swagger";
import type { AppConfig } from "./shared/app.types";

// 在最开始加载环境变量
// 根据环境区分 .env 路径：
// - 开发环境：apps/server/.env（项目根目录下的路径）
// - 生产环境：当前目录的 .env（Docker 容器中 dist/apps/server/.env）
const isDevelopment = process.env.NODE_ENV === "development";
const envPath = isDevelopment ? path.join(process.cwd(), "apps/server/.env") : path.join(process.cwd(), ".env");
config({
  path: envPath,
});

async function bootstrap() {
  const logger = new Logger("Main");
  // 只在开发环境同步 locales 文件（生产环境已在构建时复制到 i18n 目录）
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) {
    logger.log("Syncing locales in development mode");
    syncLocales({
      sourceDir: path.join(process.cwd(), "locales"),
      targetDir: path.join(process.cwd(), "dist/apps/server/i18n"),
      watch: true,
    });
  } else {
    logger.log("Skipping locales sync in production (already copied during build)");
  }
  const nacosConfig = await loadNacosConfig<AppConfig>();
  if (!nacosConfig) {
    logger.warn("Starting application without Nacos configuration");
  }
  const app = await NestFactory.create(AppModule.forRoot(nacosConfig));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3710);
  logger.log(`Server is running on port ${process.env.PORT ?? 3710}`);
}
bootstrap();
