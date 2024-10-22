import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IQuestionAnswerTypes {
  creatorId: Types.ObjectId;
  name: string,
  code: string,
}

export interface IQuestionAnswerTypesDocument extends IQuestionAnswerTypes, Document {}

const questionAnswerType = new Schema<IQuestionAnswerTypesDocument>(
  {
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    name :{
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
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

questionAnswerType.pre("updateOne", function () {
    this.set({ updatedAt: new Date() });
  });
  questionAnswerType.plugin(mongoosePaginate);
    
export const QuestionAnswerType = model<IQuestionAnswerTypesDocument>("questionAnswerTypes", questionAnswerType);
