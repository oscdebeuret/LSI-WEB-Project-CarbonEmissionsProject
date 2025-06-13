<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm text-gray-800 dark:text-gray-200 space-y-4">

    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold text-base">
          {{ emoji }} {{ result }} kg CO₂e
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Généré le {{ date }}
        </div>
      </div>
      <button @click="toggleFavorite"
        class="text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white transition-colors">
        <svg v-if="!isFavorite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
          class="bi bi-star" viewBox="0 0 16 16">
          <path
            d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
          class="bi bi-star-fill" viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
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
import { ref, computed } from 'vue'

const props = defineProps({
  emoji: { type: String },
  fields: {
    type: Object,
    required: true
  },
  date: { type: String },
  result: { type: String }
})

const isFavorite = ref(false)
const toggleFavorite = () => (isFavorite.value = !isFavorite.value)

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
