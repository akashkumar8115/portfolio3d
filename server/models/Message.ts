import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    service: { type: String, default: "", trim: true },
    budget: { type: String, default: "", trim: true },
    timeline: { type: String, default: "", trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

if (models.Message) {
  delete models.Message;
}

export const MessageModel = model("Message", messageSchema);
