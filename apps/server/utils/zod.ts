import { ZodObject, ZodRawShape } from 'zod';

export function zodToColumns<T extends ZodRawShape>(
  schema: ZodObject<T>,
): { [K in keyof T]: boolean } {
  return Object.keys(schema.shape).reduce(
    (acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    },
    {} as { [K in keyof T]: boolean },
  );
}
