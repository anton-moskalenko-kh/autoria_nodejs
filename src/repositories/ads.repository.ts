import { FilterQuery, SortOrder } from "mongoose";

import { AdsListOrderByEnum } from "../enums/ads-list-order-by.enum";
import { IAdsInterface, IAdsListQuery } from "../interfaces/ads.interface";
import { AdsModel } from "../models/AdsModel";

class AdsRepository {
  public async getAll(
    query: IAdsListQuery,
  ): Promise<[IAdsInterface[], number]> {
    const filterObj: FilterQuery<IAdsInterface> = { isActive: true };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      AdsModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      AdsModel.countDocuments(filterObj),
    ]);
  }

  public async getInactiveAds(
    query: IAdsListQuery,
  ): Promise<[IAdsInterface[], number]> {
    const filterObj: FilterQuery<IAdsInterface> = { isActive: false };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      AdsModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      AdsModel.countDocuments(filterObj),
    ]);
  }

  public async create(dto: IAdsInterface): Promise<IAdsInterface> {
    return await AdsModel.create(dto);
  }

  public async getByParams(
    params: Partial<IAdsInterface>,
  ): Promise<IAdsInterface[]> {
    return await AdsModel.find(params);
  }

  public async getById(adId: string): Promise<IAdsInterface> {
    return await AdsModel.findById(adId);
  }

  public async getUserActiveAds(
    userId: string,
    query: IAdsListQuery,
  ): Promise<[IAdsInterface[], number]> {
    const filterObj: FilterQuery<IAdsInterface> = {
      _userId: userId,
      isActive: true,
    };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      AdsModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      AdsModel.countDocuments(filterObj),
    ]);
  }

  public async getAllUserAds(
    userId: string,
    query: IAdsListQuery,
  ): Promise<[IAdsInterface[], number]> {
    const filterObj: FilterQuery<IAdsInterface> = { _userId: userId };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      AdsModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      AdsModel.countDocuments(filterObj),
    ]);
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
          averagePrice: { $avg: "$priceInUSD" },
        },
      },
    ]);

    return result.length > 0
      ? `Average price in ${city}: ${result[0].averagePrice} USD`
      : "Data is unknown";
  }

  public async getAveragePriceByUkraine(): Promise<string> {
    const result = await AdsModel.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$priceInUSD" },
        },
      },
    ]);

    return result.length > 0
      ? `Average price in Ukraine is: ${Math.trunc(result[0].averagePrice)} USD`
      : "Data is unknown";
  }

  private async setQueryParams(
    query: IAdsListQuery,
    filterObj: FilterQuery<IAdsInterface>,
  ): Promise<{ [key: string]: SortOrder }> {
    if (query.search) {
      filterObj.$or = [
        { brand: { $regex: query.search, $options: "i" } },
        { model: { $regex: query.search, $options: "i" } },
        { city: { $regex: query.search, $options: "i" } },
      ];
    }

    const sortObj: { [key: string]: SortOrder } = {};
    switch (query.orderBy) {
      case AdsListOrderByEnum.BRAND:
        sortObj.brand = query.order;
        break;
      case AdsListOrderByEnum.MODEL:
        sortObj.model = query.order;
        break;
      case AdsListOrderByEnum.PRICE_IN_USD:
        sortObj.priceInUSD = query.order;
        break;
      case AdsListOrderByEnum.PRICE_IN_EUR:
        sortObj.priceInEUR = query.order;
        break;
      case AdsListOrderByEnum.PRICE_IN_UAH:
        sortObj.priceInUAH = query.order;
        break;
      case AdsListOrderByEnum.CITY:
        sortObj.city = query.order;
        break;
      case AdsListOrderByEnum.YEAR:
        sortObj.year = query.order;
        break;
      default:
        throw new Error("Invalid orderBy");
    }
    return sortObj;
  }
}

export const adsRepository = new AdsRepository();
