import { NextFunction, Request, Response } from "express";

import { PackageEnum } from "../enums/package.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";
import { adsRepository } from "../repositories/ads.repository";
import { userRepository } from "../repositories/user.repository";

class PackageMiddleware {
  public async checkPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userRepository.getById(userId);
      const adsById = await adsRepository.getByParams({
        _userId: userId,
      });

      if (user.package === PackageEnum.BASE && adsById.length > 0) {
        throw new ApiError(
          "You can create only one announcement. Upgrade your package to premium",
          403,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAccessToStatistics(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userRepository.getById(userId);

      if (user.package === PackageEnum.BASE) {
        throw new ApiError(
          "You cannot see statics of ad. Upgrade your package to premium in order to have access",
          403,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const packageMiddleware = new PackageMiddleware();
