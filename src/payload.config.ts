import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Colors } from './collections/Colors'
import { Brands } from './collections/Brands'
import { ContactRequests } from './collections/ContactRequests'
import { sql } from '@payloadcms/db-postgres'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Orders, Colors, Brands, ContactRequests],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    "http://ostriv-backend-pss7wq-99f886-46-175-148-52.traefik.me",
    "http://ostriv-frontend-4aiii8-af8fcc-46-175-148-52.traefik.me",
    "https://admin.ostrowtor.net",
    "https://ostrowtor.net",
  ],
  csrf: [
    "http://ostriv-backend-pss7wq-99f886-46-175-148-52.traefik.me",
    "http://ostriv-frontend-4aiii8-af8fcc-46-175-148-52.traefik.me",
    "https://admin.ostrowtor.net",
    "https://ostrowtor.net",
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  onInit: async (payload) => {
    try {
      await payload.db.drizzle?.execute(
        sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "contact_requests_id" integer;`,
      );
    } catch (error) {
      payload.logger.error({ msg: 'Failed to ensure contact_requests lock column', err: error });
    }

    try {
      await payload.db.drizzle?.execute(sql`
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
      `);
      await payload.db.drizzle?.execute(sql`
        CREATE INDEX IF NOT EXISTS "products_characteristics_order_idx"
          ON "products_characteristics" ("_order");
      `);
      await payload.db.drizzle?.execute(sql`
        CREATE INDEX IF NOT EXISTS "products_characteristics_parent_idx"
          ON "products_characteristics" ("_parent_id");
      `);
    } catch (error) {
      payload.logger.error({ msg: 'Failed to ensure products_characteristics table', err: error });
    }

    try {
      await payload.db.drizzle?.execute(
        sql`ALTER TABLE IF EXISTS "products" ADD COLUMN IF NOT EXISTS "article" varchar;`,
      );
    } catch (error) {
      payload.logger.error({ msg: 'Failed to ensure products.article column', err: error });
    }
  },
  sharp,
  plugins: [],
})
