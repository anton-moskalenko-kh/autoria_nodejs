import { FilterQuery, SortOrder } from "mongoose";

import { StatusEnum } from "../enums/status.enum";
import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";
import { IUserInterface, IUserListQuery } from "../interfaces/user.interface";
import { UserModel } from "../models/UserModel";

class UserRepository {
  public async getAllUsers(
    query: IUserListQuery,
  ): Promise<[IUserInterface[], number]> {
    const filterObj: FilterQuery<IUserInterface> = {
      isVerified: true,
      status: StatusEnum.ACTIVE,
    };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      UserModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      UserModel.countDocuments(filterObj),
    ]);
  }

  public async getByParams(
    params: Partial<IUserInterface>,
  ): Promise<IUserInterface> {
    return await UserModel.findOne(params);
  }

  public async create(dto: IUserInterface): Promise<IUserInterface> {
    return await UserModel.create(dto);
  }

  public async getById(userId: string): Promise<IUserInterface> {
    return await UserModel.findById(userId);
  }

  public async updateById(
    userId: string,
    dto: Partial<IUserInterface>,
  ): Promise<IUserInterface> {
    return await UserModel.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(userId: string): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }

  public async updateUserStatus(
    userId: string,
    status: StatusEnum,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: { status: status } });
  }

  public async getBlockedUser(
    query: IUserListQuery,
  ): Promise<[IUserInterface[], number]> {
    const filterObj: FilterQuery<IUserInterface> = {
      status: StatusEnum.BLOCKED,
    };
    const sortObj = await this.setQueryParams(query, filterObj);

    const skip = (query.page - 1) * query.limit;
    return await Promise.all([
      UserModel.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      UserModel.countDocuments(filterObj),
    ]);
  }

  private async setQueryParams(
    query: IUserListQuery,
    filterObj: FilterQuery<IUserInterface>,
  ): Promise<{ [key: string]: SortOrder }> {
    if (query.search) {
      filterObj.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }

    const sortObj: { [key: string]: SortOrder } = {};
    switch (query.orderBy) {
      case UserListOrderByEnum.NAME:
        sortObj.name = query.order;
        break;
      default:
        throw new Error("Invalid orderBy");
    }
    return sortObj;
  }
}

export const userRepository = new UserRepository();
