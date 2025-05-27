<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
      Tableau de bord
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Émissions totales" :value="totalEmissions" unit="kg CO₂e" icon="carbon" color="green" />
      <StatsCard title="Calculs sauvegardés" :value="savedCalculations.length" icon="save" color="blue" />
      <StatsCard title="Comparaisons" :value="comparisons.length" icon="chart" color="purple" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Émissions récentes
        </h2>
        <EmissionsChart :data="recentEmissionsData" />
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Comparaison par catégorie
        </h2>
        <CategoryComparisonChart :data="categoryData" />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          Calculs récents
        </h2>
        <router-link to="/calculator"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          Nouveau calcul
        </router-link>
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
                Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(calc, index) in recentCalculations" :key="index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ formatDate(calc.date) }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ calc.type }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ calc.description }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ calc.emissions.toFixed(2) }} kg
                CO₂e</td>
              <td class="px-4 py-3 text-sm">
                <button @click="viewDetails(calc)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                  Détails
                </button>
                <button @click="toggleFavorite(calc)"
                  class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                  {{ isFavorite(calc) ? 'Retirer' : 'Favoris' }}
                </button>
              </td>
            </tr>
            <tr v-if="recentCalculations.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                Aucun calcul récent. Commencez par créer un nouveau calcul.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCalculationsStore } from '@/stores/calculations';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import EmissionsChart from '@/components/charts/EmissionsChart.vue';
import CategoryComparisonChart from '@/components/charts/CategoryComparisonChart.vue';

const router = useRouter();
const calculationsStore = useCalculationsStore();

const recentCalculations = ref([]);
const savedCalculations = ref([]);
const comparisons = ref([]);

const recentEmissionsData = ref({
  labels: [],
  datasets: [
    {
      label: 'Émissions (kg CO₂e)',
      data: [],
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
      borderColor: 'rgba(52, 211, 153, 1)',
      borderWidth: 2,
      tension: 0.4
    }
  ]
});

const categoryData = ref({
  labels: ['Cloud', 'Vols', 'Personnalisé'],
  datasets: [
    {
      label: 'Émissions par catégorie (kg CO₂e)',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)',
        'rgba(139, 92, 246, 0.6)',
        'rgba(16, 185, 129, 0.6)'
      ],
      borderWidth: 1
    }
  ]
});

// Calcul des émissions totales
const totalEmissions = computed(() => {
  return savedCalculations.value.reduce((total, calc) => total + calc.emissions, 0);
});

// Formater la date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Vérifier si un calcul est en favoris
const isFavorite = (calculation) => {
  return savedCalculations.value.some(saved => saved.id === calculation.id);
};

// Ajouter/retirer des favoris
const toggleFavorite = async (calculation) => {
  if (isFavorite(calculation)) {
    await calculationsStore.removeFromFavorites(calculation.id);
  } else {
    await calculationsStore.addToFavorites(calculation);
  }

  // Recharger les données
  loadData();
};

// Voir les détails d'un calcul
const viewDetails = (calculation) => {
  router.push({
    name: 'calculation-details',
    params: { id: calculation.id }
  });
};

// Charger les données
const loadData = async () => {
  try {
    await calculationsStore.fetchCalculations();

    recentCalculations.value = calculationsStore.recentCalculations;
    savedCalculations.value = calculationsStore.savedCalculations;
    comparisons.value = calculationsStore.comparisons;

    // Mettre à jour les données des graphiques
    updateChartData();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
};

// Mettre à jour les données des graphiques
const updateChartData = () => {
  // Données pour le graphique des émissions récentes
  const recent = [...recentCalculations.value].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);

  recentEmissionsData.value = {
    labels: recent.map(calc => formatDate(calc.date)),
    datasets: [
      {
        label: 'Émissions (kg CO₂e)',
        data: recent.map(calc => calc.emissions),
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  // Données pour le graphique par catégorie
  const cloudEmissions = savedCalculations.value
    .filter(calc => calc.type === 'cloud')
    .reduce((total, calc) => total + calc.emissions, 0);

  const flightEmissions = savedCalculations.value
    .filter(calc => calc.type === 'flight')
    .reduce((total, calc) => total + calc.emissions, 0);

  const customEmissions = savedCalculations.value
    .filter(calc => calc.type === 'custom')
    .reduce((total, calc) => total + calc.emissions, 0);

  categoryData.value.datasets[0].data = [cloudEmissions, flightEmissions, customEmissions];
};

onMounted(() => {
  loadData();
});
</script>
