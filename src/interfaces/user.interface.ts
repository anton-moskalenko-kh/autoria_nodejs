import { OrderEnum } from "../enums/order.enum";
import { PackageEnum } from "../enums/package.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";
import { ITokenPair } from "./token.interface";

export interface IUserInterface {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  phone: string;
  package: PackageEnum;
  status: StatusEnum;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogin extends Pick<IUserInterface, "email" | "password"> {}

export interface IUserResponse
  extends Pick<
    IUserInterface,
    | "_id"
    | "name"
    | "email"
    | "role"
    | "phone"
    | "package"
    | "status"
    | "isVerified"
    | "createdAt"
    | "updatedAt"
  > {}

export interface IUsersResponseList extends IUserListQuery {
  data: IUserResponse[];
  total: number;
}

export interface IAuthResponse {
  data: IUserResponse;
  tokens: ITokenPair;
}

export interface IUserListQuery {
  limit?: number;
  page?: number;
  search?: string;
  order?: OrderEnum;
  orderBy?: UserListOrderByEnum;
}

export interface IUserContactResponse
  extends Pick<IUserInterface, "_id" | "name" | "email" | "phone"> {}
