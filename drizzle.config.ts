import type { Config } from 'drizzle-kit';
export default {
	schema: './database/schemas/**/*.ts',
	out: './drizzle/migrations',
    driver: 'expo',
    dialect: 'sqlite',
} satisfies Config;