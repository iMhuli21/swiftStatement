import { config } from 'dotenv';
import postgres from 'postgres';
import * as schema from '@/lib/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';

config({ path: '.env.local' });

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle({ client, schema });
