import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

import { configs } from "../configs/configs";

class S3Service {
  constructor(
    private readonly s3Client = new S3Client({
      forcePathStyle: true,
      region: configs.AWS_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: configs.AWS_ENDPOINT_URL,
    }),
  ) {}
  public async uploadFiles(
    itemType: "carImages",
    itemId: string,
    file: UploadedFile,
  ): Promise<string> {
    const path = `${itemType}/${itemId}/${file.name}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_BUCKET_NAME,
        Key: path,
        Body: file.data,
        ACL: configs.AWS_S3_ACL,
        ContentType: file.mimetype,
      }),
    );
    return path;
  }

  public async deleteFile(pathToFile: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_BUCKET_NAME,
        Key: pathToFile,
      }),
    );
  }
}

export const s3Service = new S3Service();
