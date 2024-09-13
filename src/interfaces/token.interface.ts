import { RoleEnum } from "../enums/role.enum";
import { IUserInterface } from "./user.interface";

export interface ITokenInterface {
  _id?: string;
  accessToken: string;
  refreshToken: string;
  _userId: string | IUserInterface;
}

export interface ITokenPayload {
  userId: string;
  role: RoleEnum;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}