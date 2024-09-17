import { ITokenPair } from "../interfaces/token.interface";
import {
  IAuthResponse,
  IUserContactResponse,
  IUserInterface,
  IUserListQuery,
  IUserResponse,
  IUsersResponseList,
} from "../interfaces/user.interface";

export class UserPresenter {
  public static toResponse(data: IUserInterface): IUserResponse {
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      package: data.package,
      status: data.status,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public static toResponseList(
    data: IUserInterface[],
    total: number,
    query: IUserListQuery,
  ): IUsersResponseList {
    return {
      data: data.map((item) => this.toResponse(item)),
      total,
      ...query,
    };
  }

  public static toAuthResponse(
    data: IUserInterface,
    tokens: ITokenPair,
  ): IAuthResponse {
    return {
      data: this.toResponse(data),
      tokens,
    };
  }

  public static toUserContact(data: IUserInterface): IUserContactResponse {
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
  }
}
