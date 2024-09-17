import { IUserInterface } from "./user.interface";

export interface IOldPassword {
  _id?: string;
  password: string;
  _userId: string | IUserInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
