import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IEvent {
  name: string;
  code: string;
}

export interface IEventDocument extends IEvent, Document {}

const event = new Schema<IEventDocument>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);

event.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
event.plugin(mongoosePaginate);
event.plugin(mongooseAutopopulate);

event.pre<IEventDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();
  next();
});

export const Event = model<IEventDocument>("events", event);
