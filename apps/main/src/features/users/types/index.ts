import { Prisma } from '@prisma/client'

const userWithConfirmation = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { emailConfirmation: true },
})

export type UserWithConfirmation = Prisma.UserGetPayload<typeof userWithConfirmation>
