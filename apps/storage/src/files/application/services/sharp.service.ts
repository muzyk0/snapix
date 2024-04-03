import { Injectable } from '@nestjs/common'
import { type UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import sharp from 'sharp'
import mime from 'mime-types'
import { isNil } from 'lodash'

interface SharpImageType {
  file: Buffer
  width: number
  height: number
  size: number
  format: string
  mimetype: string
}

@Injectable()
export class SharpService {
  /**
   * Processes an image file with sharp library and generates multiple resolutions if specified.
   * @param {Object} params - The parameters for the function.
   * @param {Object} params.file - The image file to process.
   * @param {Array} params.resolutions - The desired resolutions for the image.
   * @returns {Promise<Array>} - A promise that resolves to an array of objects containing the processed image file, width, height, and size.
   */
  public async sharpImage({
    buffer,
    resolutions,
  }: { buffer: Buffer } & Pick<UploadImageDto, 'resolutions'>): Promise<SharpImageType[]> {
    if (isNil(resolutions) || resolutions.length === 0) return []

    // If resolutions are specified, generate multiple resolutions and return the metadata for each one
    return await Promise.all(
      resolutions?.map(async resolution =>
        this.processImage(buffer, {
          width: resolution.width,
          height: resolution.height,
        })
      )
    )
  }

  private async processImage(
    file: Buffer,
    { width, height }: { width?: number; height?: number }
  ): Promise<SharpImageType> {
    const formattedFile = await sharp(file)
      .resize({
        width,
        height,
      })
      .webp()
      .toBuffer()

    const {
      width: processedWidth,
      height: processedHeight,
      size: processedSize,
      mimetype: processedMimetype,
      format: processedFormat,
    } = await this.getFileMetadata(formattedFile)

    return {
      file: formattedFile,
      width: processedWidth,
      height: processedHeight,
      size: processedSize,
      format: processedFormat,
      mimetype: processedMimetype,
    }
  }

  public async getFileMetadata(file: Buffer) {
    const {
      width: processedWidth,
      height: processedHeight,
      size: processedSize,
      format: processedFormat,
    } = await sharp(file).metadata()

    const mimetype = mime.lookup(processedFormat ?? '')

    return {
      width: processedWidth ?? 0,
      height: processedHeight ?? 0,
      size: processedSize ?? 0,
      format: (processedFormat as string | undefined) ?? '',
      mimetype: mimetype || '',
    }
  }
}
