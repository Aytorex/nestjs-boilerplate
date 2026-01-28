import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createUserBodyDtoSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(1).max(999),
});

export class CreateUserBodyDto extends createZodDto(createUserBodyDtoSchema) {}
