import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { IAdsInterface, IAdsListQuery } from "../interfaces/ads.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { AdPresenter } from "../presenters/ads.presenter";
import { UserPresenter } from "../presenters/user.presenter";
import { adsService } from "../services/ads.service";

class AdsController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IAdsListQuery;
      const result = await adsService.getAll(query);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const ad = await adsService.getById(adId);
      const result = AdPresenter.toResponse(ad);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const user = await adsService.getContacts(adId);
      const result = UserPresenter.toUserContact(user);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getUserAds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const query = req.query as IAdsListQuery;
      const result = await adsService.getUserAds(userId, query);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getInactiveAds(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IAdsListQuery;
      const result = await adsService.getInactiveAds(query);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const result = await adsService.getStatistics(adId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IAdsInterface;
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const ad = await adsService.create(dto, jwtPayload);
      const result = AdPresenter.toResponse(ad);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.res.locals.jwtPayload as ITokenPayload;
      const adId = req.params.adId;
      const dto = req.body as IAdsInterface;
      const ad = await adsService.update(payload, adId, dto);
      const result = AdPresenter.toResponse(ad);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.res.locals.jwtPayload as ITokenPayload;
      const adId = req.params.adId;
      await adsService.delete(payload, adId);
      res.status(200).json({
        message: "Ad deleted",
      });
    } catch (e) {
      next(e);
    }
  }

  public async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      let imageArray = [] as UploadedFile[];
      const images = req.files.images;
      if (!Array.isArray(images)) {
        imageArray.push(images);
      } else {
        imageArray = [...images];
      }

      const adId = req.params.adId as string;
      const ad = await adsService.uploadImages(adId, imageArray);
      const result = AdPresenter.toResponse(ad);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteImages(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const ad = await adsService.deleteImages(adId);
      const result = AdPresenter.toResponse(ad);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const adsController = new AdsController();
