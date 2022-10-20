import * as dotenv from 'dotenv';

dotenv.config()
dotenv.config({ path: '/var/secrets-store/.env', override: true });

export const MONGODB_DSN = process.env.MONGODB_DSN || '';

export const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

export const SUPERCELL_API_BASE_URL = process.env.SUPERCELL_API_BASE_URL;
export const SUPERCELL_API_TOKEN = process.env.SUPERCELL_API_TOKEN;

export const BRAWLAPI_API_BASE_URL = process.env.BRAWLAPI_API_BASE_URL;
