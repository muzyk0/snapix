// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process')

const migrationName = process.argv[2]
if (!migrationName) throw new Error('🚨 Укажите имя для миграции')

const command = `npx prisma migrate dev --name ${migrationName}`
execSync(command, { stdio: 'inherit' })
