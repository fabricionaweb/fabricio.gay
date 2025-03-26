export const BASE_URL = Deno.env.get('BASE_URL')

export const toShortId = (id: number) => id.toString(36)
export const fromShortId = (id: string) => parseInt(id, 36)
