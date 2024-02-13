import { type PrismaService } from '@app/prisma'

export const clearDbBeforeTest = async (prisma: PrismaService) => {
  await prisma.passwordHistory.deleteMany()
  await prisma.passwordRecovery.deleteMany()
  await prisma.session.deleteMany()
  await prisma.revokedToken.deleteMany()
  await prisma.post.deleteMany()
  await prisma.confirmations.deleteMany()
  await prisma.user.deleteMany()
}
