<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="!calculation" class="text-center py-12">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Calcul non trouvé
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Le calcul demandé n'existe pas ou a été supprimé.
      </p>
      <router-link to="/dashboard"
        class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
        Retour au tableau de bord
      </router-link>
    </div>

    <div v-else>
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Détails du calcul
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            {{ calculation.description }}
          </p>
        </div>

        <div class="flex space-x-2">
          <button @click="toggleFavorite" class="px-4 py-2 rounded-lg transition-colors"
            :class="isFavorite ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
            {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </button>

          <router-link to="/dashboard"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors">
            Retour
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Résultat
            </h2>

            <div class="text-center">
              <p class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {{ calculation.emissions.toFixed(2) }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">kg CO₂e</p>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Équivalences
              </h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Km en voiture</span>
                  <span class="font-medium">{{ (calculation.emissions / 0.1).toFixed(0) }} km</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Jours de consommation foyer</span>
                  <span class="font-medium">{{ (calculation.emissions / 15).toFixed(1) }} jours</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Informations générales
            </h2>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type</span>
                <span class="font-medium capitalize">{{ getTypeLabel(calculation.type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Date</span>
                <span class="font-medium">{{ formatDate(calculation.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ID</span>
                <span class="font-medium text-sm">{{ calculation.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Détails techniques
            </h2>

            <div v-if="calculation.type === 'cloud'" class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Fournisseur</span>
                <span class="font-medium">{{ calculation.details.provider?.toUpperCase() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Région</span>
                <span class="font-medium">{{ calculation.details.region }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type d'instance</span>
                <span class="font-medium">{{ calculation.details.instanceType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Nombre d'instances</span>
                <span class="font-medium">{{ calculation.details.instanceCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Utilisation CPU</span>
                <span class="font-medium">{{ calculation.details.cpuUtilization }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Durée totale</span>
                <span class="font-medium">{{ calculation.details.totalHours }} heures</span>
              </div>
            </div>

            <div v-else-if="calculation.type === 'flight'" class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Trajet</span>
                <span class="font-medium">{{ calculation.details.origin }} → {{ calculation.details.destination
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type</span>
                <span class="font-medium">{{ calculation.details.tripType === 'one-way' ? 'Aller simple' :
                  'Aller-retour' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Classe</span>
                <span class="font-medium capitalize">{{ calculation.details.class }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Passagers</span>
                <span class="font-medium">{{ calculation.details.passengers }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Distance</span>
                <span class="font-medium">{{ calculation.details.distance?.toFixed(0) }} km</span>
              </div>
            </div>

            <div v-else-if="calculation.type === 'custom'" class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type d'activité</span>
                <span class="font-medium">{{ calculation.details.activityType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Consommation</span>
                <span class="font-medium">{{ calculation.details.kwh }} kWh</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Pays</span>
                <span class="font-medium">{{ calculation.details.country }}</span>
              </div>
              <div v-if="calculation.details.duration" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Durée</span>
                <span class="font-medium">{{ calculation.details.duration }} jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCalculationsStore } from '../stores/calculations';

const route = useRoute();
const calculationsStore = useCalculationsStore();

const loading = ref(true);
const calculation = ref(null);

const isFavorite = computed(() => {
  if (!calculation.value) return false;
  return calculationsStore.favorites.some(fav => fav.id === calculation.value.id);
});

const getTypeLabel = (type) => {
  const labels = {
    'cloud': 'Cloud',
    'flight': 'Vol',
    'custom': 'Personnalisé'
  };
  return labels[type] || type;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const toggleFavorite = async () => {
  if (!calculation.value) return;

  try {
    if (isFavorite.value) {
      await calculationsStore.removeFromFavorites(calculation.value.id);
    } else {
      await calculationsStore.addToFavorites(calculation.value);
    }
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
  }
};

const loadCalculation = async () => {
  const calculationId = route.params.id;

  try {
    await calculationsStore.fetchCalculations();

    // Chercher dans les calculs et les favoris
    const allCalculations = [
      ...calculationsStore.calculations,
      ...calculationsStore.favorites
    ];

    calculation.value = allCalculations.find(calc => calc.id === calculationId);
  } catch (error) {
    console.error('Erreur lors du chargement du calcul:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCalculation();
});
</script>
