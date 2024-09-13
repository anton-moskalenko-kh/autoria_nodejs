import { PackageEnum } from "../enums/package.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";

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
