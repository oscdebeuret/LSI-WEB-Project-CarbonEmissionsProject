<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm text-gray-800 dark:text-gray-200 space-y-4 h-full">

    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold text-base">
          {{ emoji }} {{ result }} kg CO₂e
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Généré le {{ date }}
        </div>
      </div>
      <button @click="$emit('remove')" class="text-red-700  transition-colors" title="Supprimer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill"
          viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
        </svg>
      </button>
    </div>

    <hr />

    <div>
      <template v-for="(value, key) in cleanedFields" :key="key">
        <div v-if="value">
          <span class="text-gray-500">{{ formatKey(key) }} :</span>
          <span class="ml-1 font-medium">{{ formatValue(value) }}</span>
        </div>
      </template>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  emoji: { type: String },
  fields: {
    type: Object,
    required: true
  },
  date: { type: String },
  result: { type: String }
})


const cleanedFields = computed(() => {
  const entries = Object.entries(props.fields || {})
  return Object.fromEntries(entries.filter(([key, val]) => key !== 'result' && val !== undefined && val !== ''))
})

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatValue(value) {
  return typeof value === 'number' ? value : String(value)
}

</script>
