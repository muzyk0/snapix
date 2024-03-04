import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator'

export function MinAge(minAge: number, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'minAge',
      target: object.constructor,
      propertyName,
      constraints: [minAge],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const [minAge] = args.constraints
          if (!value) {
            return true
          }

          const age = calculateAge(value)
          return age >= minAge
        },
      },
    })
  }
}

function calculateAge(birthDate: Date): number {
  const today = new Date()
  const diff = today.getTime() - birthDate.getTime()
  const ageDate = new Date(diff)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
