<template>
  <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
    <div class="px-4 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h4 class="text-sm font-medium text-gray-700">{{ title }}</h4>
        <slot name="subtitle"></slot>
      </div>
      <button
          @click="copyToClipboard"
          class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 copy-btn"
          :data-clipboard-text="content"
          title="Копировать"
      >
        <svg v-if="!copied" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
    <div class="p-4">
      <pre class="text-xs font-mono text-gray-800 whitespace-pre-wrap break-all bg-white p-3 rounded border border-gray-200 max-h-96 overflow-auto">{{ content }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Clipboard from 'clipboard'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['copy'])

const copied = ref(false)

const copyToClipboard = () => {
  if (!props.content) return

  const clipboard = new Clipboard('.copy-btn', {
    text: () => props.content
  })

  clipboard.on('success', () => {
    copied.value = true
    emit('copy', props.content)

    setTimeout(() => {
      copied.value = false
      clipboard.destroy()
    }, 2000)
  })

  clipboard.on('error', () => {
    emit('copy', null)
    clipboard.destroy()
  })

  // Trigger click programmatically
  const event = new MouseEvent('click')
  document.querySelector('.copy-btn').dispatchEvent(event)
}
</script>