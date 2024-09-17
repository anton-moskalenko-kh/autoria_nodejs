import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { ApiError } from "../errors/api-error";
import { IAdsListQuery, IAdsResponseList } from "../interfaces/ads.interface";
import {
  IUserInterface,
  IUserListQuery,
  IUsersResponseList,
} from "../interfaces/user.interface";
import { AdPresenter } from "../presenters/ads.presenter";
import { UserPresenter } from "../presenters/user.presenter";
import { adsRepository } from "../repositories/ads.repository";
import { userRepository } from "../repositories/user.repository";

class UserServices {
  public async getAllUsers(query: IUserListQuery): Promise<IUsersResponseList> {
    const [users, total] = await userRepository.getAllUsers(query);
    if (users.length === 0) {
      throw new ApiError("Users not found", 404);
    }
    return UserPresenter.toResponseList(users, total, query);
  }

  public async getById(userId: string): Promise<IUserInterface> {
    await this.isUserExist(userId);
    return await userRepository.getById(userId);
  }

  public async getAllUserAds(
    userId: string,
    query: IAdsListQuery,
  ): Promise<IAdsResponseList> {
    const [ads, total] = await adsRepository.getAllUserAds(userId, query);
    return AdPresenter.toResponseList(ads, total, query);
  }

  public async updateById(
    userId: string,
    dto: IUserInterface,
    authUserRole: string,
  ): Promise<IUserInterface> {
    await this.isUserExist(userId);
    if ((dto?.role || dto?.package) && authUserRole === RoleEnum.USER) {
      throw new ApiError(
        "You don't have access to update role or package",
        403,
      );
    }
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: string): Promise<void> {
    await this.isUserExist(userId);
    await userRepository.deleteById(userId);
  }

  public async changeUserStatus(
    userId: string,
    status: StatusEnum,
  ): Promise<void> {
    await this.isUserExist(userId);
    await userRepository.updateUserStatus(userId, status);
  }

  public async getBlockedUser(
    query: IUserListQuery,
  ): Promise<IUsersResponseList> {
    const [users, total] = await userRepository.getBlockedUser(query);
    if (users.length === 0) {
      throw new ApiError("Users not found", 404);
    }
    return UserPresenter.toResponseList(users, total, query);
  }

  private async isUserExist(userId: string): Promise<void> {
    const user = await userRepository.getByParams({ _id: userId });
    if (!user) {
      throw new ApiError(`User with id ${userId} is doesn't exist`, 400);
    }
  }
}

export const userService = new UserServices();
