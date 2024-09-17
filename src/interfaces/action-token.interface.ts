import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IUserInterface } from "./user.interface";

export interface IActionTokenInterface {
  _id?: string;
  actionToken: string;
  type: ActionTokenTypeEnum;
  _userId: string | IUserInterface;
}

export interface IForgotSendEmail extends Pick<IUserInterface, "email"> {}

export interface IForgotResetPassword
  extends Pick<IUserInterface, "password"> {}
