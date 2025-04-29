import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import multer from 'multer';
@Injectable()
export class FilesService {
  s3: S3Client;
  configService = new ConfigService();

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
      region: this.configService.get('S3_REGION'),
    });
  }

  async uploadFile(file, folder?: string): Promise<string> {
    const { originalname, mimetype, buffer } = file;
    const fileName = folder ? `${folder}/${originalname}` : originalname;
    const params = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: String(fileName),
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.configService.get('S3_REGION'),
      },
    };

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: params.Bucket,
          Key: params.Key,
          Body: params.Body,
          ContentType: params.ContentType,
          ContentDisposition: params.ContentDisposition,
          ACL: 'public-read',
        })
      );

      return `https://${params.Bucket}.s3.${this.configService.get(
        'S3_REGION'
      )}.amazonaws.com/${params.Key}`;
    } catch (e) {
      Logger.error(e);
      throw new Error('Error uploading file to S3');
    }
  }
}
