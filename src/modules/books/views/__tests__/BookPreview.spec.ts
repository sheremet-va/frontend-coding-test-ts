import { render } from '@testing-library/vue'
import { createMockApi } from 'vi-fetch'
import BookPreview from '../BookPreview.vue'
import { FetchError } from '../../../../utils/create-fetch'

const mocker = createMockApi({
  baseUrl: 'https://openlibrary.org',
})

const BOOK_KEY = 'key'
const mockBook = () => {
  const mockApi = mocker.mockGet(`/works/${BOOK_KEY}.json`)
  mockApi.clear()
  return mockApi
}

describe('easter egg', () => {
  test('has a cat if not much information is given', async () => {
    mockBook().willResolve({ title: 'title encoded' })

    const page = render(BookPreview, {
      props: { bookKey: BOOK_KEY },
    })
    const titleEncoded = encodeURI('title encoded')
    const img = await page.findByTestId('cat-egg')

    expect(img.getAttribute('src')).toBe(
      `https://cataas.com/cat/says/${titleEncoded}`,
    )
  })

  test('cat error message', async () => {
    mockBook().willThrow(new FetchError({ status: 404 } as Response))

    const page = render(BookPreview, {
      props: { bookKey: BOOK_KEY },
    })
    const img = await page.findByTestId('cat-error')

    expect(img.getAttribute('src')).toBe(`https://http.cat/404`)
  })
})

describe('rendering book', () => {
  test('rendering full book', async () => {
    mockBook().willResolve({
      title: 'book title',
      description: 'book description',
      links: [
        { title: 'link 1', url: 'https://link1.com' },
        { title: 'link 2', url: 'https://link2.com' },
      ],
      covers: [1, 2, -1],
    })

    const page = render(BookPreview, {
      props: { bookKey: BOOK_KEY },
    })

    expect(await page.findByText('book title')).toBeDefined()
    expect(await page.findByText('book description')).toBeDefined()

    const link1 = await page.findByText('link 1')
    expect(link1).toBeDefined()
    expect(link1.getAttribute('href')).toBe('https://link1.com')
    const link2 = await page.findByText('link 2')
    expect(link2).toBeDefined()
    expect(link2.getAttribute('href')).toBe('https://link2.com')

    const covers = await page.findAllByTestId(/^cover-/)

    expect(covers).toHaveLength(2)
    expect(covers[0].getAttribute('src')).toBe(
      'https://covers.openlibrary.org/b/id/1-M.jpg',
    )
    expect(covers[1].getAttribute('src')).toBe(
      'https://covers.openlibrary.org/b/id/2-M.jpg',
    )
  })
})
