import { Environment } from './interfaces/environment.interface';

// The file contents for the current environment will overwrite these during build.

export const environment: Environment = {
  production: false,
  API_HOST: 'https://appdevelop.virtamed.cloud',
  version: '1.00.0-0-develop',
};
