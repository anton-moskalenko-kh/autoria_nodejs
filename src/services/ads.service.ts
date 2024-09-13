import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { IAdsInterface } from "../interfaces/ads.interface";
import { IStatisticsInterface } from "../interfaces/statistics.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUserInterface } from "../interfaces/user.interface";
import { adsRepository } from "../repositories/ads.repository";
import { userRepository } from "../repositories/user.repository";
import { viewRepository } from "../repositories/view.repository";

class AdsService {
  public async getAll(): Promise<IAdsInterface[]> {
    return await adsRepository.getAll();
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

  public async getUserAds(userId: string): Promise<IAdsInterface[]> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError(`User with id ${userId} not found`, 404);
    }

    const result = await adsRepository.getUserActiveAds(userId);
    if (result.length === 0) {
      throw new ApiError("This user doesn't have any ands", 404);
    }
    return result;
  }

  public async getInactiveAds(): Promise<IAdsInterface[]> {
    return await adsRepository.getInactiveAds();
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

  private async isAdsExist(adId: string): Promise<void> {
    const ads = await adsRepository.getById(adId);
    if (!ads) {
      throw new ApiError(`Ads with id ${adId} is doesn't exist`, 404);
    }
  }
}

export const adsService = new AdsService();
