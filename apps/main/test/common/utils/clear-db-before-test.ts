import { type PrismaService } from '@app/prisma'

export const clearDbBeforeTest = async (prisma: PrismaService) => {
  await prisma.passwordRecovery.deleteMany()
  await prisma.user.deleteMany()
  await prisma.confirmations.deleteMany()
}
