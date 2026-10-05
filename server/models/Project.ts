import { Schema, model, models, type InferSchemaType } from "mongoose";

const socialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true },
  },
  { _id: false },
);

const projectClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const projectMetricSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectTestimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, default: "", trim: true },
    designation: { type: String, default: "", trim: true },
    organization: { type: String, default: "", trim: true },
    avatar: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    github: { type: String, default: "", trim: true },
    demo: { type: String, default: "", trim: true },
    socialLinks: { type: socialLinksSchema, default: undefined },
    documentationUrl: { type: String, trim: true },
    clients: { type: [projectClientSchema], default: [] },
    impactMetrics: { type: [projectMetricSchema], default: [] },
    testimonials: { type: [projectTestimonialSchema], default: [] },
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
