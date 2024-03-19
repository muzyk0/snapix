import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { type StorageTempFiles } from '@prisma/client'

@Injectable()
export class StorageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getExpiresAtFiles(): Promise<StorageTempFiles[]> {
    return this.prisma.storageTempFiles.findMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    })
  }

  async createTempFile({
    referenceId,
    expiresAt,
  }: {
    referenceId: string
    expiresAt: Date
  }): Promise<StorageTempFiles> {
    return this.prisma.storageTempFiles.create({
      data: {
        referenceId,
        expiresAt,
      },
    })
  }

  async deleteTempFiles(referenceIds: string[]): Promise<void> {
    await this.prisma.storageTempFiles.deleteMany({
      where: {
        referenceId: {
          in: referenceIds,
        },
      },
    })
  }
}
