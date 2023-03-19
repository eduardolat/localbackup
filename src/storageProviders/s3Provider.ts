import path from 'node:path'
import AWS from 'aws-sdk'
import fse from 'fs-extra'
import mime from 'mime-types'
import { env } from '../env'
import { IStorageProvider } from './IStorageProvider'

export class S3StorageProvider implements IStorageProvider {
  static readonly providerName: string = 's3'

  private s3: AWS.S3 | undefined
  private readonly bucketName: string = String(env.S3_BUCKET)

  private getS3Client (): AWS.S3 {
    if (this.s3 === undefined) {
      const endpoint = env.S3_ENDPOINT !== undefined ? new AWS.Endpoint(env.S3_ENDPOINT) : undefined

      this.s3 = new AWS.S3({
        ...(endpoint !== undefined && { endpoint: endpoint as unknown as string }),
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY
      })
    }

    return this.s3
  }

  private removeFirstSlash (path: string): string {
    return path.startsWith('/') ? path.slice(1) : path
  }

  async isAvailable (): Promise<boolean> {
    const hasS3Config = env.S3_BUCKET !== undefined &&
                        env.S3_ACCESS_KEY !== undefined &&
                        env.S3_SECRET_KEY !== undefined
    return hasS3Config
  }

  async uploadFile (localFilePath: string, destinationFilePath: string): Promise<void> {
    const s3Client = this.getS3Client()
    const file = fse.readFileSync(localFilePath)
    const mimeType = mime.lookup(path.extname(destinationFilePath))

    const parameters = {
      Bucket: this.bucketName,
      Key: this.removeFirstSlash(destinationFilePath),
      Body: file,
      ACL: 'public-read',
      ...(mimeType !== false && { ContentType: mimeType })
    }

    await s3Client.upload(parameters).promise()
  }

  async deleteFile (fileFullPath: string): Promise<void> {
    const s3Client = this.getS3Client()

    const deleteParams: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: this.removeFirstSlash(fileFullPath)
    }

    await s3Client.deleteObject(deleteParams).promise()
  }

  async listFiles (directoryPath: string): Promise<string[]> {
    const s3Client = this.getS3Client()

    const listParams: AWS.S3.ListObjectsV2Request = {
      Bucket: this.bucketName,
      Prefix: this.removeFirstSlash(directoryPath)
    }
    const objects = await s3Client.listObjectsV2(listParams).promise()

    const files = (objects?.Contents ?? [])?.map(content => String(content.Key))
    return files ?? []
  }
}

export const s3StorageProvider = new S3StorageProvider()
