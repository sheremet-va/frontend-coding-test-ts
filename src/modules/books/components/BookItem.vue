<template>
  <section
    class="flex flex-col text-left bg-white rounded p-4"
    data-testid="book"
  >
    <div class="flex justify-between">
      <router-link v-bind:to="`/books/${getWorkKey(book)}`">
        <h2 class="font-bold cursor-pointer">{{ book.title }}</h2>
      </router-link>
      <div v-if="book.first_publish_year" class="whitespace-nowrap">
        {{ book.first_publish_year }} year
      </div>
    </div>
    <div v-if="book.author_name" class="text-slate-400">
      Author(s): {{ book.author_name.join(', ') }}
    </div>

    <blockquote
      v-if="book.first_sentence"
      class="relative mt-2 p-2 italic border-l-4 text-neutral-600 border-neutral-500 quote bg-neutral-50"
    >
      <p>{{ book.first_sentence[0] }}...</p>
    </blockquote>
  </section>
</template>

<script setup lang="ts">
import type { BookListItem } from '../types'

defineProps<{ book: BookListItem }>()

const getWorkKey = (book: BookListItem) => {
  return book.key.match(/[\w\s]+$/i)?.[0]
}
</script>
