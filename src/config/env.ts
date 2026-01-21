import z from 'zod';

const envSchema = z.object({
  APP_API_PORT: z.coerce.number(),
  APP_API_KEY: z.string().min(1),
});

export type EnvironmentConfig = z.output<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  return envSchema.parse(config);
}
