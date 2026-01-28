import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { userIdSchema } from './common.dto';

const updateUserBodyDtoSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().min(1).max(120).optional(),
});

export class UpdateUserBodyDto extends createZodDto(updateUserBodyDtoSchema) {}
export class UpdateUserParamsDto extends createZodDto(
  z.object({ id: userIdSchema }),
) {}
