import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
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

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post(
  "/forgot-password",
  commonMiddleware.isValidBody(UserValidator.forgotPassword),
  authController.forgotPassword,
);

router.put(
  "/forgot-password/change",
  commonMiddleware.isValidBody(UserValidator.forgotPasswordSet),
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotPasswordSet,
);

router.post(
  "/verify",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verify,
);

export const authRouter = router;
