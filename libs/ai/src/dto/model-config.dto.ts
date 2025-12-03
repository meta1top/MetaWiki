import { createZodDto } from "nestjs-zod";

import { CreateModelConfigSchema, ModelConfigSchema, UpdateModelConfigSchema } from "@meta-1/wiki-types";

export class CreateModelConfigDto extends createZodDto(CreateModelConfigSchema) {}

export class UpdateModelConfigDto extends createZodDto(UpdateModelConfigSchema) {}

export class ModelConfigDto extends createZodDto(ModelConfigSchema) {}
