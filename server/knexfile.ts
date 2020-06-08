import { resolve } from 'path';
import databaseConfig from './src/config/database';

module.exports = {
  ...databaseConfig,
  migrations: {
    directory: resolve(__dirname, 'src', 'database', 'migrations'),
  },

  seeds: {
    directory: resolve(__dirname, 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
};
