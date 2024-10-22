import { Document, Schema, model, Types } from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAutopopulate = require("mongoose-autopopulate");
export type AccountType = "superadmin" | "agent" | "client";

export interface IUser {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  companyName: string;
  phone: string;
  permissions: string[];
  roles: string[];
  options: string;
  active: string;
  profile: Types.ObjectId;
}

export interface IUserDocument extends IUser, Document {}

const user = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: { unique: true, sparse: true },
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Must be at least 6, got {VALUE}"],
      maxLength: [20, "Must be at most 20, got {VALUE}"],
    },
    permissions: {
      type: [String],
      required: true,
      default: ["user"],
    },
    roles: {
      type: [String],
      required: true,
      default: ["user"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [11, "Must be exactly 11, got {VALUE}"],
      maxLength: [11, "Must be exactly 11, got {VALUE}"],
    },

    companyName: {
      type: String,
      required: false,
    },
    options: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
      default: "true",
    },
    profile: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: { createdAt: "createdat", updatedAt: "updatedat" } }
);
user.plugin(mongoosePaginate);
export const User = model<IUserDocument>("users", user);
