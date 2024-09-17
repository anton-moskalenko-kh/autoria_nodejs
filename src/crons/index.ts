import { removeOldTokensCron } from "./remove-old-token";
import { updateExchangeRatesAndPrices } from "./update-rates-and-prices.cron";

export const jobRunner = () => {
  updateExchangeRatesAndPrices.start();
  removeOldTokensCron.start();
};
