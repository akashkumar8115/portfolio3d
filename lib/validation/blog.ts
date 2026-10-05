import { z } from "zod";
import {
  boundedStringList,
  displayOrderSchema,
  optionalMediaLocationSchema,
  objectIdSchema,
} from "./common";

const blogShape = z.object({
  title: z.string().trim()
    .min(2, "Blog title must be at least 2 characters.")
    .max(160, "Blog title must be 160 characters or fewer."),
  excerpt: z.string().trim()
    .min(8, "Excerpt must be at least 8 characters.")
    .max(500, "Excerpt must be 500 characters or fewer."),
  content: z.string().trim()
    .min(20, "Please add a little more detail to the article.")
    .max(100_000, "Article content must be 100,000 characters or fewer."),
  image: optionalMediaLocationSchema,
  tags: boundedStringList(30, 40, "Tags"),
  published: z.boolean().default(true),
  order: displayOrderSchema.default(0),
}).strict();

export const blogCreateSchema = blogShape;
export const blogUpdateSchema = blogShape.extend({ id: objectIdSchema });

export type BlogInput = z.output<typeof blogCreateSchema>;
