import { IAdsInterface } from "../interfaces/ads.interface";
import { AdsModel } from "../models/AdsModel";

class AdsRepository {
  public async getAll(): Promise<IAdsInterface[]> {
    return await AdsModel.find({ isActive: true });
  }

  public async getInactiveAds(): Promise<IAdsInterface[]> {
    return await AdsModel.find({ isActive: false });
  }

  public async create(dto: IAdsInterface): Promise<IAdsInterface> {
    return await AdsModel.create(dto);
  }

  public async getByParams(
    params: Partial<IAdsInterface>,
  ): Promise<IAdsInterface[]> {
    return await AdsModel.find(params);
  }

  public async getById(id: string): Promise<IAdsInterface> {
    return await AdsModel.findById(id);
  }

  public async getUserActiveAds(userId: string): Promise<IAdsInterface[]> {
    return await AdsModel.find({ _userId: userId, isActive: true });
  }

  public async getAllUserAds(userId: string): Promise<IAdsInterface[]> {
    return await AdsModel.find({ _userId: userId });
  }

  public async updateById(
    id: string,
    dto: Partial<IAdsInterface>,
  ): Promise<IAdsInterface> {
    return await AdsModel.findByIdAndUpdate(id, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(adId: string): Promise<void> {
    await AdsModel.deleteOne({ _id: adId });
  }

  public async getAveragePriceByCity(city: string): Promise<string> {
    const result = await AdsModel.aggregate([
      {
        $match: { city: city },
      },
      {
        $group: {
          _id: "$city",
          averagePrice: { $avg: "$price" },
        },
      },
    ]);

    return result.length > 0
      ? `Average price in ${city}: ${result[0].averagePrice}`
      : "Data is unknown";
  }

  public async getAveragePriceByUkraine(): Promise<string> {
    const result = await AdsModel.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$price" },
        },
      },
    ]);

    return result.length > 0
      ? `Average price in Ukraine is: ${Math.trunc(result[0].averagePrice)}`
      : "Data is unknown";
  }
}

export const adsRepository = new AdsRepository();
