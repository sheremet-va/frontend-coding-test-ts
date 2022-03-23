import { render, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createMockApi } from 'vi-fetch'
import BooksList from '../BooksList.vue'

const mocker = createMockApi({
  baseUrl: 'https://openlibrary.org',
})

describe('page with a list of books and a search bar', () => {
  test('first render renders input and suggestion', async () => {
    const page = render(BooksList)

    expect(
      await page.findByText(
        /Search for a title of the book to see suggestions/,
      ),
    ).toBeDefined()
    expect(await page.findByPlaceholderText(/Type title/))
  })

  test('searching for books - found none', async () => {
    const page = render(BooksList)

    const mockApi = mocker.mockGet('/search.json?title=title').willResolve({
      docs: [],
    })

    const input = await page.findByPlaceholderText(/Type title/)
    await userEvent.type(input, 'title')

    expect(await page.findByText(/Nothing is found for "title"/)).toBeDefined()
    expect(mockApi).toHaveFetched()
  })

  test("don't call api if title is less then 3 words", async () => {
    const page = render(BooksList)

    const mockApi = mocker.mockGet('/search.json?title=t').willResolve({
      docs: [],
    })

    const input = await page.findByPlaceholderText(/Type title/)
    await userEvent.type(input, 't')

    expect(mockApi).not.toHaveFetched()
  })

  test('showing found books', async () => {
    const page = render(BooksList, {
      global: {
        components: {
          RouterLink: {
            props: ['to'],
            render() {
              return this.$slots.default()
            },
          },
        },
      },
    })

    const mockApi = mocker.mockGet('/search.json?title=Lord').willResolve({
      docs: [
        {
          title: 'The Lord of the Rings',
          key: '/work/1',
          author_name: ['J.R.R. Tolkien', 'Ian Holm'],
          first_publish_year: 1954,
          first_sentence: [
            "J. R. R. Tolkien's The Lord of The Rings is one of the most enchanting and successful tales of all time.",
          ],
        },
        {
          title: 'Novels (Hobbit / Lord of the Rings)',
          key: '/work/2',
          author_name: ['J.R.R. Tolkien'],
          first_publish_year: 1979,
        },
      ],
    })

    const input = await page.findByPlaceholderText(/Type title/)
    await userEvent.type(input, 'Lord')

    const [lordOfTheRings, hobbit] = await page.findAllByTestId('book')

    expect(mockApi).toHaveFetched()

    const lordWrapper = within(lordOfTheRings)
    const hobbitWrapper = within(hobbit)

    expect(
      lordWrapper.getByText(/most enchanting and successful tales/),
    ).toBeDefined()
    expect(lordWrapper.getByText('The Lord of the Rings')).toBeDefined()
    expect(hobbitWrapper.getByText(/Hobbit/)).toBeDefined()
  })
})
