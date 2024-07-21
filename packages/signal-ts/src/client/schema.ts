import { z } from 'zod';

export const serializedCertificateSchema = z.object({
  expires: z.number().optional(),
  serialized: z.instanceof(Uint8Array),
});

export type SerializedCertificateType = z.infer<
  typeof serializedCertificateSchema
>;
