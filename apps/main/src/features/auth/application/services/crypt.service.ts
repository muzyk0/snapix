import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class CryptService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async comparePassword(password: string, userPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, userPassword)
    } catch {
      return false
    }
  }
}
