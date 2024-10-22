import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType, ObjectId } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IDiscount {
  code: string;
  startDate: Date;
  endDate: Date;
  eventId: Types.ObjectId;
  userCount: number;
  packagePriceId: Types.ObjectId;
  discountTypeId: Types.ObjectId;
  //UserId: Types.ObjectId;
  percent: number;
}

export interface IDiscountDocument extends IDiscount, Document {}

const discount = new Schema<IDiscountDocument>(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      eventId: {
        type: Schema.Types.ObjectId,
        ref: 'events'
      },
      userCount: {
        type: Number,
        required: true,
      },
      packagePriceId: {
        type: Schema.Types.ObjectId,
        ref: 'packagePrices'
      },
      discountTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'discountTypes'
      },
      // UserId: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'users',
      // },
      percent: {
        type: Number,
        required: true,
      },
    
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);

discount.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
discount.plugin(mongoosePaginate);
discount.plugin(mongooseAutopopulate);

discount.pre<IDiscountDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();
  next();
});

export const Discount = model<IDiscountDocument>("discounts", discount);
