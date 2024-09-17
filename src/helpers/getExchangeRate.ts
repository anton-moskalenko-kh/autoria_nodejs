import axios from "axios";

import { ApiError } from "../errors/api-error";
import { IRatesInterface } from "../interfaces/exchangeRateInterface";

export const getExchangeRates = async (): Promise<IRatesInterface> => {
  try {
    const response = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    );
    const rates = response.data.reduce((acc, rate) => {
      if (rate.ccy === "USD") acc.USD = rate.sale;
      if (rate.ccy === "EUR") acc.EUR = rate.sale;
      return acc;
    }, {});
    return rates;
  } catch (error) {
    throw new ApiError("Error fetching exchange rates", 404);
  }
};
