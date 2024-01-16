import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class CreateUserDto {
  @Length(6, 30)
  @IsNotEmpty()
  username!: string

  @IsEmail()
  @IsNotEmpty()
  email!: string

  @Length(6, 20)
  password!: string
}
