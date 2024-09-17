import { PackageEnum } from "../enums/package.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusEnum } from "../enums/status.enum";
import { UserModel } from "../models/UserModel";
import { userRepository } from "../repositories/user.repository";

const dto = {
  name: "admin",
  email: "admin@test.com",
  password: "admin1&",
  phone: "+38050000000",
  role: RoleEnum.ADMIN,
  package: PackageEnum.PREMIUM,
  status: StatusEnum.ACTIVE,
  isVerified: true,
};

export const createFirstUser = async () => {
  const user = await UserModel.countDocuments({});
  if (!user) {
    await userRepository.create(dto);
  }
};
