import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { html } from 'hono/html'
import { FC } from 'hono/jsx'
import { DatabaseSync } from 'node:sqlite'

/** DATABASE **/
const db = new DatabaseSync(process.env.DB_FILE ?? ':memory:')

interface UrlSchema {
  id: number
  url: string
  createdAt: Date | string
}

// start db
db.exec(`
  CREATE TABLE IF NOT EXISTS wardrobe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
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
    {/* escape jsx doctype */}
    {html`<!DOCTYPE html>`}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏳️‍🌈</text></svg>"
        />
        <title>URL Shortener</title>
        <Style>
          {css`
            html {
              height: 100%;
              font: 14px/1.5 system-ui;
            }

            body {
              min-height: 100%;
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            * {
              box-sizing: border-box;
              font-size: 1em;
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  </>
)

/** APP **/
const app = new Hono({ strict: false })

app.get('/:shortId{[0-9a-z]+}', (ctx) => {
  const { shortId } = ctx.req.param()
  const data = getUrlById(fromShortId(shortId))
  return !data ? ctx.notFound() : ctx.redirect(data.url)
})

app.get('/', (ctx) => {
  const { origin } = ctx.req.query()
  const BASE_URL = process.env.BASE_URL
  const snippet = `javascript:(()=>{window.open('${BASE_URL}/?origin='+encodeURIComponent(window.location),'_blank')})()`

  if (origin) {
    const data = getUrlByUrl(origin) ?? addUrl(origin)
    return ctx.text(`${BASE_URL}/${toShortId(data.id)}`, 201)
  }

  const headingCss = css`
    font-size: 10em;
    margin: 20dvh 0 0;
    user-select: none;
  `
  const formCss = css`
    display: flex;
    width: 100%;
    padding: 0 1.5em;
    margin: 2.5em 0;
    max-width: 32em;

    input,
    button {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.5em;
    }

    input {
      width: 100%;
    }

    button {
      cursor: pointer;
      margin-left: -1px;
      white-space: nowrap;
    }
  `

  return ctx.render(
    <Layout>
      <h1 class={headingCss}>🏳️‍🌈</h1>
      <form class={formCss} action="/">
        <input type="url" name="origin" placeholder="https://..." />
        <button type="submit">👉👈</button>
      </form>
      <footer>
        or drag the <a href={snippet}>bookmarklet</a>
      </footer>
    </Layout>
  )
})

serve({ port: 8000, fetch: app.fetch })
