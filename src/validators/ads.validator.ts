import joi from "joi";

export class AdsValidator {
  private static brand = joi.string().trim();
  private static model = joi.string().trim();
  private static year = joi.number().min(1950).max(new Date().getFullYear());
  private static price = joi.number().min(100);
  private static description = joi.string().min(20).max(2000);
  private static city = joi.string().trim();
  private static isActive = joi.boolean();
  private static message = joi.string().max(200);

  public static createAds = joi.object({
    brand: AdsValidator.brand.required(),
    model: AdsValidator.model.required(),
    year: AdsValidator.year.required(),
    price: AdsValidator.price.required(),
    description: AdsValidator.description.required(),
    city: AdsValidator.city.required(),
  });

  public static changeAds = joi.object({
    brand: AdsValidator.brand,
    model: AdsValidator.model,
    year: AdsValidator.year,
    price: AdsValidator.price,
    description: AdsValidator.description,
    city: AdsValidator.city,
  });

  public static changeInactiveAds = joi.object({
    brand: AdsValidator.brand,
    model: AdsValidator.model,
    year: AdsValidator.year,
    price: AdsValidator.price,
    description: AdsValidator.description,
    city: AdsValidator.city,
    isActive: AdsValidator.isActive,
    message: AdsValidator.message,
  });
}
