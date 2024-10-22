import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IDiscountType {
  name: string;
  code: string;
}

export interface IDiscountTypeDocument extends IDiscountType, Document {}

const discountType = new Schema<IDiscountTypeDocument>(
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

discountType.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
discountType.plugin(mongoosePaginate);
discountType.plugin(mongooseAutopopulate);

discountType.pre<IDiscountTypeDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();
  next();
});

export const DiscountType = model<IDiscountTypeDocument>("discountTypes", discountType);
