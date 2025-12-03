import { createZodDto } from "nestjs-zod";

import { CreateModelProviderSchema, ModelProviderSchema, UpdateModelProviderSchema } from "@meta-1/wiki-types";

export class CreateModelProviderDto extends createZodDto(CreateModelProviderSchema) {}

export class UpdateModelProviderDto extends createZodDto(UpdateModelProviderSchema) {}

export class ModelProviderDto extends createZodDto(ModelProviderSchema) {}
