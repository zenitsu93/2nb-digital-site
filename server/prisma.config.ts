import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  adapter: async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    return new PrismaPg({ connectionString });
  },
});
