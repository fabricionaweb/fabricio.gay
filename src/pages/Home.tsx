import { Context } from 'hono'
import { addUrl } from '../database/database.ts'
import { BASE_URL, toShortId } from '../helpers.ts'

const Home = () => {
  const snippet =
    `javascript:(()=>{window.open('${BASE_URL}/?origin='+encodeURIComponent(window.location),'_blank')})()`

  return (
    <form action={BASE_URL}>
      <input type='url' name='origin' /> <button type='submit'>shorten</button> or <a href={snippet}>Bookmarklet</a>
    </form>
  )
}

const entry = (ctx: Context) => {
  const { origin } = ctx.req.query()
  if (origin) {
    const data = addUrl(origin)
    return ctx.text(`${BASE_URL}/${toShortId(data.id)}`)
  }

  return ctx.render(<Home />)
}

export default entry
