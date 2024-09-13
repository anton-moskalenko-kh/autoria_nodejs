import { NextFunction, Request, Response } from "express";

import { IUserInterface } from "../interfaces/user.interface";
import { userService } from "../services/user.services";

class UserController {
  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getAllUsers();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.getById(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getAllUserAds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.getAllUserAds(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const authUserRole = req.res.locals.jwtPayload.role as string;
      const userId = req.params.userId;
      const dto = req.body as IUserInterface;
      const result = await userService.updateById(userId, dto, authUserRole);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      await userService.deleteById(userId);
      res.status(200).json({
        message: "User deleted",
      });
    } catch (e) {
      next(e);
    }
  }

  public async changeUserStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
      const { status } = req.body as IUserInterface;
      await userService.changeUserStatus(userId, status);
      res.status(200).json({
        message: "Status was changed",
      });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
