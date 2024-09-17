import { Router } from "express";

import { imageConfig } from "../constants/image.constants";
import { adsController } from "../controllers/ads.controller";
import { RoleEnum } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { badWordsMiddleWare } from "../middlewares/badWords.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { imagesMiddleware } from "../middlewares/images.middlewares";
import { packageMiddleware } from "../middlewares/package.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { statusMiddleware } from "../middlewares/status.middleware";
import { viewsMiddleware } from "../middlewares/views.middleware";
import { AdsValidator } from "../validators/ads.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(AdsValidator.listQuery),
  adsController.getAll,
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

router.get(
  "/inactive",
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  commonMiddleware.isQueryValid(AdsValidator.listQuery),
  adsController.getInactiveAds,
);

router.get(
  "/:adId/contacts",
  commonMiddleware.isValidId("adId"),
  adsController.getContacts,
);

router.get(
  "/:userId/all",
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isQueryValid(AdsValidator.listQuery),
  adsController.getUserAds,
);

router.get(
  "/:adId",
  commonMiddleware.isValidId("adId"),
  viewsMiddleware.createView,
  adsController.getById,
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

router.get(
  "/:adId/statistics",
  authMiddleware.checkAccessToken,
  packageMiddleware.checkAccessToStatistics,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.getStatistics,
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

router.delete(
  "/:adId",
  commonMiddleware.isValidId("adId"),
  authMiddleware.checkAccessToken,
  statusMiddleware.checkStatus,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.delete,
);

router.post(
  "/:adId/images",
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  imagesMiddleware.isImageValid("images", imageConfig),
  adsController.uploadImages,
);

router.delete(
  "/:adId/images",
  authMiddleware.checkAccessToken,
  roleMiddleware.checkRole([RoleEnum.USER, RoleEnum.MODERATOR, RoleEnum.ADMIN]),
  adsController.deleteImages,
);

export const adsRouter = router;
