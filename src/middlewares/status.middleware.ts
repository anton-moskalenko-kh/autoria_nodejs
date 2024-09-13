import { NextFunction, Request, Response } from "express";

import { StatusEnum } from "../enums/status.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";
import { userRepository } from "../repositories/user.repository";

class StatusMiddleware {
  public async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userRepository.getById(userId);

      if (user.status === StatusEnum.BLOCKED) {
        throw new ApiError(
          "Your account is blocked, please contact with administration",
          403,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const statusMiddleware = new StatusMiddleware();
