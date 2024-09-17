import joi from "joi";

import { AdsListOrderByEnum } from "../enums/ads-list-order-by.enum";
import { OrderEnum } from "../enums/order.enum";
import { PriceEnum } from "../enums/price.enum";

export class AdsValidator {
  private static brand = joi.string().trim();
  private static model = joi.string().trim();
  private static year = joi.number().min(1950).max(new Date().getFullYear());
  private static price = joi.number().min(100);
  private static currency = joi
    .string()
    .valid(PriceEnum.USD, PriceEnum.EUR, PriceEnum.UAH);
  private static description = joi.string().min(20).max(2000);
  private static city = joi.string().trim();
  private static isActive = joi.boolean();
  private static message = joi.string().max(200);

  public static createAds = joi.object({
    brand: AdsValidator.brand.required(),
    model: AdsValidator.model.required(),
    year: AdsValidator.year.required(),
    price: AdsValidator.price.required(),
    currency: AdsValidator.currency.required(),
    description: AdsValidator.description.required(),
    city: AdsValidator.city.required(),
  });

  public static changeAds = joi.object({
    brand: AdsValidator.brand,
    model: AdsValidator.model,
    year: AdsValidator.year,
    price: AdsValidator.price,
    currency: AdsValidator.currency,
    description: AdsValidator.description,
    city: AdsValidator.city,
  });

  public static changeInactiveAds = joi.object({
    brand: AdsValidator.brand,
    model: AdsValidator.model,
    year: AdsValidator.year,
    price: AdsValidator.price,
    currency: AdsValidator.currency,
    description: AdsValidator.description,
    city: AdsValidator.city,
    isActive: AdsValidator.isActive,
    message: AdsValidator.message,
  });

  public static listQuery = joi.object({
    limit: joi.number().min(1).max(10).default(10),
    page: joi.number().default(1),
    search: joi.string().trim(),
    order: joi
      .string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: joi
      .string()
      .valid(...Object.values(AdsListOrderByEnum))
      .default(AdsListOrderByEnum.PRICE),
  });
}
