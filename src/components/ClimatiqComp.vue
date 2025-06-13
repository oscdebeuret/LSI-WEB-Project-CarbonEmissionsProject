<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Calculateur CO₂e Cloud</h2>

    <div class="space-y-4">
      <select v-model="selectedProvider" @change="onProviderChange" class="w-full p-2 rounded-md border">
        <option disabled value="">Choisir un fournisseur</option>
        <option v-for="(p, id) in providers" :key="id" :value="id">{{ p.provider_full_name }}</option>
      </select>

      <select v-model="selectedRegion" class="w-full p-2 rounded-md border">
        <option disabled value="">Choisir une région</option>
        <option v-for="region in filteredRegions" :key="region.code" :value="region.code">
          {{ region.emoji }} {{ region.label }} ({{ region.code }})
        </option>
      </select>

      <select v-model="activityType" class="w-full p-2 rounded-md border">
        <option disabled value="">Type d’activité</option>
        <option value="cpu">CPU (vCPU)</option>
        <option value="memory">RAM (GB)</option>
        <option value="storage">Stockage</option>
        <option value="instance">VM Instance</option>
      </select>

      <!-- Champs dynamiques -->
      <div v-if="activityType === 'cpu'">
        <input v-model.number="form.cpuCount" type="number" min="1" placeholder="Nombre de vCPU"
          class="w-full p-2 rounded-md border" />
        <input v-model.number="form.duration" type="number" min="1" placeholder="Durée (h)"
          class="w-full p-2 rounded-md border mt-2" />
      </div>

      <div v-if="activityType === 'memory'">
        <input v-model.number="form.data" type="number" min="1" placeholder="RAM (GB)"
          class="w-full p-2 rounded-md border" />
        <input v-model.number="form.duration" type="number" min="1" placeholder="Durée (h)"
          class="w-full p-2 rounded-md border mt-2" />
      </div>

      <div v-if="activityType === 'storage'">
        <input v-model.number="form.data" type="number" min="1" placeholder="Taille stockage (GB)"
          class="w-full p-2 rounded-md border" />
        <select v-model="form.storageType" class="w-full p-2 rounded-md border mt-2">
          <option disabled value="">Type de disque</option>
          <option value="ssd">SSD</option>
          <option value="hdd">HDD</option>
        </select>
        <input v-model.number="form.duration" type="number" min="1" placeholder="Durée (h)"
          class="w-full p-2 rounded-md border mt-2" />
      </div>

      <div v-if="activityType === 'instance'">
        <select v-model="form.instance" class="w-full p-2 rounded-md border">
          <option disabled value="">Choisir une instance</option>
          <option v-for="i in availableInstances" :key="i" :value="i">{{ i }}</option>
        </select>
        <input v-model.number="form.duration" type="number" min="1" placeholder="Durée (h)"
          class="w-full p-2 rounded-md border mt-2" />
      </div>

      <button @click="calculate"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all">
        Calculer l’empreinte carbone
      </button>

      <div v-if="result" class="mt-4 text-lg font-medium text-green-600 dark:text-green-400">
        Résultat : {{ result }} kg CO₂e
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const apiBase = 'https://api.climatiq.io/compute/v1'
const token = `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`

const selectedProvider = ref('')
const selectedRegion = ref('')
const activityType = ref('')
const result = ref(null)

const form = ref({
  cpuCount: 1,
  data: 1,
  duration: 1,
  storageType: 'ssd',
  instance: ''
})

const providers = ref({})
const availableInstances = ref([])

const importantRegions = {
  eu_west_1: { emoji: '🇪🇺', label: 'Europe Ouest' },
  us_east_1: { emoji: '🇺🇸', label: 'États-Unis Est' },
  asia_southeast_1: { emoji: '🇸🇬', label: 'Asie Sud-Est' }
}

const filteredRegions = computed(() => {
  if (!selectedProvider.value || !providers.value[selectedProvider.value]) return []
  return providers.value[selectedProvider.value].regions
    .filter(r => Object.keys(importantRegions).includes(r))
    .map(code => ({
      code,
      emoji: importantRegions[code]?.emoji || '🌍',
      label: importantRegions[code]?.label || code
    }))
})

async function fetchProviders() {
  try {
    const res = await axios.get(`${apiBase}/metadata`, {
      headers: { Authorization: token }
    })
    providers.value = res.data.cloud_providers
  } catch (e) {
    console.error('Erreur récupération metadata', e)
  }
}

function onProviderChange() {
  selectedRegion.value = ''
  availableInstances.value = providers.value[selectedProvider.value]?.virtual_machine_instances || []
}

async function calculate() {
  if (!selectedProvider.value || !selectedRegion.value || !activityType.value) return

  let url = ''
  let payload = {
    region: selectedRegion.value,
    duration: form.value.duration,
    duration_unit: 'hour'
  }

  switch (activityType.value) {
    case 'cpu':
      url = `${apiBase}/${selectedProvider.value}/cpu`
      payload.cpu_count = form.value.cpuCount
      payload.average_vcpu_utilization = 0.5
      break
    case 'memory':
      url = `${apiBase}/${selectedProvider.value}/memory`
      payload.data = form.value.data
      payload.data_unit = 'GB'
      break
    case 'storage':
      url = `${apiBase}/${selectedProvider.value}/storage`
      payload.data = form.value.data
      payload.data_unit = 'GB'
      payload.storage_type = form.value.storageType
      break
    case 'instance':
      url = `${apiBase}/${selectedProvider.value}/instance`
      payload.instance = form.value.instance
      break
    default:
      return
  }

  try {
    const res = await axios.post(url, payload, {
      headers: { Authorization: token }
    })
    result.value = (res.data.total_co2e || res.data.co2e)?.toFixed(4)
  } catch (e) {
    console.error('Erreur API', e)
    result.value = 'Erreur'
  }
}

onMounted(fetchProviders)
</script>

<style scoped>
input,
select {
  background-color: white;
  color: black;
}

.dark input,
.dark select {
  background-color: #1f2937;
  color: white;
}
</style>
