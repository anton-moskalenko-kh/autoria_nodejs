import { configs } from "../configs/configs";
import {
  IAdResponse,
  IAdsInterface,
  IAdsListQuery,
  IAdsResponseList,
} from "../interfaces/ads.interface";

export class AdPresenter {
  public static toResponse(data: IAdsInterface): IAdResponse {
    return {
      _id: data._id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      images:
        data.images.length !== 0
          ? data.images.map(
            (image) =>
              `${configs.AWS_ENDPOINT_URL}/${configs.AWS_BUCKET_NAME}/${image}`,
          )
          : null,
      description: data.description,
      price: data.price,
      currency: data.currency,
      priceInEUR: data.priceInEUR,
      priceInUSD: data.priceInUSD,
      priceInUAH: data.priceInUAH,
      exchangeRateUSD: data.exchangeRateUSD,
      exchangeRateEUR: data.exchangeRateEUR,
      city: data.city,
      _userId: data._userId,
      isActive: data.isActive,
      message: data.message,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public static toResponseList(
    data: IAdsInterface[],
    total: number,
    query: IAdsListQuery,
  ): IAdsResponseList {
    return {
      data: data.map((item) => this.toResponse(item)),
      total,
      ...query,
    };
  }
}
