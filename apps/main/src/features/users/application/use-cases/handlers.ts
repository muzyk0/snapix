import { UploadAvatarHandler } from './upload-avatar.handler'
import { DeleteAvatarHandler } from './delete-avatar.command'
import { UpdateProfileHandler } from './update-profile.handler'
import { GetProfileHandler } from './get-profile.handler'
import { GetAvatarQueryHandler } from './get-avatar.query.handler'

export const usersHandlers = [
  UploadAvatarHandler,
  DeleteAvatarHandler,
  UpdateProfileHandler,
  GetProfileHandler,
  GetAvatarQueryHandler,
]
