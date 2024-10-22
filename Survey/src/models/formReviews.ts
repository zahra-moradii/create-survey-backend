import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";
import {question} from './flat/question'

export interface IFormReview {
  title: string;
  code: string;
  question: question[];
  startDate: Date;
  expireDate: Date;
  userId: Types.ObjectId;
  profileId: Types.ObjectId;
  answersCount: Number;
  //timer: number;
}

export interface IFormReviewDocument extends IFormReview, Document {}

const formReview = new Schema<IFormReviewDocument>(
  {
      title: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      question: {
        type: [Object],
        required: true
      },
      startDate: {
        type: Date,
        required: true
       },
      expireDate: {
        type: Date,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'users'
      },
      profileId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'profiles'
      },
      answersCount: {
        type: Number,
        required: true,
      }
      // // timer: {
      //   type: Number,
      //   required: true
      // }
  },
  { timestamps: { 
    createdAt: "createdat"},
    collection:"formReviews" 
  }
);

// user.pre('aggregate', function (next: HookNextFunction) {
//   this.pipeline().unshift(
//     {
//       $project: { id: '$_id', other: '$$ROOT' },
//     },
//     {
//       $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$other'] } },
//     },
//     {
//       $project: { other: 0, _id: 0 },
//     },
//   );

//   next();
// });
// countrySchema.virtual('capital',{
//     ref: 'City',
//     localField: 'capitalId',
//     foreignField: '_id',
//     justOne: true
// });

formReview.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
formReview.plugin(mongoosePaginate);
formReview.plugin(mongooseAutopopulate);
formReview.pre("save", function (next) {
  next();
});

formReview.pre<IFormReviewDocument>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();

  // do other pre-updates here
  next();
});

export const FormReview = model<IFormReviewDocument>("formReviews", formReview);