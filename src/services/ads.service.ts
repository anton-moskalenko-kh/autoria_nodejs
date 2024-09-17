import { UploadedFile } from "express-fileupload";

import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import {
  IAdsInterface,
  IAdsListQuery,
  IAdsResponseList,
} from "../interfaces/ads.interface";
import { IStatisticsInterface } from "../interfaces/statistics.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUserInterface } from "../interfaces/user.interface";
import { AdPresenter } from "../presenters/ads.presenter";
import { adsRepository } from "../repositories/ads.repository";
import { userRepository } from "../repositories/user.repository";
import { viewRepository } from "../repositories/view.repository";
import { s3Service } from "./s3.service";

class AdsService {
  public async getAll(query: IAdsListQuery): Promise<IAdsResponseList> {
    const [ads, total] = await adsRepository.getAll(query);
    if (ads.length === 0) {
      throw new ApiError("Ads not found", 404);
    }
    return AdPresenter.toResponseList(ads, total, query);
  }

  public async getById(adId: string): Promise<IAdsInterface> {
    await this.isAdsExist(adId);
    return await adsRepository.getById(adId);
  }

  public async getContacts(adId: string): Promise<IUserInterface> {
    await this.isAdsExist(adId);
    const ads = await adsRepository.getById(adId);

    return await userRepository.getById(ads._userId.toString());
  }

  public async getUserAds(
    userId: string,
    query: IAdsListQuery,
  ): Promise<IAdsResponseList> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError(`User with id ${userId} not found`, 400);
    }
    const [ads, total] = await adsRepository.getUserActiveAds(userId, query);
    if (ads.length === 0) {
      throw new ApiError("This user doesn't have any ads", 404);
    }
    return AdPresenter.toResponseList(ads, total, query);
  }

  public async getInactiveAds(query: IAdsListQuery): Promise<IAdsResponseList> {
    const [ads, total] = await adsRepository.getInactiveAds(query);
    if (ads.length === 0) {
      throw new ApiError("Ads not found", 404);
    }
    return AdPresenter.toResponseList(ads, total, query);
  }

  public async getStatistics(adId: string): Promise<IStatisticsInterface> {
    await this.isAdsExist(adId);
    const { city } = await adsRepository.getById(adId);

    const totalViews = await viewRepository.getTotalViews(adId);
    const todayViews = await viewRepository.getTodayViews(adId);
    const weekViews = await viewRepository.getWeekViews(adId);
    const monthViews = await viewRepository.getMonthViews(adId);
    const averagePriceByCity = await adsRepository.getAveragePriceByCity(city);
    const averagePriceByUkraine =
      await adsRepository.getAveragePriceByUkraine();

    return {
      totalViews,
      todayViews,
      weekViews,
      monthViews,
      averagePriceByCity,
      averagePriceByUkraine,
    };
  }

  public async create(
    dto: IAdsInterface,
    payload: ITokenPayload,
  ): Promise<IAdsInterface> {
    if (dto.isActive === false) {
      return await adsRepository.create({
        ...dto,
        _userId: payload.userId,
        message:
          "The ad contains obscene language and can no longer be edited. Moderator will check your ad",
      });
    }
    return await adsRepository.create({
      ...dto,
      _userId: payload.userId,
    });
  }

  public async update(
    payload: ITokenPayload,
    adId: string,
    dto: IAdsInterface,
  ): Promise<IAdsInterface> {
    await this.isAdsExist(adId);
    const ads = await adsRepository.getById(adId);
    if (
      ads._userId.toString() === payload.userId ||
      payload.role === RoleEnum.MODERATOR ||
      payload.role === RoleEnum.ADMIN
    ) {
      return await adsRepository.updateById(adId, dto);
    } else {
      throw new ApiError(
        "You don't have permission to update this announcement",
        403,
      );
    }
  }

  public async delete(payload: ITokenPayload, adId: string): Promise<void> {
    await this.isAdsExist(adId);
    const ads = await adsRepository.getById(adId);
    if (
      ads._userId.toString() === payload.userId ||
      payload.role === RoleEnum.MODERATOR ||
      payload.role === RoleEnum.ADMIN
    ) {
      return await adsRepository.deleteById(adId);
    } else {
      throw new ApiError(
        "You don't have permission to delete this announcement",
        403,
      );
    }
  }

  public async uploadImages(
    adId: string,
    files: UploadedFile[],
  ): Promise<IAdsInterface> {
    const ad = await adsRepository.getById(adId);
    if (ad.images.length > 0) {
      ad.images.map((file) => s3Service.deleteFile(file));
    }
    const uploadPromises = Array.isArray(files)
      ? files.map((file) => s3Service.uploadFiles("carImages", adId, file))
      : [];

    const images = await Promise.all(uploadPromises);
    const updatedAd = await adsRepository.updateById(adId, { images });
    return updatedAd;
  }

  public async deleteImages(adId: string): Promise<IAdsInterface> {
    const ad = await adsRepository.getById(adId);
    if (ad.images.length > 0) {
      ad.images.map((file) => s3Service.deleteFile(file));
    } else {
      throw new ApiError("This ad doesn't have any images", 404);
    }
    return await adsRepository.updateById(adId, { images: [] });
  }

  private async isAdsExist(adId: string): Promise<void> {
    const ad = await adsRepository.getById(adId);
    if (!ad) {
      throw new ApiError(`Ads with id ${adId} is doesn't exist`, 404);
    }
  }
}

export const adsService = new AdsService();
