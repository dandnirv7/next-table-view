import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { ZodSchema } from "zod";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

const sanitizeData = <T extends Record<string, unknown>>(
  data: T,
  schema: ZodSchema<T>
): T => {
  const purifiedData: Partial<T> = {};

  (Object.keys(data) as (keyof T)[]).forEach((key) => {
    const value = data[key];
    if (typeof value === "string") {
      purifiedData[key] = domPurify.sanitize(value) as T[keyof T];
    } else {
      purifiedData[key] = value;
    }
  });

  const result = schema.safeParse(purifiedData);

  if (!result.success) {
    throw new Error("Invalid data format");
  }

  return result.data;
};

export default sanitizeData;
