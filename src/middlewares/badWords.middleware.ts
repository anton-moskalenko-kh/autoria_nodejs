import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { badWordsList } from "../helpers/bad.words";
import { IAdsInterface } from "../interfaces/ads.interface";

class BadWordsMiddleWare {
  static editAttempts = 0;

  public isValidDescription(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as IAdsInterface;
    try {
      for (const word of badWordsList) {
        if (dto.description.toLowerCase().includes(word)) {
          BadWordsMiddleWare.editAttempts++;
          if (BadWordsMiddleWare.editAttempts >= 3) {
            dto.isActive = false;
            BadWordsMiddleWare.editAttempts = 0;
            break;
          }
          throw new ApiError(
            "The ad contains obscene language. Try again",
            400,
          );
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const badWordsMiddleWare = new BadWordsMiddleWare();
