import { createZodDto } from "nestjs-zod";

import { CreateModelSchema, ModelSchema, UpdateModelSchema } from "@meta-1/wiki-types";

export class CreateModelDto extends createZodDto(CreateModelSchema) {}

export class UpdateModelDto extends createZodDto(UpdateModelSchema) {}

export class ModelDto extends createZodDto(ModelSchema) {}
