import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { ApiError } from "../errors/api-error";
import { IAdsInterface } from "../interfaces/ads.interface";
import { IUserInterface } from "../interfaces/user.interface";
import { adsRepository } from "../repositories/ads.repository";
import { userRepository } from "../repositories/user.repository";

class UserServices {
  public async getAllUsers(): Promise<IUserInterface[]> {
    return await userRepository.getAllUsers();
  }

  public async getById(userId: string): Promise<IUserInterface> {
    await this.isUserExist(userId);
    return await userRepository.getById(userId);
  }

  public async getAllUserAds(userId: string): Promise<IAdsInterface[]> {
    return await adsRepository.getAllUserAds(userId);
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

  private async isUserExist(userId: string): Promise<void> {
    const user = await userRepository.getByParams({ _id: userId });
    if (!user) {
      throw new ApiError(`User with id ${userId} is doesn't exist`, 404);
    }
  }
}

export const userService = new UserServices();
