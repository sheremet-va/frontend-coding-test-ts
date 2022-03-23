<template>
  <transition name="slide-in" mode="out-in">
    <div v-if="message.length > 0" class="container">
      <div class="popup">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'

const HIDE_DELAY = 2000

const message = ref('')
const timer = ref(0)

function show(msg: string, delay = HIDE_DELAY) {
  message.value = msg

  clearTimeout(timer.value)

  timer.value = window.setTimeout(() => {
    message.value = ''
  }, delay)
}

const showEventToast = (e: Event) => {
  const event = e as CustomEvent
  const { message, delay } = event.detail

  show(message, delay)
}

useEventListener(window, 'showtoast', showEventToast)
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  justify-content: center;
  align-items: center;

  position: fixed;

  bottom: 15vh;
  right: 16px;
  left: 16px;

  z-index: 5;

  pointer-events: none;
  touch-action: none;

  line-break: strict;

  .popup {
    background-color: hsla(0, 0%, 0%, 0.6);
    color: hsl(0, 0%, 100%);

    padding: 10px 12px;

    border-radius: 8px;
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: 0.3s ease;
}

.slide-in-enter {
  opacity: 0;
}

.slide-in-enter-to {
  opacity: 1;
}

.slide-in-leave-to {
  opacity: 0;

  transform: translateY(3vh);
}
</style>
