<template>
  <div class="justify-center w-4/5 md:w-1/2 mt-10">
    <h1 class="font-extrabold tracking-tigh text-3xl leading-10">
      Find A Book
    </h1>

    <div class="flex relative mt-4">
      <input
        v-model="search"
        class="p-2 rounded w-full"
        placeholder="Type title of a book..."
      />
      <icon-spinner
        v-if="loading"
        class="animate-spin absolute right-0 mt-1.5 mr-1.5 w-6 h-6 opacity-50"
      />
    </div>

    <div class="mt-8 mb-8">
      <div v-if="!books.length">
        Search for a title of the book to see suggestions!
      </div>

      <div v-if="state === LoadState.Empty">
        Nothing is found for "{{ search }}". Try another one!
      </div>

      <article class="flex flex-col gap-4">
        <book-item
          v-for="book in books"
          v-bind:key="book.key"
          v-bind:book="book"
        />
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import BookItem from '../components/BookItem.vue'
// this is what icons I use in my projects
// I'm not familiar how to disable import/extensions only for ~icons
// documentation is of no use :)
// I also see a lot of the eslint ruls do the extra work
// that typescript is already doing. namely `import/` rules seem not neccessary
// eslint-disable-next-line import/extensions
import IconSpinner from '~icons/gg/spinner'
import useLoadBooks, { LoadState } from '../composition/use-load-books'

const search = ref('')

const { loadBooks, loading, books, state } = useLoadBooks()

watchDebounced(search, loadBooks, { debounce: 500 })
</script>
