<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Calculateur d'Émissions Cloud
    </h1>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <form v-else @submit.prevent="calculateEmissions" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fournisseur Cloud
            </label>
            <select v-model="formData.provider"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="aws">Amazon Web Services (AWS)</option>
              <option value="gcp">Google Cloud Platform (GCP)</option>
              <option value="azure">Microsoft Azure</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Région
            </label>
            <select v-model="formData.region"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option v-for="region in availableRegions" :key="region.id" :value="region.id">
                {{ region.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type d'instance
            </label>
            <select v-model="formData.instanceType"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option v-for="instance in availableInstances" :key="instance.id" :value="instance.id">
                {{ instance.name }} ({{ instance.vcpu }} vCPU, {{ instance.memory }} GB RAM)
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre d'instances
            </label>
            <input v-model.number="formData.instanceCount" type="number" min="1"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Utilisation CPU moyenne (%)
            </label>
            <div class="flex items-center">
              <input v-model.number="formData.cpuUtilization" type="range" min="0" max="100" step="5"
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <span class="ml-2 text-gray-700 dark:text-gray-300 w-10 text-center">
                {{ formData.cpuUtilization }}%
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée (heures par jour)
            </label>
            <div class="flex items-center">
              <input v-model.number="formData.hoursPerDay" type="range" min="1" max="24" step="1"
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <span class="ml-2 text-gray-700 dark:text-gray-300 w-10 text-center">
                {{ formData.hoursPerDay }}h
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de jours
            </label>
            <input v-model.number="formData.days" type="number" min="1" max="365"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optionnelle)
        </label>
        <input v-model="formData.description" type="text" placeholder="Ex: Serveurs de production"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      <div class="flex justify-end space-x-4">
        <button type="button" @click="resetForm"
          class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Réinitialiser
        </button>
        <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          :disabled="calculating">
          <span v-if="calculating">Calcul en cours...</span>
          <span v-else>Calculer les émissions</span>
        </button>
      </div>
    </form>

    <!-- Résultats -->
    <div v-if="result" class="mt-8 p-6 bg-green-50 dark:bg-green-900/30 rounded-xl">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Résultats
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">Émissions totales:</p>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400">
            {{ result.emissions.toFixed(2) }} kg CO₂e
          </p>

          <div class="mt-4">
            <p class="text-gray-600 dark:text-gray-300 mb-1">Équivalent à:</p>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300">
              <li class="flex items-center">
                <span class="w-6 h-6 mr-2 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600 dark:text-green-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                {{ (result.emissions / 0.1).toFixed(0) }} km en voiture
              </li>
              <li class="flex items-center">
                <span class="w-6 h-6 mr-2 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600 dark:text-green-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                {{ (result.emissions / 15).toFixed(1) }} jours de consommation d'un foyer
              </li>
            </ul>
          </div>
        </div>

        <div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">Détails:</p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300">
            <li class="flex justify-between">
              <span>Fournisseur:</span>
              <span class="font-medium">{{ getProviderName(formData.provider) }}</span>
            </li>
            <li class="flex justify-between">
              <span>Région:</span>
              <span class="font-medium">{{ getRegionName(formData.region) }}</span>
            </li>
            <li class="flex justify-between">
              <span>Instance:</span>
              <span class="font-medium">{{ getInstanceName(formData.instanceType) }}</span>
            </li>
            <li class="flex justify-between">
              <span>Nombre:</span>
              <span class="font-medium">{{ formData.instanceCount }}</span>
            </li>
            <li class="flex justify-between">
              <span>Durée totale:</span>
              <span class="font-medium">{{ formData.hoursPerDay * formData.days }} heures</span>
            </li>
          </ul>

          <div class="mt-4 flex justify-end">
            <button @click="saveResult"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Sauvegarder ce résultat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalculationsStore } from '../stores/calculations';
import { useClimatiqApi } from '../composables/useClimatiqApi';

const calculationsStore = useCalculationsStore();
const { calculateCloudEmissions } = useClimatiqApi();

const loading = ref(true);
const calculating = ref(false);
const result = ref(null);

// Données du formulaire
const formData = ref({
  provider: 'aws',
  region: 'us-east-1',
  instanceType: 't3.micro',
  instanceCount: 1,
  cpuUtilization: 50,
  hoursPerDay: 24,
  days: 30,
  description: ''
});

// Données de référence
const cloudProviders = ref([
  { id: 'aws', name: 'Amazon Web Services (AWS)' },
  { id: 'gcp', name: 'Google Cloud Platform (GCP)' },
  { id: 'azure', name: 'Microsoft Azure' }
]);

const regions = ref([
  { id: 'us-east-1', name: 'US East (N. Virginia)', provider: 'aws' },
  { id: 'us-west-1', name: 'US West (N. California)', provider: 'aws' },
  { id: 'eu-west-1', name: 'EU (Ireland)', provider: 'aws' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', provider: 'aws' },
  { id: 'us-central1', name: 'Iowa (us-central1)', provider: 'gcp' },
  { id: 'europe-west1', name: 'Belgium (europe-west1)', provider: 'gcp' },
  { id: 'asia-east1', name: 'Taiwan (asia-east1)', provider: 'gcp' },
  { id: 'eastus', name: 'East US', provider: 'azure' },
  { id: 'westeurope', name: 'West Europe', provider: 'azure' },
  { id: 'southeastasia', name: 'Southeast Asia', provider: 'azure' }
]);

const instances = ref([
  { id: 't3.micro', name: 't3.micro', vcpu: 2, memory: 1, provider: 'aws' },
  { id: 't3.small', name: 't3.small', vcpu: 2, memory: 2, provider: 'aws' },
  { id: 'm5.large', name: 'm5.large', vcpu: 2, memory: 8, provider: 'aws' },
  { id: 'c5.xlarge', name: 'c5.xlarge', vcpu: 4, memory: 8, provider: 'aws' },
  { id: 'e2-micro', name: 'e2-micro', vcpu: 2, memory: 1, provider: 'gcp' },
  { id: 'e2-small', name: 'e2-small', vcpu: 2, memory: 2, provider: 'gcp' },
  { id: 'n1-standard-2', name: 'n1-standard-2', vcpu: 2, memory: 7.5, provider: 'gcp' },
  { id: 'n1-standard-4', name: 'n1-standard-4', vcpu: 4, memory: 15, provider: 'gcp' },
  { id: 'Standard_B1s', name: 'Standard_B1s', vcpu: 1, memory: 1, provider: 'azure' },
  { id: 'Standard_B2s', name: 'Standard_B2s', vcpu: 2, memory: 4, provider: 'azure' },
  { id: 'Standard_D2s_v3', name: 'Standard_D2s_v3', vcpu: 2, memory: 8, provider: 'azure' },
  { id: 'Standard_D4s_v3', name: 'Standard_D4s_v3', vcpu: 4, memory: 16, provider: 'azure' }
]);

// Filtrer les régions disponibles en fonction du fournisseur sélectionné
const availableRegions = computed(() => {
  return regions.value.filter(region => region.provider === formData.value.provider);
});

// Filtrer les types d'instances disponibles en fonction du fournisseur sélectionné
const availableInstances = computed(() => {
  return instances.value.filter(instance => instance.provider === formData.value.provider);
});

// Obtenir le nom du fournisseur
const getProviderName = (providerId) => {
  const provider = cloudProviders.value.find(p => p.id === providerId);
  return provider ? provider.name : providerId;
};

// Obtenir le nom de la région
const getRegionName = (regionId) => {
  const region = regions.value.find(r => r.id === regionId);
  return region ? region.name : regionId;
};

// Obtenir le nom de l'instance
const getInstanceName = (instanceId) => {
  const instance = instances.value.find(i => i.id === instanceId);
  return instance ? instance.name : instanceId;
};

// Calculer les émissions
const calculateEmissions = async () => {
  calculating.value = true;

  try {
    // Appel à l'API Climatiq
    const emissions = await calculateCloudEmissions({
      provider: formData.value.provider,
      region: formData.value.region,
      instanceType: formData.value.instanceType,
      instanceCount: formData.value.instanceCount,
      cpuUtilization: formData.value.cpuUtilization,
      hours: formData.value.hoursPerDay * formData.value.days
    });

    result.value = {
      emissions: emissions,
      timestamp: new Date(),
      details: { ...formData.value }
    };
  } catch (error) {
    console.error('Erreur lors du calcul des émissions:', error);
    // Simuler un résultat pour la démonstration
    result.value = {
      emissions: (formData.value.instanceCount * formData.value.cpuUtilization / 100 * formData.value.hoursPerDay * formData.value.days * 0.05),
      timestamp: new Date(),
      details: { ...formData.value }
    };
  } finally {
    calculating.value = false;
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    provider: 'aws',
    region: 'us-east-1',
    instanceType: 't3.micro',
    instanceCount: 1,
    cpuUtilization: 50,
    hoursPerDay: 24,
    days: 30,
    description: ''
  };
  result.value = null;
};

// Sauvegarder le résultat
const saveResult = async () => {
  if (!result.value) return;

  const calculation = {
    id: Date.now().toString(),
    type: 'cloud',
    date: new Date().toISOString(),
    description: formData.value.description || `${formData.value.instanceCount} ${getInstanceName(formData.value.instanceType)} sur ${getProviderName(formData.value.provider)}`,
    emissions: result.value.emissions,
    details: {
      provider: formData.value.provider,
      region: formData.value.region,
      instanceType: formData.value.instanceType,
      instanceCount: formData.value.instanceCount,
      cpuUtilization: formData.value.cpuUtilization,
      hoursPerDay: formData.value.hoursPerDay,
      days: formData.value.days,
      totalHours: formData.value.hoursPerDay * formData.value.days
    }
  };

  await calculationsStore.addCalculation(calculation);
  await calculationsStore.addToFavorites(calculation);

  // Réinitialiser le formulaire après sauvegarde
  resetForm();
};

onMounted(() => {
  // Simuler le chargement des données
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>
