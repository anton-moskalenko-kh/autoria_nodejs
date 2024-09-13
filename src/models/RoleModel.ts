import mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { RoleInterface } from "../interfaces/role.interface";

const { Schema } = mongoose;

const roleSchema = new Schema({
  value: { type: String, enum: RoleEnum, unique: true, default: RoleEnum.USER },
});

export const RoleSchema = mongoose.model<RoleInterface>(
  "RoleModel",
  roleSchema,
);
