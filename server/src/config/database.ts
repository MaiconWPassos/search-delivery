import 'dotenv/config';
import { resolve } from 'path';

export default {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    filename: resolve(__dirname, '..', 'database', 'database.sqlite'),
  },
  useNullAsDefault: true,
};
