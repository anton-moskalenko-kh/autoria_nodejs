import { CronJob } from "cron";

import { getExchangeRates } from "../helpers/getExchangeRate";
import { AdsModel } from "../models/AdsModel";
import { ExchangeRateModel } from "../models/ExchangeRateModel";

const handler = async () => {
  try {
    const rates = await getExchangeRates();
    const updatedAt = new Date();

    await ExchangeRateModel.create({
      USD: rates.USD,
      EUR: rates.EUR,
      updatedAt,
    });

    const ads = await AdsModel.find();
    for (const ad of ads) {
      let priceInUSD = ad.priceInUSD;
      let priceInEUR = ad.priceInEUR;
      let priceInUAH = ad.priceInUAH;

      if (ad.currency === "USD") {
        priceInUSD = Math.trunc(ad.price);
        priceInEUR = Math.trunc((ad.price * rates.USD) / rates.EUR);
        priceInUAH = Math.trunc(ad.price * rates.USD);
      } else if (ad.currency === "EUR") {
        priceInEUR = Math.trunc(ad.price);
        priceInUSD = Math.trunc((ad.price / rates.USD) * rates.EUR);
        priceInUAH = Math.trunc(ad.price * rates.EUR);
      } else if (ad.currency === "UAH") {
        priceInUAH = Math.trunc(ad.price);
        priceInUSD = Math.trunc(ad.price / rates.USD);
        priceInEUR = Math.trunc(ad.price / rates.EUR);
      }

      await AdsModel.updateOne(
        { _id: ad._id },
        {
          priceInUSD,
          priceInEUR,
          priceInUAH,
          exchangeRateUSD: rates.USD,
          exchangeRateEUR: rates.EUR,
        },
      );
    }
    console.log("Exchange rates and car prices updated successfully");
  } catch (error) {
    console.error("Error updating exchange rates and car prices:", error);
  }
};

export const updateExchangeRatesAndPrices = new CronJob("0 0 * * *", handler);
