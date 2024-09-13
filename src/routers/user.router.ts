import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { RoleEnum } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAllUsers);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getById,
);

router.get(
  "/:userId/ads",
  commonMiddleware.isValidId("userId"),
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  userController.getAllUserAds,
);

router.patch(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  userController.deleteById,
);

router.patch(
  "/status/:userId",
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isValidBody(UserValidator.checkStatus),
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  userController.changeUserStatus,
);

export const userRouter = router;
