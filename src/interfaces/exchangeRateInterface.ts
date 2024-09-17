export interface IExchangeRateInterface {
  USD: number;
  EUR: number;
  updatedAt: Date;
}

export interface IRatesInterface
  extends Pick<IExchangeRateInterface, "USD" | "EUR"> {}
