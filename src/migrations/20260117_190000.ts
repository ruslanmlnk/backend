import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_characteristics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL,
      CONSTRAINT "products_characteristics_parent_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "products"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    );
  `)

  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "products_characteristics_order_idx"
      ON "products_characteristics" ("_order");
  `)

  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "products_characteristics_parent_idx"
      ON "products_characteristics" ("_parent_id");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "products_characteristics";
  `)
}
