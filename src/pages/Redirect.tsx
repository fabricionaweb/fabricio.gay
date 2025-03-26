import { Context } from 'hono'
import { getUrl } from '../database/database.ts'
import { fromShortId } from '../helpers.ts'

const entry = (ctx: Context) => {
  const { shortId } = ctx.req.param()
  const data = getUrl(fromShortId(shortId))
  return !data ? ctx.notFound() : ctx.redirect(data.url)
}

export default entry
