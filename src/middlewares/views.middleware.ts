import { NextFunction, Request, Response } from "express";

import { viewRepository } from "../repositories/view.repository";

class ViewsMiddleware {
  public async createView(req: Request, res: Response, next: NextFunction) {
    try {
      const adId = req.params.adId;
      await viewRepository.create(adId);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const viewsMiddleware = new ViewsMiddleware();
