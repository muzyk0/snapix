export interface CorrectUser {
  username: string
  email: string
  password: string
  userFirstName: string
  userLastName: string
  birthDate: string
  city: string
  aboutMe: string
}

// correct input values
export const correctUser: CorrectUser = {
  username: 'newUser1',
  email: 'newUser1@example.com',
  password: 'password0aA!=',
  userFirstName: 'Abraham',
  userLastName: 'Lincoln',
  birthDate: '12.02.1809',
  city: 'Kentucky',
  aboutMe: 'Abraham Lincoln was the President of the United States',
}

// incorrect input values (inc)
export const incorrectUser = {
  username: 'Abrah',
  firstName: '1234',
  lastName: 'Lin_Coln',
  birthDate: '111',
  city: true,
  aboutMe:
    'Okey, this text more then 200 symbols:' +
    'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.' +
    'Amazingly few discotheques provide jukeboxes. Frequently astounding zebra playing jazz.',
}
