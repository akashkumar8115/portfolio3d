import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

if (models.Message) {
  delete models.Message;
}

export const MessageModel = model("Message", messageSchema);
