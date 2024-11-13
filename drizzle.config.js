import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  //   schema: './configs/schema.js',
  schema: './app/configs/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:A7WkfclMV5tH@ep-small-firefly-a1s0d3rk.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
});
