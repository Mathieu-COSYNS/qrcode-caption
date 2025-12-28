import { z } from "astro/zod";

export const QrCodeGeneratorTypesSchema = z.enum(["text", "url", "phone", "epc"]);

export type QrCodeGeneratorType = z.infer<typeof QrCodeGeneratorTypesSchema>;
