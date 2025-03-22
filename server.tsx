import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

import { Home } from './src/pages/Home.tsx'

const app = new Hono({ strict: false })

app.use('/static/*', serveStatic({ root: './' }))
app.get('/', (ctx) => ctx.render(<Home />))

// default to use with `deno serve`
export default app
