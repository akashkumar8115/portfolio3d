import { Schema, model, models } from "mongoose";

const statsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "global" },
    totalViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const visitorSchema = new Schema(
  {
    visitorId: { type: String, required: true, unique: true },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const VisitStatsModel = models.VisitStats ?? model("VisitStats", statsSchema);
export const VisitorModel = models.Visitor ?? model("Visitor", visitorSchema);
