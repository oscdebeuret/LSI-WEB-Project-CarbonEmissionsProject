<template>
  <div class="relative z-10 max-w-2xl w-full mx-auto">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform">
      <div class="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
        <h1>🌍</h1>
        <h2>Empreinte carbone du cloud</h2>
      </div>

      <form @submit.prevent="calculate">
        <div class="space-y-2 text-sm">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Fournisseur cloud</label>
              <select v-model="selectedProvider" @change="onProviderChange" class="form-select">
                <option disabled value="">Choisir...</option>
                <option v-for="(p, id) in providers" :key="id" :value="id">{{ p.provider_full_name }}</option>
              </select>
            </div>

            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type d’activité</label>
              <select v-model="activityType" class="form-select">
                <option disabled value="">Choisir...</option>
                <option value="cpu">CPU (vCPU)</option>
                <option value="memory">RAM (GB)</option>
                <option value="storage">Stockage</option>
                <option value="instance">VM Instance</option>
              </select>
            </div>
          </div>

          <!-- Région -->
          <div v-if="selectedProvider">
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Région</label>
            <select v-model="selectedRegion" class="form-select">
              <option disabled value="">Choisir...</option>
              <option v-for="region in filteredRegions" :key="region.code" :value="region.code">
                {{ region.emoji }} • {{ region.label }}
              </option>
            </select>
          </div>

          <!-- Formulaires selon type -->
          <div v-if="activityType === 'cpu'" class="flex flex-col sm:flex-row gap-4">
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Nombre de vCPU</label>
              <input v-model.number="form.cpuCount" type="number" min="1" class="form-input" />
            </div>
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Durée (h)</label>
              <input v-model.number="form.duration" type="number" min="1" class="form-input" />
            </div>
          </div>

          <div v-if="activityType === 'memory'" class="flex flex-col sm:flex-row gap-4">
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">RAM (GB)</label>
              <input v-model.number="form.data" type="number" min="1" class="form-input" />
            </div>
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Durée (h)</label>
              <input v-model.number="form.duration" type="number" min="1" class="form-input" />
            </div>
          </div>

          <div v-if="activityType === 'storage'" class="flex flex-col sm:flex-row gap-4">
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Taille stockage (GB)</label>
              <input v-model.number="form.data" type="number" min="1" class="form-input" />
            </div>
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type de disque</label>
              <select v-model="form.storageType" class="form-select">
                <option disabled value="">Choisir...</option>
                <option value="ssd">SSD</option>
                <option value="hdd">HDD</option>
              </select>
            </div>
            <div class="sm:w-full">
              <label class="block text-gray-700 dark:text-gray-300 mb-1 mt-4 sm:mt-0">Durée (h)</label>
              <input v-model.number="form.duration" type="number" min="1" class="form-input" />
            </div>
          </div>

          <div v-if="activityType === 'instance'" class="flex flex-col sm:flex-row gap-4 mb-2">
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Instance VM</label>
              <select v-model="form.instance" class="form-select">
                <option disabled value="">Choisir...</option>
                <option v-for="i in availableInstances" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
            <div class="sm:w-1/2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Durée (h)</label>
              <input v-model.number="form.duration" type="number" min="1" class="form-input" />
            </div>
          </div>
        </div>

        <button type="submit"
          class="w-full mt-5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300">
          Calculer 🌿
        </button>
      </form>
    </div>

    <ResultCard v-if="result" class="mt-3" :result="result.result_value" :fields="result.fields"
      :date="result.generated_at" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ResultCard from '@/components/ResultCard.vue'
import { fetchProviders, calculateEmission } from '@/services/climatiq'
import { formatDate } from '@/utils'

const selectedProvider = ref('')
const selectedRegion = ref('')
const activityType = ref('')
const result = ref(null)
const providers = ref({})

const form = ref({
  cpuCount: 1,
  data: 1,
  duration: 1,
  storageType: 'ssd',
  instance: ''
})

const importantRegions = {
  eu_west_1: { emoji: '🇪🇺', label: 'Europe Ouest' },
  eu_north_1: { emoji: '🇸🇪', label: 'Europe Nord (Suède)' },
  eu_central_1: { emoji: '🇩🇪', label: 'Europe Centrale (Allemagne)' },
  us_east_1: { emoji: '🇺🇸', label: 'États-Unis Est (Virginie)' },
  us_west_1: { emoji: '🇺🇸', label: 'États-Unis Ouest (Californie)' },
  us_west_2: { emoji: '🇺🇸', label: 'États-Unis Ouest 2 (Oregon)' },
  ca_central: { emoji: '🇨🇦', label: 'Canada Central' },
  uk_south: { emoji: '🇬🇧', label: 'Royaume-Uni Sud' },
  uk_west: { emoji: '🇬🇧', label: 'Royaume-Uni Ouest' },
  asia_southeast_1: { emoji: '🇸🇬', label: 'Asie Sud-Est (Singapour)' },
  asia_east_1: { emoji: '🇭🇰', label: 'Asie Est (Hong Kong)' },
  ap_northeast_1: { emoji: '🇯🇵', label: 'Asie Nord-Est (Tokyo)' },
  ap_south_1: { emoji: '🇮🇳', label: 'Asie Sud (Inde)' },
  australia_southeast_1: { emoji: '🇦🇺', label: 'Australie Sud-Est (Sydney)' },
  southamerica_east_1: { emoji: '🇧🇷', label: 'Amérique du Sud Est (Brésil)' }
};


const activityTypeLabel = computed(() => {
  switch (activityType.value) {
    case 'cpu': return 'CPU (vCPU)'
    case 'memory': return 'RAM (GB)'
    case 'storage': return 'Stockage'
    case 'instance': return 'VM Instance'
    default: return ''
  }
})

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

function onProviderChange() {
  selectedRegion.value = ''
}

async function calculate() {
  if (!selectedProvider.value || !selectedRegion.value || !activityType.value) return

  const payload = {
    region: selectedRegion.value,
    duration: form.value.duration,
    duration_unit: 'hour'
  }

  if (activityType.value === 'cpu') {
    payload.cpu_count = form.value.cpuCount
    payload.average_vcpu_utilization = 0.5
  } else if (activityType.value === 'memory') {
    payload.data = form.value.data
    payload.data_unit = 'GB'
  } else if (activityType.value === 'storage') {
    payload.data = form.value.data
    payload.data_unit = 'GB'
    payload.storage_type = form.value.storageType
  }

  try {
    const res = await calculateEmission({
      provider: selectedProvider.value,
      type: activityType.value,
      payload
    })

    const now = new Date()
    result.value = {
      fields: {
        provider: providers.value[selectedProvider.value]?.provider_full_name,
        region: importantRegions[selectedRegion.value]?.label,
        type: activityTypeLabel.value,
        cpu: activityType.value === 'cpu' ? form.value.cpuCount : undefined,
        ram: activityType.value === 'memory' ? form.value.data : undefined,
        storage: activityType.value === 'storage' ? form.value.data : undefined,
        disk: activityType.value === 'storage' ? form.value.storageType : undefined,
        instance: activityType.value === 'instance' ? form.value.instance : undefined,
        duration: form.value.duration,
      },
      result_value: (res.total_co2e || res.co2e)?.toFixed(4),
      generated_at: formatDate(now)
    }
  } catch (e) {
    console.error('Erreur API', e)
    result.value = { result_value: 'Erreur', fields: {}, generated_at: formatDate(new Date()) }
  }
}

onMounted(async () => {
  try {
    providers.value = await fetchProviders()
  } catch (e) {
    console.error('Erreur init', e)
  }
})
</script>

<style scoped>
.form-select,
.form-input {
  @apply w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}
</style>
