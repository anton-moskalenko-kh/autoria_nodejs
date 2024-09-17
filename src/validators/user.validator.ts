import joi from "joi";

import { regexConstant } from "../constants/regexp.constants";
import { OrderEnum } from "../enums/order.enum";
import { PackageEnum } from "../enums/package.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";

export class UserValidator {
  private static name = joi.string().min(3).trim();
  private static email = joi.string().lowercase().regex(regexConstant.EMAIL);
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();
  private static phone = joi.string().regex(regexConstant.PHONE);
  private static status = joi
    .string()
    .valid(StatusEnum.ACTIVE, StatusEnum.BLOCKED);
  private static role = joi.string().valid(RoleEnum.MODERATOR, RoleEnum.ADMIN);
  private static package = joi
    .string()
    .valid(PackageEnum.BASE, PackageEnum.PREMIUM);

  public static createUser = joi.object({
    name: UserValidator.name.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    phone: UserValidator.phone.required(),
  });

  public static changeUser = joi.object({
    name: UserValidator.name.required(),
    email: UserValidator.email.required(),
    phone: UserValidator.phone.required(),
  });

  public static createModeratorOrAdmin = joi.object({
    name: UserValidator.name.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    phone: UserValidator.phone.required(),
    role: UserValidator.role.required(),
    package: UserValidator.package.default(PackageEnum.PREMIUM),
  });

  public static login = joi.object({
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
  });

  public static checkStatus = joi.object({
    status: UserValidator.status.required(),
  });

  public static forgotPassword = joi.object({
    email: UserValidator.email.required(),
  });

  public static forgotPasswordSet = joi.object({
    password: UserValidator.password.required(),
  });

  public static listQuery = joi.object({
    limit: joi.number().min(1).max(10).default(10),
    page: joi.number().default(1),
    search: joi.string().trim(),
    order: joi
      .string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: joi
      .string()
      .valid(...Object.values(UserListOrderByEnum))
      .default(UserListOrderByEnum.NAME),
  });
}
