import { Style } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

type LayoutProps = {
  title: string
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({ title, children }) => (
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
        <title>{title}</title>
        <Style />
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
)
