<template>
  <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
    <h3 class="text-xl font-semibold text-green-700 mb-2">
      Résultat d’émission CO₂
    </h3>

    <p class="text-gray-700 mb-2">
      <span class="font-medium">Activité :</span> {{ result.activity }}
    </p>
    <p class="text-gray-700 mb-2">
      <span class="font-medium">Émissions estimées :</span>
      {{ result.co2e.toFixed(2) }} kg CO₂e
    </p>
    <p v-if="result.region" class="text-gray-700 mb-4">
      <span class="font-medium">Région :</span> {{ result.region }}
    </p>

    <div class="flex gap-4">
      <button v-if="showAdd" @click="$emit('add-to-favorites', result)"
        class="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
        Ajouter aux favoris
      </button>

      <button v-if="showDelete" @click="$emit('delete')"
        class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
  showAdd: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['add-to-favorites', 'delete'])
</script>
