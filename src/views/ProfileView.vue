<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Profil Utilisateur
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations utilisateur -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div class="text-center">
            <div class="relative inline-block">
              <img v-if="user?.photoURL" :src="user.photoURL" alt="Photo de profil"
                class="w-24 h-24 rounded-full mx-auto mb-4" />
              <div v-else
                class="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {{ userInitials }}
              </div>
            </div>

            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {{ user?.displayName || 'Utilisateur' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ user?.email }}
            </p>

            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p>Membre depuis</p>
              <p class="font-medium">{{ formatJoinDate() }}</p>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Statistiques Rapides
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Calculs effectués</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalCalculations }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Favoris sauvegardés</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalFavorites }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Émissions totales</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalEmissions.toFixed(1) }} kg CO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {{ confirmModal.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ confirmModal.message }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showConfirmModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Annuler
          </button>
          <button @click="confirmModal.action"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCalculationsStore } from '../stores/calculations';

const authStore = useAuthStore();
const calculationsStore = useCalculationsStore();

const showConfirmModal = ref(false);
const confirmModal = ref({
  title: '',
  message: '',
  action: null
});

const preferences = ref({
  theme: 'auto',
  defaultCountry: 'FR',
  emailNotifications: true,
  autoSave: true,
  monthlyGoal: 100
});

// Utilisateur connecté
const user = computed(() => authStore.user);

// Initiales de l'utilisateur
const userInitials = computed(() => {
  if (!user.value?.displayName) return '?';

  return user.value.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Statistiques utilisateur
const totalCalculations = computed(() => calculationsStore.calculations.length);
const totalFavorites = computed(() => calculationsStore.favorites.length);
const totalEmissions = computed(() => {
  const allCalculations = [...calculationsStore.calculations, ...calculationsStore.favorites];
  return allCalculations.reduce((total, calc) => total + calc.emissions, 0);
});

// Formater la date d'inscription
const formatJoinDate = () => {
  // Simuler une date d'inscription (en réalité, vous pourriez la stocker dans Firestore)
  const joinDate = new Date();
  joinDate.setMonth(joinDate.getMonth() - 2); // Il y a 2 mois

  return joinDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  });
};

const loadPreferences = () => {
  const saved = localStorage.getItem('userPreferences');
  if (saved) {
    preferences.value = { ...preferences.value, ...JSON.parse(saved) };
  }
};

onMounted(async () => {
  loadPreferences();
  await calculationsStore.fetchCalculations();
});
</script>
