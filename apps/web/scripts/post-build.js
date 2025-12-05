#!/usr/bin/env node

import { cpSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取项目根目录（apps/web）
const projectRoot = join(__dirname, "..");
const staticSource = join(projectRoot, ".next", "static");
const standaloneDir = join(projectRoot, ".next", "standalone", "apps", "web");
const staticTarget = join(standaloneDir, ".next", "static");

// 检查源目录是否存在
if (!existsSync(staticSource)) {
  console.warn("⚠️  Static assets directory not found:", staticSource);
  console.warn("   This is normal if you haven't built the project yet.");
  process.exit(0);
}

// 检查 standalone 目录是否存在
if (!existsSync(standaloneDir)) {
  console.warn("⚠️  Standalone directory not found:", standaloneDir);
  console.warn("   Make sure 'output: standalone' is enabled in next.config.ts");
  process.exit(0);
}

// 复制静态资源到 standalone 目录
try {
  console.log("📦 Copying static assets to standalone directory...");
  cpSync(staticSource, staticTarget, { recursive: true });
  console.log("✅ Static assets copied successfully");
} catch (error) {
  console.error("❌ Failed to copy static assets:", error.message);
  process.exit(1);
}
