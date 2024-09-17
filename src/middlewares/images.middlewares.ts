import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api-error";

class ImagesMiddlewares {
  public isImageValid(
    paramName: string,
    configs: { MAX_SIZE: number; MIMETYPES: string[] },
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const images = req.files?.[paramName] as UploadedFile[];
        if (!images) {
          throw new ApiError("File is not found", 400);
        }
        if (Array.isArray(images)) {
          images.forEach((image) => {
            if (image.size > configs.MAX_SIZE) {
              throw new ApiError("File is too big", 400);
            }
            if (!configs.MIMETYPES.includes(image.mimetype)) {
              throw new ApiError("Invalid file type", 400);
            }
          });
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const imagesMiddleware = new ImagesMiddlewares();
