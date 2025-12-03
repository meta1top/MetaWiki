import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser, type SessionUser } from "@meta-1/nest-security";
import type { ModelProvider } from "@meta-1/wiki-types";
import { CreateModelProviderDto, ModelProviderDto, UpdateModelProviderDto } from "../dto";
import { ModelProviderService } from "../service";

@ApiTags("ModelProviderController")
@Controller("/api/ai/model-provider")
export class ModelProviderController {
  constructor(private readonly modelProviderService: ModelProviderService) {}

  @Get("/list")
  @ApiOperation({ summary: "获取模型提供商列表" })
  @ApiResponse({
    status: 200,
    type: [ModelProviderDto],
  })
  list(@CurrentUser() user: SessionUser): Promise<ModelProvider[]> {
    return this.modelProviderService.list(user.id);
  }

  @Post("/create")
  @ApiOperation({ summary: "创建模型提供商" })
  create(@Body() dto: CreateModelProviderDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelProviderService.create(dto, user.id);
  }

  @Get("/:id")
  @ApiOperation({ summary: "根据ID获取模型提供商详情" })
  @ApiParam({ name: "id", description: "模型提供商ID" })
  @ApiResponse({
    status: 200,
    type: ModelProviderDto,
  })
  getById(@Param("id") id: string): Promise<ModelProvider> {
    return this.modelProviderService.getById(id);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "更新模型提供商" })
  @ApiParam({ name: "id", description: "模型提供商ID" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
  })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateModelProviderDto,
    @CurrentUser() user: SessionUser,
  ): Promise<void> {
    return this.modelProviderService.update(id, dto, user.id);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除模型提供商" })
  @ApiParam({ name: "id", description: "模型提供商ID" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
  })
  delete(@Param("id") id: string, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelProviderService.delete(id, user.id);
  }
}
