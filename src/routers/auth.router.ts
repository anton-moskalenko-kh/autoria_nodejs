import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { RoleEnum } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
// import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isValidBody(UserValidator.createUser),
  authController.signUp,
);

router.post(
  "/sign-up/admin",
  commonMiddleware.isValidBody(UserValidator.createModeratorOrAdmin),
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.ADMIN]),
  authController.signUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isValidBody(UserValidator.login),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

export const authRouter = router;
