<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        Comparaisons d'Émissions
      </h1>
      <button @click="refreshData"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" :disabled="loading">
        <span v-if="loading">Actualisation...</span>
        <span v-else>Actualiser</span>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="calculations.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        Aucune donnée à comparer
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Vous devez avoir au moins 2 calculs sauvegardés pour effectuer des comparaisons.
      </p>
      <router-link to="/calculator/cloud"
        class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
        Créer un calcul
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <!-- Graphique de comparaison par type -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Émissions par Type d'Activité
        </h2>
        <div class="h-64">
          <ComparisonChart :data="comparisonByTypeData" type="bar" />
        </div>
      </div>

      <!-- Évolution temporelle -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Évolution des Émissions dans le Temps
        </h2>
        <div class="h-64">
          <ComparisonChart :data="timelineData" type="line" />
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Statistiques Globales
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Total des émissions</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ totalEmissions.toFixed(2) }} kg CO₂e</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Moyenne par calcul</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ averageEmissions.toFixed(2) }} kg CO₂e</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Calcul le plus élevé</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ maxEmissions.toFixed(2) }} kg CO₂e</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Calcul le plus faible</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ minEmissions.toFixed(2) }} kg CO₂e</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Répartition par Type
          </h3>
          <div class="space-y-3">
            <div v-for="(count, type) in typeDistribution" :key="type" class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400 capitalize">{{ getTypeLabel(type) }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ count }} calculs</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Équivalences Totales
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Km en voiture</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ (totalEmissions / 0.1).toFixed(0) }} km</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Jours de foyer</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ (totalEmissions / 15).toFixed(1) }}
                jours</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Arbres à planter</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ (totalEmissions / 22).toFixed(0) }}
                arbres</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau de comparaison détaillé -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            Comparaison Détaillée
          </h2>
          <div class="flex space-x-2">
            <select v-model="sortBy"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm">
              <option value="date">Trier par date</option>
              <option value="emissions">Trier par émissions</option>
              <option value="type">Trier par type</option>
            </select>
            <select v-model="filterType"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm">
              <option value="">Tous les types</option>
              <option value="cloud">Cloud</option>
              <option value="flight">Vols</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Émissions</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  % du total</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="calc in sortedAndFilteredCalculations" :key="calc.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ formatDate(calc.date) }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(calc.type)">
                    {{ getTypeLabel(calc.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ calc.description }}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ calc.emissions.toFixed(2) }}
                  kg CO₂e</td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ ((calc.emissions / totalEmissions) *
                  100).toFixed(1) }}%</td>
                <td class="px-4 py-3 text-sm">
                  <router-link :to="`/calculation/${calc.id}`"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Détails
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recommandations pour Réduire vos Émissions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="recommendation in recommendations" :key="recommendation.title"
            class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-medium text-gray-800 dark:text-white mb-2">{{ recommendation.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ recommendation.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalculationsStore } from '@/stores/calculations';
import ComparisonChart from '@/components/charts/ComparisonChart.vue';

const calculationsStore = useCalculationsStore();

const loading = ref(true);
const sortBy = ref('date');
const filterType = ref('');

const refreshData = async () => {
  loading.value = true;
  try {
    await calculationsStore.fetchCalculations();
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});

const calculations = computed(() => {
  return [...calculationsStore.calculations, ...calculationsStore.favorites];
});

// Statistiques calculées
const totalEmissions = computed(() => {
  return calculations.value.reduce((total, calc) => total + calc.emissions, 0);
});

const averageEmissions = computed(() => {
  return calculations.value.length > 0 ? totalEmissions.value / calculations.value.length : 0;
});

const maxEmissions = computed(() => {
  return calculations.value.length > 0 ? Math.max(...calculations.value.map(c => c.emissions)) : 0;
});

const minEmissions = computed(() => {
  return calculations.value.length > 0 ? Math.min(...calculations.value.map(c => c.emissions)) : 0;
});

const typeDistribution = computed(() => {
  const distribution = {};
  calculations.value.forEach(calc => {
    distribution[calc.type] = (distribution[calc.type] || 0) + 1;
  });
  return distribution;
});

// Données pour les graphiques
const comparisonByTypeData = computed(() => {
  const typeEmissions = {};
  calculations.value.forEach(calc => {
    typeEmissions[calc.type] = (typeEmissions[calc.type] || 0) + calc.emissions;
  });

  return {
    labels: Object.keys(typeEmissions).map(type => getTypeLabel(type)),
    datasets: [
      {
        label: 'Émissions (kg CO₂e)',
        data: Object.values(typeEmissions),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
});

const timelineData = computed(() => {
  const sortedCalcs = [...calculations.value].sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    labels: sortedCalcs.map(calc => formatDate(calc.date)),
    datasets: [
      {
        label: 'Émissions (kg CO₂e)',
        data: sortedCalcs.map(calc => calc.emissions),
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };
});

// Calculs triés et filtrés
const sortedAndFilteredCalculations = computed(() => {
  let filtered = calculations.value;

  if (filterType.value) {
    filtered = filtered.filter(calc => calc.type === filterType.value);
  }

  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'emissions':
        return b.emissions - a.emissions;
      case 'type':
        return a.type.localeCompare(b.type);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });
});

// Recommandations basées sur les données
const recommendations = computed(() => {
  const recs = [];

  if (typeDistribution.value.cloud > 0) {
    recs.push({
      title: 'Optimisez vos ressources cloud',
      description: 'Utilisez des instances plus petites quand possible et éteignez les ressources inutilisées.'
    });
  }

  if (typeDistribution.value.flight > 0) {
    recs.push({
      title: 'Compensez vos vols',
      description: 'Considérez la compensation carbone ou privilégiez les transports moins polluants pour les courtes distances.'
    });
  }

  if (typeDistribution.value.custom > 0) {
    recs.push({
      title: 'Réduisez votre consommation électrique',
      description: 'Passez aux énergies renouvelables et utilisez des appareils plus efficaces énergétiquement.'
    });
  }

  recs.push({
    title: 'Mesurez régulièrement',
    description: 'Continuez à mesurer vos émissions pour suivre vos progrès et identifier de nouvelles opportunités.'
  });

  return recs;
});

// Fonctions utilitaires
const getTypeLabel = (type) => {
  const labels = {
    'cloud': 'Cloud',
    'flight': 'Vol',
    'custom': 'Personnalisé'
  };
  return labels[type] || type;
};

const getTypeColor = (type) => {
  const colors = {
    'cloud': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'flight': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'custom': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  };
  return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>
