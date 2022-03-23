import { ref } from 'vue'
import { BookListItem } from '../types'
import booksApi from '../books-api'
import useToast from '../../../composition/use-toast'

export enum LoadState {
  Found,
  Empty,
}

const createAborter = () => {
  if (typeof AbortController !== 'undefined') return new AbortController()
  return null
}

const abortedError = 'The user aborted a request.'

// books are shared, so "going back" draws previous books
const books = ref<BookListItem[]>([])

export default function useLoadBooks() {
  const loading = ref(false)

  let aborter: null | AbortController = null

  const state = ref<LoadState>()

  const loadBooks = async (title: string) => {
    if (!title.length) {
      books.value = []
      return
    }
    if (title.length < 3) {
      return
    }
    // if we don't abort it, previous request
    // might override current one
    if (loading.value && aborter) {
      aborter.abort()
    }
    loading.value = true
    try {
      aborter = createAborter()
      const { docs } = await booksApi.searchByTitle(title, { aborter })
      books.value = docs
      loading.value = false
      if (!docs.length) {
        state.value = LoadState.Empty
      } else {
        state.value = LoadState.Found
      }
    } catch (err) {
      if (err instanceof Error && err.message !== abortedError) {
        loading.value = false
        useToast('Could not fetch books')
      }
    }
  }

  return {
    loadBooks,
    loading,
    books,
    state,
  }
}
