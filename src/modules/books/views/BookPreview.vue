<template>
  <!-- some kind of placeholder would be better for UX -->
  <!--
    on our site we use beforeRouteEnter to load data before rendering
    and we have progressbar while it loads, which is fine for most cases,
    but it we need to load something additional, we can start loading it
    while rendering first part
  -->
  <div v-if="error" class="mt-10">
    <h1 class="text-3xl leading-10 font-extrabold text-red-500">Error!</h1>
    <img
      v-if="'response' in error"
      v-bind:src="`https://http.cat/${error.response.status}`"
      data-testid="cat-error"
    />
    <div v-else class="text-base p-4">{{ error.message }}</div>
  </div>
  <div
    v-else-if="!book"
    class="flex items-center gap-2 font-bold mt-10 text-2xl"
  >
    <icon-spinner class="animate-spin" /> Loading...
  </div>
  <article v-else class="justify-center w-4/5 md:w-1/2 mt-10 mb-10">
    <h1 class="font-extrabold tracking-tigh text-3xl leading-10">
      {{ book.title }}
    </h1>

    <div v-if="book.covers" class="flex items-center gap-4 overflow-auto mt-4">
      <template v-for="(cover, index) in getImages('M')" v-bind:key="cover">
        <img
          class="cursor-pointer"
          v-bind:src="cover"
          loading="lazy"
          v-bind:data-testid="`cover-${index}`"
          v-on:click="showImage(index)"
        />
      </template>
    </div>
    <blockquote
      v-if="book.description"
      class="description text-left text-base border-l-4 pl-4 border-zinc-600 mt-4"
    >
      <vue-markdown
        v-bind:source="
          typeof book.description !== 'object'
            ? book.description
            : book.description.value
        "
      />
    </blockquote>

    <template v-if="book.links">
      <h2 class="font-extrabold tracking-tigh text-xl leading-4 mt-10 mb-6">
        Links
      </h2>
      <ul>
        <li v-for="(link, i) in book.links" v-bind:key="i">
          <a class="underline text-sky-500" v-bind:href="link.url">
            {{ link.title }}
          </a>
        </li>
      </ul>
    </template>

    <div
      v-if="!book.covers && !book.description && !book.links"
      class="flex flex-col mt-6"
    >
      <div>
        There is not much known about this book... Here is a cat instead:
      </div>

      <img
        class="mt-2"
        data-testid="cat-egg"
        v-bind:src="`https://cataas.com/cat/says/${encodeURI(book.title)}`"
      />
    </div>
  </article>

  <vue-easy-lightbox
    v-bind:imgs="getImages('L')"
    v-bind:visible="imagesPreview.visible"
    v-bind:index="imagesPreview.index"
    v-on:hide="imagesPreview.visible = false"
  />
</template>

<script setup lang="ts">
import { shallowRef, onBeforeMount, reactive } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import VueEasyLightbox from 'vue-easy-lightbox'
// eslint-disable-next-line import/extensions
import IconSpinner from '~icons/gg/spinner'
import booksApi from '../books-api'
import { BookWork } from '../types'
import { FetchError } from '../../../utils/create-fetch'

const props = defineProps<{
  bookKey: string
}>()

// can also use some kind of useFetch
// but it's difficult to befriend with types
const book = shallowRef<BookWork>()
const error = shallowRef<FetchError | Error>()

onBeforeMount(async () => {
  try {
    error.value = undefined
    book.value = await booksApi.getBookByKey(props.bookKey)
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    }
  }
})

const getImages = (size: string) => {
  if (!book.value?.covers) return []

  return book.value.covers
    .filter((c) => c > 0)
    .map((c) => `https://covers.openlibrary.org/b/id/${c}-${size}.jpg`)
}

const imagesPreview = reactive({
  visible: false,
  index: -1,
})

const showImage = (index: number) => {
  imagesPreview.visible = true
  imagesPreview.index = index
}
</script>

<style scoped lang="scss">
.description {
  ::v-deep(a) {
    @apply underline text-sky-500;
  }
}
</style>
