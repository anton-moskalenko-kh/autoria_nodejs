import mongoose from "mongoose";

import { IExchangeRateInterface } from "../interfaces/exchangeRateInterface";

const exchangeRateSchema = new mongoose.Schema({
  USD: {
    type: Number,
    required: true,
  },
  EUR: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ExchangeRateModel = mongoose.model<IExchangeRateInterface>(
  "ExchangeRateModel",
  exchangeRateSchema,
);
