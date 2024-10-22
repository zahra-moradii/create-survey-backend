import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType, ObjectId } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";
import {registrator} from './flat/registrator'
import {questions} from './flat/questions'

export interface IFormReviewsAnswers {
  //creatorId: Types.ObjectId;
  registrator: registrator;
  questions: questions[];
  code: string;
  // deviceId: number;
  ip: string;
  formReviews: Types.ObjectId;
  isViewed: boolean;
  viewBy: Types.ObjectId;
}

export interface IFormReviewsAnswersDocument extends IFormReviewsAnswers, Document {}

const formReviewsAnswer = new Schema<IFormReviewsAnswersDocument>(
  {
    // creatorId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'users',
    //     required: true
    //   },
    registrator: {
      type: Object,
      required: true
    },
    questions: {
      type: [Object],
      required: true
    },
    code: {
     type: String,
     required: true 
    },
    // deviceId: {
    //   type: Number,
    //   required: true
    // },
    ip: {
      type: String,
      required: false
    },
    isViewed: {
      type: Boolean,
      required: false
    },
    viewBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'users'
    },
    formReviews: {
      type: Schema.Types.ObjectId,
      ref: 'formReview',
      required: true  
     }

  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);


formReviewsAnswer.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});
formReviewsAnswer.plugin(mongoosePaginate);
formReviewsAnswer.plugin(mongooseAutopopulate);
formReviewsAnswer.pre("save", function (next) {
  next();
});

formReviewsAnswer.pre<IFormReviewsAnswers>("updateOne", function (next: any) {
  this["updatedat"] = Date.now();

  // do other pre-updates here
  next();
});

export const FormReviewsAnswer = model<IFormReviewsAnswersDocument>("formReviewsAnswers", formReviewsAnswer);
