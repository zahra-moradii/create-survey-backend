import { Document, Schema, model, BooleanSchemaDefinition, Types, SchemaType } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface Iroles {
  creatorId: Types.ObjectId;
  name: string,
  code: string,
}

export interface IrolesDocument extends Iroles, Document {}

const role = new Schema<IrolesDocument>(
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

role.pre("updateOne", function () {
    this.set({ updatedAt: new Date() });
  });
  role.plugin(mongoosePaginate);
  role.plugin(mongooseAutopopulate);
    
export const Roles = model<IrolesDocument>("roles", role);
