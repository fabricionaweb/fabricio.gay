import { DatabaseSync } from 'node:sqlite'
import { migrations } from './migrations.ts'
import { UrlSchema } from './schema.ts'

export const db = new DatabaseSync(Deno.env.get('DB_FILE') ?? ':memory:')

// check current version
const { user_version } = db.prepare('PRAGMA user_version').get() as { user_version: number }

// run necessary migrations and update version
for (let i = user_version; i < migrations.length; i++) {
  db.exec(migrations[i])
  db.exec(`PRAGMA user_version = ${i + 1}`)
}

export const addUrl = (origin: string) => {
  return db.prepare('INSERT INTO wardrobe (url) VALUES (?) RETURNING *').get(origin) as UrlSchema
}

export const getUrl = (id: number) => {
  return db.prepare('SELECT url FROM wardrobe WHERE id = ?').get(id) as UrlSchema
}
