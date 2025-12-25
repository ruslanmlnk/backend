import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "meta_meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_meta_description" varchar;
  `)
}

	export async function down({ payload }: MigrateDownArgs): Promise<void> {
	await payload.db.drizzle.execute(sql`
		ALTER TABLE "products"
		DROP COLUMN IF EXISTS "meta_meta_title",
		DROP COLUMN IF EXISTS "meta_meta_description";
	`)
	}
