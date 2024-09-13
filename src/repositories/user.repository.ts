import { StatusEnum } from "../enums/status.enum";
import { IUserInterface } from "../interfaces/user.interface";
import { UserModel } from "../models/UserModel";

class UserRepository {
  public async getAllUsers(): Promise<IUserInterface[]> {
    return await UserModel.find();
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
    dto: IUserInterface,
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
}

export const userRepository = new UserRepository();
