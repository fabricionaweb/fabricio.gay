import { html } from 'hono/html'
import type { FC } from 'hono/jsx'

const Layout: FC = ({ children }) =>
  html`<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Document</title>
  </head>
  <body>
    ${children}
  </body>
</html>`

export const Home = () => (
  <Layout>
    Hello Word
  </Layout>
)
