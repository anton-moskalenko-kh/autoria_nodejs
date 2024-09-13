import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";

class RoleMiddleware {
  public checkRole(roles: RoleEnum[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { role: userRole } = req.res.locals.jwtPayload as ITokenPayload;
        let hasRole = false;
        roles.forEach((role) => {
          if (role.includes(userRole)) {
            hasRole = true;
          }
        });
        if (!hasRole) {
          throw new ApiError("You haven't access to this action", 403);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const roleMiddleware = new RoleMiddleware();
