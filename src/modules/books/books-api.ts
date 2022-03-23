import createFetch from '../../utils/create-fetch'
import { BookListItem, BookWork } from './types'

class BooksApi {
  private api = createFetch('https://openlibrary.org')

  public searchByTitle(
    title: string,
    { aborter }: { aborter?: AbortController | null } = {},
  ) {
    return this.api.get<{
      start: number
      num_found: number
      docs: BookListItem[]
    }>(`/search.json?title=${title}`, { signal: aborter?.signal })
  }

  public getBookByKey(key: string) {
    return this.api.get<BookWork>(`/works/${key}.json`)
  }
}

export default new BooksApi()
