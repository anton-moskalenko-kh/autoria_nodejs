import { NextFunction, Request, Response } from "express";

import { IAdsInterface } from "../interfaces/ads.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { adsService } from "../services/ads.service";

class AdsController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adsService.getAll();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const result = await adsService.getById(adId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      const result = await adsService.getContacts(adId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getUserAds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await adsService.getUserAds(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getInactiveAds(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adsService.getInactiveAds();
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
      const result = await adsService.create(dto, jwtPayload);
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
      const result = await adsService.update(payload, adId, dto);
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
        message: "Ads deleted",
      });
    } catch (e) {
      next(e);
    }
  }
}

export const adsController = new AdsController();
