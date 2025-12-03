import * as path from "node:path";
import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@nestjs-modules/ioredis";
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from "nestjs-i18n";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { AssetsModule } from "@meta-1/nest-assets";
import { CommonModule } from "@meta-1/nest-common";
import { MessageModule } from "@meta-1/nest-message";
import { NacosModule } from "@meta-1/nest-nacos";
import { SecurityModule } from "@meta-1/nest-security";
import { AccountModule, AuthGuard } from "@meta-1/wiki-account";
import { AiModule } from "@meta-1/wiki-ai";
import { KnowledgeBaseModule } from "@meta-1/wiki-kb";
import { AssetsController, ConfigController, MailCodeController } from "./controller";
import type { AppConfig } from "./shared";

@Module({})
export class AppModule {
  static forRoot(preloadedConfig: AppConfig | null): DynamicModule {
    const logger = new Logger(AppModule.name);
    const i18nPath = path.join(__dirname, "i18n");
    const imports: DynamicModule["imports"] = [
      DiscoveryModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: "apps/server/.env",
      }),
      I18nModule.forRoot({
        fallbackLanguage: "zh-CN",
        loader: I18nJsonLoader,
        loaderOptions: {
          path: i18nPath,
          watch: process.env.NODE_ENV === "development",
        },
        logging: true,
        resolvers: [
          { use: QueryResolver, options: ["lang"] },
          new HeaderResolver(["x-lang"]),
          new AcceptLanguageResolver(),
        ],
      }),
      NacosModule.forRoot({
        server: process.env.NACOS_SERVER!,
        naming: {
          serviceName: process.env.APP_NAME!,
        },
        config: {
          dataId: process.env.APP_NAME!,
        },
      }),
    ];

    if (preloadedConfig?.database) {
      logger.log("Initializing TypeORM with preloaded config");
      imports.push(
        TypeOrmModule.forRoot({
          type: "mysql",
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          ...preloadedConfig.database,
        }),
      );
    } else {
      logger.warn("Database config not found, skipping TypeORM initialization");
    }

    if (preloadedConfig?.redis) {
      logger.log("Initializing Redis with preloaded config (global)");
      imports.push({
        ...RedisModule.forRoot({
          ...preloadedConfig.redis,
        }),
        global: true,
      });
    } else {
      logger.warn("Redis config not found, skipping Redis initialization");
    }

    return {
      module: AppModule,
      imports: [
        ...imports,
        CommonModule,
        MessageModule,
        SecurityModule,
        AssetsModule,
        AccountModule,
        AiModule,
        KnowledgeBaseModule,
      ],
      controllers: [AssetsController, ConfigController, MailCodeController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    };
  }
}
