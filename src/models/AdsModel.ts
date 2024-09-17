import mongoose from "mongoose";

import { CurrenciesEnum } from "../enums/currencies.enum";
import { IAdsInterface } from "../interfaces/ads.interface";
import { UserModel } from "./UserModel";

const { Schema } = mongoose;

const adsSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    images: { type: [String], required: false },
    currency: { type: String, required: true, enum: CurrenciesEnum },
    price: {
      type: Number,
      required: true,
    },
    description: { type: String, required: true },
    city: { type: String, required: true },
    priceInUSD: Number,
    priceInEUR: Number,
    priceInUAH: Number,
    exchangeRateUSD: Number,
    exchangeRateEUR: Number,
    isActive: { type: Boolean, required: true, default: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
    message: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const AdsModel = mongoose.model<IAdsInterface>("AdsModel", adsSchema);
