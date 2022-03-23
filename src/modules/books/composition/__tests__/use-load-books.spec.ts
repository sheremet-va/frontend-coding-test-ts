import { createMockApi } from 'vi-fetch'
import { BookListItem } from '../../types'
import useLoadBooks, { LoadState } from '../use-load-books'

const mocker = createMockApi({
  baseUrl: 'https://openlibrary.org',
})

describe('behaviour of use-load-books', () => {
  let mockApi: ReturnType<typeof mocker['mockGet']>

  beforeEach(() => {
    mockApi = mocker.mockGet('/search.json', false).willResolve({ docs: [] })
  })

  test("doesn't call api when less then 3 characters", async () => {
    const { loadBooks } = useLoadBooks()

    await loadBooks('he')

    expect(mockApi).not.toFetch()
  })

  test('clears books with no title', async () => {
    const { loadBooks, books } = useLoadBooks()

    books.value = [{ title: 'title' } as BookListItem]

    await loadBooks('')

    expect(books.value).toEqual([])
    expect(mockApi).not.toFetch()
  })

  test('aborts request when another is initiated', async () => {
    let aborted = false

    globalThis.AbortController = class {
      signal = {} as AbortSignal

      // eslint-disable-next-line class-methods-use-this
      abort() {
        aborted = true
      }
    }

    const { loadBooks } = useLoadBooks()

    loadBooks('hello world')
    loadBooks('another book')

    expect(aborted).toBe(true)
    expect(mockApi).toFetchTimes(2)
  })

  test('loading is true, when fetching starts', async () => {
    const { loadBooks, loading } = useLoadBooks()

    const promise = loadBooks('hello world')

    expect(loading.value).toBe(true)
    await promise
    expect(loading.value).toBe(false)
  })

  test('state is empty when no books are returned', async () => {
    const { loadBooks, state } = useLoadBooks()

    await loadBooks('hello world')

    expect(state.value).toBe(LoadState.Empty)
  })
})

describe('api call failes', () => {
  let mockApi: ReturnType<typeof mocker['mockGet']>

  beforeEach(() => {
    mockApi = mocker.mockGet('/search.json', false)
  })

  test('loading is reseted if error occures', async () => {
    mockApi.clear()
    mockApi.willThrow('No internet')

    const { loadBooks, loading } = useLoadBooks()

    const promise = loadBooks('hello world')
    expect(loading.value).toBe(true)
    await promise
    expect(loading.value).toBe(false)
  })

  test('loading is not reseted if api call is aborted', async () => {
    mockApi.clear()
    mockApi.willThrow('The user aborted a request.')

    const { loadBooks, loading } = useLoadBooks()

    const promise = loadBooks('hello world')
    expect(loading.value).toBe(true)
    await promise
    expect(loading.value).toBe(true)
  })
})
