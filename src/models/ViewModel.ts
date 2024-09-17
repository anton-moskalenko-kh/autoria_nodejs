import mongoose from "mongoose";

import { IViewInterface } from "../interfaces/view.interface";
import { AdsModel } from "./AdsModel";

const { Schema } = mongoose;

const viewSchema = new Schema(
  {
    _adId: { type: Schema.Types.ObjectId, required: true, ref: AdsModel },
    timestamp: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  },
);

export const ViewModel = mongoose.model<IViewInterface>("views", viewSchema);
