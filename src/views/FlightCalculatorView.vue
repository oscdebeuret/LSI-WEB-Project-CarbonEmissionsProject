<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Calculateur d'Émissions de Vols
    </h1>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <form v-else @submit.prevent="calculateEmissions" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Aéroport de départ
            </label>
            <div class="relative">
              <input v-model="formData.origin" type="text" placeholder="Ex: CDG, Paris"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
              <div v-if="suggestions.origin.length > 0"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                <ul class="py-1">
                  <li v-for="airport in suggestions.origin" :key="airport.code"
                    @click="selectAirport('origin', airport)"
                    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-white">
                    {{ airport.code }} - {{ airport.name }}, {{ airport.city }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Aéroport d'arrivée
            </label>
            <div class="relative">
              <input v-model="formData.destination" type="text" placeholder="Ex: JFK, New York"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
              <div v-if="suggestions.destination.length > 0"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                <ul class="py-1">
                  <li v-for="airport in suggestions.destination" :key="airport.code"
                    @click="selectAirport('destination', airport)"
                    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-white">
                    {{ airport.code }} - {{ airport.name }}, {{ airport.city }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type de vol
            </label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="formData.tripType" value="one-way"
                  class="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out" />
                <span class="ml-2 text-gray-700 dark:text-gray-300">Aller simple</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="formData.tripType" value="round-trip"
                  class="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out" />
                <span class="ml-2 text-gray-700 dark:text-gray-300">Aller-retour</span>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Classe
            </label>
            <select v-model="formData.class"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="economy">Économique</option>
              <option value="premium">Économique Premium</option>
              <option value="business">Affaires</option>
              <option value="first">Première</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de passagers
            </label>
            <input v-model.number="formData.passengers" type="number" min="1"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date du vol (optionnelle)
            </label>
            <input v-model="formData.date" type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optionnelle)
        </label>
        <input v-model="formData.description" type="text" placeholder="Ex: Voyage d'affaires à New York"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                {{ (result.emissions / 15).toFixed(1) }} jours de consommation d'un foyer
              </li>
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
            </ul>
          </div>
        </div>

        <div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">Détails:</p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300">
            <li class="flex justify-between">
              <span>Trajet:</span>
              <span class="font-medium">{{ formData.origin }} → {{ formData.destination }}</span>
            </li>
            <li class="flex justify-between">
              <span>Type:</span>
              <span class="font-medium">{{ formData.tripType === 'one-way' ? 'Aller simple' : 'Aller-retour' }}</span>
            </li>
            <li class="flex justify-between">
              <span>Classe:</span>
              <span class="font-medium">{{ getClassName(formData.class) }}</span>
            </li>
            <li class="flex justify-between">
              <span>Passagers:</span>
              <span class="font-medium">{{ formData.passengers }}</span>
            </li>
            <li class="flex justify-between">
              <span>Distance:</span>
              <span class="font-medium">{{ result.distance.toFixed(0) }} km</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useCalculationsStore } from '../stores/calculations';
import { useClimatiqApi } from '../composables/useClimatiqApi';

const calculationsStore = useCalculationsStore();
const { calculateFlightEmissions, loading: apiLoading } = useClimatiqApi();

const loading = ref(apiLoading);
const calculating = ref(false);
const result = ref(null);

// Données du formulaire
const formData = ref({
  origin: '',
  destination: '',
  tripType: 'round-trip',
  class: 'economy',
  passengers: 1,
  date: '',
  description: ''
});

// Suggestions d'aéroports
const suggestions = ref({
  origin: [],
  destination: []
});

// Données de référence
const airports = ref([
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479 },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'France', lat: 48.7262, lon: 2.3652 },
  { code: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Royaume-Uni', lat: 51.4700, lon: -0.4543 },
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'États-Unis', lat: 40.6413, lon: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'États-Unis', lat: 33.9416, lon: -118.4085 },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japon', lat: 35.7647, lon: 140.3864 },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australie', lat: -33.9399, lon: 151.1753 },
  { code: 'DXB', name: 'Dubai International', city: 'Dubaï', country: 'Émirats Arabes Unis', lat: 25.2532, lon: 55.3657 },
  { code: 'SIN', name: 'Changi', city: 'Singapour', country: 'Singapour', lat: 1.3644, lon: 103.9915 },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Espagne', lat: 40.4983, lon: -3.5676 },
  { code: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italie', lat: 41.8045, lon: 12.2508 },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Pays-Bas', lat: 52.3105, lon: 4.7683 },
  { code: 'FRA', name: 'Frankfurt am Main', city: 'Francfort', country: 'Allemagne', lat: 50.0379, lon: 8.5622 },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turquie', lat: 41.2608, lon: 28.7418 },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Chine', lat: 22.3080, lon: 113.9185 }
]);

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  return formData.value.origin && formData.value.destination && formData.value.passengers > 0;
});

// Obtenir le nom de la classe
const getClassName = (classCode) => {
  const classNames = {
    'economy': 'Économique',
    'premium': 'Économique Premium',
    'business': 'Affaires',
    'first': 'Première'
  };

  return classNames[classCode] || classCode;
};

// Rechercher des aéroports
const searchAirports = (query, field) => {
  if (!query || query.length < 2) {
    suggestions.value[field] = [];
    return;
  }

  const results = airports.value.filter(airport => {
    const searchQuery = query.toLowerCase();
    return airport.code.toLowerCase().includes(searchQuery) ||
      airport.name.toLowerCase().includes(searchQuery) ||
      airport.city.toLowerCase().includes(searchQuery);
  }).slice(0, 5);

  suggestions.value[field] = results;
};

// Sélectionner un aéroport
const selectAirport = (field, airport) => {
  formData.value[field] = airport.code;
  suggestions.value[field] = [];
};

// Calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// Calculer les émissions
const calculateEmissions = async () => {
  calculating.value = true;

  try {
    // Trouver les aéroports
    const originAirport = airports.value.find(a => a.code === formData.value.origin);
    const destinationAirport = airports.value.find(a => a.code === formData.value.destination);

    if (!originAirport || !destinationAirport) {
      throw new Error('Aéroport non trouvé');
    }

    // Calculer la distance
    const distance = calculateDistance(
      originAirport.lat, originAirport.lon,
      destinationAirport.lat, destinationAirport.lon
    );

    // Multiplier par 2 si aller-retour
    const totalDistance = formData.value.tripType === 'round-trip' ? distance * 2 : distance;

    // Appel à l'API Climatiq (simulé)
    const emissions = await calculateFlightEmissions({
      distance: totalDistance,
      class: formData.value.class,
      passengers: formData.value.passengers
    });

    result.value = {
      emissions: emissions,
      distance: totalDistance,
      timestamp: new Date(),
      details: { ...formData.value }
    };
  } catch (error) {
    console.error('Erreur lors du calcul des émissions:', error);

    // Simuler un résultat pour la démonstration
    // Facteurs d'émission approximatifs (kg CO2e par km par passager)
    const emissionFactors = {
      'economy': 0.15,
      'premium': 0.25,
      'business': 0.4,
      'first': 0.6
    };

    // Trouver les aéroports
    const originAirport = airports.value.find(a => a.code === formData.value.origin);
    const destinationAirport = airports.value.find(a => a.code === formData.value.destination);

    if (originAirport && destinationAirport) {
      // Calculer la distance
      const distance = calculateDistance(
        originAirport.lat, originAirport.lon,
        destinationAirport.lat, destinationAirport.lon
      );

      // Multiplier par 2 si aller-retour
      const totalDistance = formData.value.tripType === 'round-trip' ? distance * 2 : distance;

      // Calculer les émissions
      const factor = emissionFactors[formData.value.class] || emissionFactors.economy;
      const emissions = totalDistance * factor * formData.value.passengers;

      result.value = {
        emissions: emissions,
        distance: totalDistance,
        timestamp: new Date(),
        details: { ...formData.value }
      };
    }
  } finally {
    calculating.value = false;
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    origin: '',
    destination: '',
    tripType: 'round-trip',
    class: 'economy',
    passengers: 1,
    date: '',
    description: ''
  };
  result.value = null;
};

// Sauvegarder le résultat
const saveResult = async () => {
  if (!result.value) return;

  const calculation = {
    id: Date.now().toString(),
    type: 'flight',
    date: new Date().toISOString(),
    description: formData.value.description || `Vol ${formData.value.origin} → ${formData.value.destination}`,
    emissions: result.value.emissions,
    details: {
      origin: formData.value.origin,
      destination: formData.value.destination,
      tripType: formData.value.tripType,
      class: formData.value.class,
      passengers: formData.value.passengers,
      date: formData.value.date,
      distance: result.value.distance
    }
  };

  await calculationsStore.addCalculation(calculation);
  await calculationsStore.addToFavorites(calculation);

  // Réinitialiser le formulaire après sauvegarde
  resetForm();
};

// Observer les changements dans les champs de recherche
watch(() => formData.value.origin, (newValue) => {
  searchAirports(newValue, 'origin');
});

watch(() => formData.value.destination, (newValue) => {
  searchAirports(newValue, 'destination');
});

onMounted(() => {
  // Simuler le chargement des données
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>
