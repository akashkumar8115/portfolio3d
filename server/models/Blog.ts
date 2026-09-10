import { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (models.Blog) {
  delete models.Blog;
}

export const BlogModel = model("Blog", blogSchema);
