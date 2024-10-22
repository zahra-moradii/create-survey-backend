import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IPackage {
  name: string;
  code: string;
}

export interface IPackageDocument extends IPackage, Document {}

const packagee = new Schema<IPackageDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    }
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);

packagee.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
packagee.plugin(mongoosePaginate);
packagee.plugin(mongooseAutopopulate);

packagee.pre<IPackageDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();
  next();
});

export const Package = model<IPackageDocument>("packages", packagee);
