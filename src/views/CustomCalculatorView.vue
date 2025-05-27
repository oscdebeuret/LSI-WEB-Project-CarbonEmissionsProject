<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Calculateur d'Émissions Personnalisé
    </h1>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <form v-else @submit.prevent="calculateEmissions" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type d'activité
            </label>
            <select v-model="formData.activityType"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="electricity">Consommation électrique</option>
              <option value="heating">Chauffage</option>
              <option value="device">Appareil électronique</option>
              <option value="custom">Autre (personnalisé)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Consommation (kWh)
            </label>
            <input v-model.number="formData.kwh" type="number" min="0" step="0.1"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ getKwhHelperText() }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pays
            </label>
            <select v-model="formData.country"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Le mix énergétique varie selon les pays, impactant les émissions.
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="formData.activityType === 'electricity' || formData.activityType === 'heating'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée (jours)
            </label>
            <input v-model.number="formData.duration" type="number" min="1"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div v-if="formData.activityType === 'device'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée de vie (années)
            </label>
            <input v-model.number="formData.lifespan" type="number" min="1" max="20"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div v-if="formData.activityType === 'device'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type d'appareil
            </label>
            <select v-model="formData.deviceType"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="computer">Ordinateur</option>
              <option value="smartphone">Smartphone</option>
              <option value="tv">Télévision</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optionnelle)
            </label>
            <input v-model="formData.description" type="text" placeholder="Ex: Consommation mensuelle appartement"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button type="button" @click="resetForm"
          class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Réinitialiser
        </button>
        <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          :disabled="calculating || !isFormValid">
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

          <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Saviez-vous que...
            </h3>
            <p class="text-sm text-blue-700 dark:text-blue-200">
              {{ getRandomFact() }}
            </p>
          </div>
        </div>

        <div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">Détails:</p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300">
            <li class="flex justify-between">
              <span>Type d'activité:</span>
              <span class="font-medium">{{ getActivityTypeName(formData.activityType) }}</span>
            </li>
            <li class="flex justify-between">
              <span>Consommation:</span>
              <span class="font-medium">{{ formData.kwh }} kWh</span>
            </li>
            <li class="flex justify-between">
              <span>Pays:</span>
              <span class="font-medium">{{ getCountryName(formData.country) }}</span>
            </li>
            <li v-if="formData.activityType === 'electricity' || formData.activityType === 'heating'"
              class="flex justify-between">
              <span>Durée:</span>
              <span class="font-medium">{{ formData.duration }} jours</span>
            </li>
            <li v-if="formData.activityType === 'device'" class="flex justify-between">
              <span>Durée de vie:</span>
              <span class="font-medium">{{ formData.lifespan }} années</span>
            </li>
            <li v-if="formData.activityType === 'device'" class="flex justify-between">
              <span>Type d'appareil:</span>
              <span class="font-medium">{{ getDeviceTypeName(formData.deviceType) }}</span>
            </li>
          </ul>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facteur d'émission utilisé:
            </h3>
            <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <span class="text-gray-700 dark:text-gray-300">{{ getCountryName(formData.country) }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ getEmissionFactor(formData.country) }} kg
                CO₂e/kWh</span>
            </div>
          </div>

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
const { calculateCustomEmissions, loading: apiLoading } = useClimatiqApi();

const loading = ref(apiLoading);
const calculating = ref(false);
const result = ref(null);

// Données du formulaire
const formData = ref({
  activityType: 'electricity',
  kwh: 100,
  country: 'FR',
  duration: 30,
  lifespan: 3,
  deviceType: 'computer',
  description: ''
});

// Liste des pays avec leurs facteurs d'émission
const countries = ref([
  { code: 'FR', name: 'France', factor: 0.05 },
  { code: 'DE', name: 'Allemagne', factor: 0.35 },
  { code: 'IT', name: 'Italie', factor: 0.28 },
  { code: 'ES', name: 'Espagne', factor: 0.25 },
  { code: 'GB', name: 'Royaume-Uni', factor: 0.23 },
  { code: 'US', name: 'États-Unis', factor: 0.42 },
  { code: 'CA', name: 'Canada', factor: 0.14 },
  { code: 'CN', name: 'Chine', factor: 0.70 },
  { code: 'IN', name: 'Inde', factor: 0.82 },
  { code: 'JP', name: 'Japon', factor: 0.47 },
  { code: 'AU', name: 'Australie', factor: 0.79 },
  { code: 'BR', name: 'Brésil', factor: 0.09 },
  { code: 'ZA', name: 'Afrique du Sud', factor: 0.95 },
  { code: 'RU', name: 'Russie', factor: 0.38 },
  { code: 'SA', name: 'Arabie Saoudite', factor: 0.72 }
]);

const facts = ref([
  "La France a l'un des mix électriques les moins carbonés d'Europe grâce à son parc nucléaire.",
  "Un ordinateur portable consomme environ 30-70 kWh par an en utilisation normale.",
  "Un smartphone ne consomme que 2-7 kWh par an, mais sa fabrication représente environ 80% de son empreinte carbone totale.",
  "Le chauffage représente en moyenne 60% de la consommation énergétique d'un foyer en Europe.",
  "Les centres de données dans le monde consomment environ 1% de l'électricité mondiale.",
  "Éteindre complètement vos appareils plutôt que de les laisser en veille peut réduire leur consommation d'énergie de 10%.",
  "Le streaming vidéo en 4K consomme environ 4 fois plus d'énergie que le streaming en HD.",
  "Un réfrigérateur moderne consomme environ 300-600 kWh par an."
]);

const isFormValid = computed(() => {
  return formData.value.kwh > 0 && formData.value.country;
});

const getActivityTypeName = (type) => {
  const types = {
    'electricity': 'Consommation électrique',
    'heating': 'Chauffage',
    'device': 'Appareil électronique',
    'custom': 'Personnalisé'
  };

  return types[type] || type;
};

const getCountryName = (code) => {
  const country = countries.value.find(c => c.code === code);
  return country ? country.name : code;
};

const getEmissionFactor = (code) => {
  const country = countries.value.find(c => c.code === code);
  return country ? country.factor : 0.5;
};

const getDeviceTypeName = (type) => {
  const types = {
    'computer': 'Ordinateur',
    'smartphone': 'Smartphone',
    'tv': 'Télévision',
    'other': 'Autre'
  };

  return types[type] || type;
};

const getKwhHelperText = () => {
  switch (formData.value.activityType) {
    case 'electricity':
      return 'Un foyer français consomme en moyenne 4000 kWh par an.';
    case 'heating':
      return 'Le chauffage représente environ 2500 kWh par an pour un appartement de 70m².';
    case 'device':
      return 'Un ordinateur consomme environ 30-70 kWh par an, un smartphone 2-7 kWh.';
    default:
      return 'Entrez la consommation électrique en kilowattheures (kWh).';
  }
};

// Obtenir un fait aléatoire
const getRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * facts.value.length);
  return facts.value[randomIndex];
};

// Calculer les émissions
const calculateEmissions = async () => {
  calculating.value = true;

  try {
    // Appel à l'API Climatiq (simulé)
    const emissions = await calculateCustomEmissions({
      kwh: formData.value.kwh,
      country: formData.value.country
    });

    result.value = {
      emissions: emissions,
      timestamp: new Date(),
      details: { ...formData.value }
    };
  } catch (error) {
    console.error('Erreur lors du calcul des émissions:', error);

    // Simuler un résultat pour la démonstration
    const factor = getEmissionFactor(formData.value.country);
    let emissions = formData.value.kwh * factor;

    // Ajuster en fonction du type d'activité
    if (formData.value.activityType === 'device') {
      // Pour les appareils, on ajoute une empreinte de fabrication
      const manufacturingEmissions = {
        'computer': 300, // kg CO2e
        'smartphone': 60,
        'tv': 150,
        'other': 100
      };

      emissions += (manufacturingEmissions[formData.value.deviceType] || 100) / (formData.value.lifespan || 1);
    }

    result.value = {
      emissions: emissions,
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
    activityType: 'electricity',
    kwh: 100,
    country: 'FR',
    duration: 30,
    lifespan: 3,
    deviceType: 'computer',
    description: ''
  };
  result.value = null;
};

// Sauvegarder le résultat
const saveResult = async () => {
  if (!result.value) return;

  const calculation = {
    id: Date.now().toString(),
    type: 'custom',
    date: new Date().toISOString(),
    description: formData.value.description || `${getActivityTypeName(formData.value.activityType)} - ${formData.value.kwh} kWh`,
    emissions: result.value.emissions,
    details: {
      activityType: formData.value.activityType,
      kwh: formData.value.kwh,
      country: formData.value.country,
      duration: formData.value.duration,
      lifespan: formData.value.lifespan,
      deviceType: formData.value.deviceType
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
