import { Document, Schema, model } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";


export interface IOrders {
  user: object;
  profile: object;
  packageprice: object;
  discount: object;
  totalprice:number;
  pureprice: number;
  taxperc: number;
  taxprice:number;
  disprice:number;
  gateway:string;
  gatewayCode:string;
  gatewayReq:object;
  gatewayAns:object;
  paytype:object;
  fishvarizi:string;
  isSuccesspay:boolean;
  status:object;
  monyunit:string;
}

export interface IOrderDocument extends IOrders, Document {}

const orders = new Schema<IOrderDocument>(
  {
    user: {
      type: Object,
      required: true,
    },
    profile: {
        type: Object,
        required: true,
      },
    packageprice: {
        type: Object,
        required: true,
      },
      discount: {
        type: Object,
        required: false,
        default :null,
      },
      totalprice: {
        type: Number,
        required: false,
      },
      pureprice: {
        type: Number,
        required: false,
      },
      taxperc: {
        type: Number,
        required: false,
      },
      taxprice: {
        type: Number,
        required: false,
      },
      disprice: {
        type: Number,
        required: false,
      },
      gateway: {
        type: String,
        required: false,
      },
      gatewayCode: {
        type: String,
        required: false,
      },
      gatewayReq: {
        type: Object,
        required: false,
      },
      gatewayAns: {
        type: Object,
        required: false,
      },
      paytype: {
        type: Object,
        required: false,
      },
      fishvarizi: {
        type: String,
        required: false,
      },
      isSuccesspay: {
        type: Boolean,
        required: false,
      },
      status: {
        type: Object,
        required: false,
      },
      monyunit: {
        type: String,
        required: false,
      },

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

// user.pre("updateOne", function () {
//   this.set({ updatedAt: new Date() });
// });
orders.plugin(mongoosePaginate);
// user.plugin(mongooseAutopopulate);
// user.pre("save", function (next) {
//   var user = this;

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) return next();
//   const hash = Bcrypt.hashSync(user.password, 10);
//   if (hash === "error") return next();
//   user.password = hash;
//   next();
// });

// user.pre<IUserDocument>("updateOne", function (next: any) {
//   this["updatedat"] = Date.now();

//   // do other pre-updates here
//   next();
// });

export const Orders = model<IOrderDocument>("orders", orders);
