import mongoose from "mongoose";

import { PackageEnum } from "../enums/package.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { IUserInterface } from "../interfaces/user.interface";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    package: {
      type: String,
      enum: PackageEnum,
      required: true,
      default: PackageEnum.BASE,
    },
    role: {
      type: String,
      enum: RoleEnum,
      required: true,
      default: RoleEnum.USER,
    },
    isVerified: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      required: true,
      enum: StatusEnum,
      default: StatusEnum.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = mongoose.model<IUserInterface>(
  "UserModel",
  userSchema,
);
