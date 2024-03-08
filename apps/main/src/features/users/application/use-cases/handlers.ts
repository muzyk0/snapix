import { UploadAvatarHandler } from './upload-avatar.handler'
import { DeleteAvatarHandler } from './delete-avatar.command'
import { FillOutProfileHandler } from './fill-out-profile.handler'
import { GetProfileInfoHandler } from './get-profile-info.handler'

export const usersHandlers = [
  UploadAvatarHandler,
  DeleteAvatarHandler,
  FillOutProfileHandler,
  GetProfileInfoHandler,
]
