import { Document, Schema, model, Types } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
import { PackagePrice } from './flat/PackagePrice';

export interface IProfile {
  companyName: string;
  owner: Types.ObjectId;
  packagePrice: PackagePrice;
  isLegal: boolean;
}

export interface IProfileDocument extends IProfile, Document {}

const profile = new Schema<IProfileDocument>(
  {
    companyName: {
        type: String,
        required: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    packagePrice: {
        type: Object,
        required: false,
    },
    isLegal: {
        type: Boolean,
        required: true,
    }
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);

profile.pre("updateOne", function () {
    this.set({ updatedAt: new Date() });
  });
  profile.plugin(mongoosePaginate);
  profile.plugin(mongooseAutopopulate);
  
  profile.pre<IProfileDocument>("updateOne", function (next: any) {
    this["updatedat"] = Date.now();
    next();
  });
  

export const Profile = model<IProfileDocument>("profiles", profile);
