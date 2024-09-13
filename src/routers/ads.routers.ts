import { Router } from "express";

import { adsController } from "../controllers/ads.controller";
import { RoleEnum } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { badWordsMiddleWare } from "../middlewares/badWords.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { packageMiddleware } from "../middlewares/package.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { statusMiddleware } from "../middlewares/status.middleware";
import { viewsMiddleware } from "../middlewares/views.middleware";
import { AdsValidator } from "../validators/ads.validator";

const router = Router();

router.get("/", adsController.getAll);
router.get(
  "/:adId",
  commonMiddleware.isValidId("adId"),
  viewsMiddleware.createView,
  adsController.getById,
);

router.get("/:adId/contacts", adsController.getContacts);

router.get(
  "/:userId/all",
  commonMiddleware.isValidId("userId"),
  adsController.getUserAds,
);

router.get(
  "/inactive",
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.getInactiveAds,
);

router.get(
  "/:adId/statistics",
  authMiddleware.checkAccessToken,
  packageMiddleware.checkAccessToStatistics,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.getStatistics,
);

router.post(
  "/create",
  authMiddleware.checkAccessToken,
  statusMiddleware.checkStatus,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  packageMiddleware.checkPackage,
  commonMiddleware.isValidBody(AdsValidator.createAds),
  badWordsMiddleWare.isValidDescription,
  adsController.create,
);

router.patch(
  "/:adId",
  commonMiddleware.isValidId("adId"),
  authMiddleware.checkAccessToken,
  statusMiddleware.checkStatus,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  commonMiddleware.isValidBody(AdsValidator.changeAds),
  adsController.update,
);

router.patch(
  "/inactive/:adId",
  commonMiddleware.isValidId("adId"),
  authMiddleware.checkAccessToken,
  statusMiddleware.checkStatus,
  roleMiddleware.checkRole([RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  commonMiddleware.isValidBody(AdsValidator.changeInactiveAds),
  adsController.update,
);

router.delete(
  "/:adId",
  commonMiddleware.isValidId("adId"),
  authMiddleware.checkAccessToken,
  statusMiddleware.checkStatus,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.delete,
);

export const adsRouter = router;
