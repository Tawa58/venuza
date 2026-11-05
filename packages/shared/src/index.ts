import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.enum(["ok", "degraded"]),
  service: z.literal("venuza-api"),
  checks: z.object({
    database: z.object({
      status: z.enum(["ok", "skipped", "error"]),
      detail: z.string(),
    }),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
