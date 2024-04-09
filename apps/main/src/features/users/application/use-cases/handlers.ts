import { UploadAvatarHandler } from './upload-avatar.handler'
import { DeleteAvatarHandler } from './delete-avatar.command'
import { UpdateProfileHandler } from './update-profile.handler'
import { GetMyProfileHandler } from './get-my-profile.handler'
import { GetAvatarQueryHandler } from './get-avatar.query.handler'

export const usersHandlers = [
  UploadAvatarHandler,
  DeleteAvatarHandler,
  UpdateProfileHandler,
  GetMyProfileHandler,
  GetAvatarQueryHandler,
]
