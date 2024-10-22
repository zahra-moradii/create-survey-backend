import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IPackagePrice {
  packageId: Types.ObjectId;
  duration: string; //based on months
  price: number; 
  users: number;
  forms: number;
}

export interface IPackagePriceDocument extends IPackagePrice, Document {}

const packagePrice = new Schema<IPackagePriceDocument>(
  {
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'packages'
      },
    duration: {
        type: String,
        required: true,
      },
    price: {
        type: Number,
        required: true,
      },
    users: {
        type: Number,
        required: true,
      },
    forms: {
        type: Number,
        required: true,
      },
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);

packagePrice.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
packagePrice.plugin(mongoosePaginate);
packagePrice.plugin(mongooseAutopopulate);

packagePrice.pre<IPackagePriceDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();
  next();
});

export const PackagePrice = model<IPackagePriceDocument>("packagePrices", packagePrice);
