import { resolve } from 'path';
import { config } from 'dotenv';
config({
  path: resolve(
    process.cwd(),
    process.env.BUILD_ENV == 'prod' ? '.env.prod' : '.env',
  ),
});

export const serviceport = Number.parseInt(process.env.PORT);
export const jwt = {
  secret: process.env.JWT_SECRET,
  expirein: 1800,
};
export const jwtrefresh = {
  secret: process.env.JWT_SECRET_REFRESH,
  expirein: 60 * 60 * 24 * 30,
};
export const db = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};
