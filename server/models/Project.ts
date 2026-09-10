import { Schema, model, models, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    github: { type: String, default: "", trim: true },
    demo: { type: String, default: "", trim: true },
    isVideo: { type: Boolean, default: false },
    technologies: { type: [String], default: [] },
    company: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    projectType: { type: String, default: "", trim: true },
    highlights: { type: [String], default: [] },
    details: { type: String, default: "", trim: true },
    kind: { type: String, enum: ["personal", "partnership"], default: "personal" },
    companySlug: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["Web Development", "Full Stack", "Frontend", "Backend"],
      default: "Full Stack",
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: string };

if (models.Project) {
  delete models.Project;
}

export const ProjectModel = model("Project", projectSchema);
