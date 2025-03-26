import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

import home from './src/pages/Home.tsx'
import redirect from './src/pages/Redirect.tsx'

const app = new Hono({ strict: false })

app.use('/static/*', serveStatic({ root: './' }))
app.get('/:shortId{[0-9a-z]+}', redirect)
  .get('/', home)

// default to use with `deno serve`
export default app
