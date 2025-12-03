import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser, type SessionUser } from "@meta-1/nest-security";
import type { Model } from "@meta-1/wiki-types";
import { CreateModelDto, ModelDto, UpdateModelDto } from "../dto";
import { ModelService } from "../service";

@ApiTags("ModelController")
@Controller("/api/ai/model")
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get("/list")
  @ApiOperation({ summary: "获取模型列表" })
  @ApiQuery({ name: "providerId", required: false, description: "模型提供商ID" })
  @ApiResponse({
    status: 200,
    type: [ModelDto],
  })
  list(@CurrentUser() user: SessionUser, @Query("providerId") providerId?: string): Promise<Model[]> {
    return this.modelService.list(user.id, providerId);
  }

  @Post("/create")
  @ApiOperation({ summary: "创建模型" })
  create(@Body() dto: CreateModelDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelService.create(dto, user.id);
  }

  @Get("/:id")
  @ApiOperation({ summary: "根据ID获取模型详情" })
  @ApiParam({ name: "id", description: "模型ID" })
  @ApiResponse({
    status: 200,
    type: ModelDto,
  })
  getById(@Param("id") id: string): Promise<Model> {
    return this.modelService.getById(id);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "更新模型" })
  @ApiParam({ name: "id", description: "模型ID" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
  })
  update(@Param("id") id: string, @Body() dto: UpdateModelDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelService.update(id, dto, user.id);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除模型" })
  @ApiParam({ name: "id", description: "模型ID" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
  })
  delete(@Param("id") id: string, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelService.delete(id, user.id);
  }
}
