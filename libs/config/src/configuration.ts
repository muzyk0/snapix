const getConfiguration = () => ({
  PORT: process.env.PORT ?? 3000,
  BASE_PREFIX: process.env.GLOBAL_PREFIX ?? '',
  IS_DEV: process.env.NODE_ENV === 'development',
  APP_VERSION: process.env.npm_package_version,
})
export default getConfiguration

export type ConfigurationType = ReturnType<typeof getConfiguration>
