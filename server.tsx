import { Hono } from 'hono'
import { Style } from 'hono/css'
import { FC } from 'hono/jsx'
import { DatabaseSync } from 'node:sqlite'

/** DATABASE **/
const db = new DatabaseSync(Deno.env.get('DB_FILE') ?? ':memory:')

interface UrlSchema {
  id: number
  url: string
  createdAt: Date | string
}

// start db
db.exec(`
  CREATE TABLE IF NOT EXISTS wardrobe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

// methods
const addUrl = (origin: string) => {
  return db.prepare('INSERT INTO wardrobe (url) VALUES (?) RETURNING *').get(origin) as UrlSchema
}

const getUrlById = (id: UrlSchema['id']) => {
  return db.prepare('SELECT * FROM wardrobe WHERE id = ?').get(id) as UrlSchema
}

const getUrlByUrl = (url: UrlSchema['url']) => {
  return db.prepare('SELECT * FROM wardrobe WHERE url = ?').get(url) as UrlSchema
}

// helpers
const toShortId = (id: number) => id.toString(36)
const fromShortId = (id: string) => parseInt(id, 36)

/** HTML **/
const Layout: FC = ({ children }) => (
  <>
    {/* escape doctype under string to bypass jsx */}
    {'<!DOCTYPE html>'}
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👕</text></svg>'
        />
        <title>URL Shortener</title>
        <Style />
      </head>
      <body>{children}</body>
    </html>
  </>
)

/** APP **/
const app = new Hono({ strict: false })
// uncomment if needed
// app.use('/static/*', serveStatic({ root: './' }))

app.get('/:shortId{[0-9a-z]+}', (ctx) => {
  const { shortId } = ctx.req.param()
  const data = getUrlById(fromShortId(shortId))
  return !data ? ctx.notFound() : ctx.redirect(data.url)
})

app.get('/', (ctx) => {
  const { origin } = ctx.req.query()
  const BASE_URL = Deno.env.get('BASE_URL')
  const snippet =
    `javascript:(()=>{window.open('${BASE_URL}/?origin='+encodeURIComponent(window.location),'_blank')})()`

  if (origin) {
    const data = getUrlByUrl(origin) ?? addUrl(origin)
    return ctx.text(`${BASE_URL}/${toShortId(data.id)}`, 201)
  }

  return ctx.render(
    <Layout>
      <form action={BASE_URL}>
        <input type='url' name='origin' /> <button type='submit'>shorten</button> or <a href={snippet}>Bookmarklet</a>
      </form>
    </Layout>,
  )
})

// default to use with `deno serve`
export default app
