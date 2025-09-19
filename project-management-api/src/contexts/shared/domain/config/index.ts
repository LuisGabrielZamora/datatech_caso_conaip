import * as process from 'process';

export default () => ({
  environment: process.env.ENVIRONMENT,
  port: parseInt(process.env.APP_PORT || '3000', 10),
  token: {
    expiresIn: process.env.EXPIRES_IN || '90d',
    secret: process.env.SECRET_PRIVATE_KEY,
  },
  timezone: parseInt(process.env.CONTAINER_TZ || 'America/Mexico_City', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
});
