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

      <!-- Préférences et paramètres -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Préférences générales -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Préférences
          </h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thème
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Choisissez votre thème préféré
                </p>
              </div>
              <select v-model="preferences.theme" @change="updateTheme"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pays par défaut
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Utilisé pour les calculs d'émissions
                </p>
              </div>
              <select v-model="preferences.defaultCountry" @change="savePreferences"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                <option value="FR">France</option>
                <option value="DE">Allemagne</option>
                <option value="IT">Italie</option>
                <option value="ES">Espagne</option>
                <option value="GB">Royaume-Uni</option>
                <option value="US">États-Unis</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notifications par email
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Recevoir des conseils pour réduire vos émissions
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="preferences.emailNotifications" @change="savePreferences"
                  class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sauvegarde automatique
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Sauvegarder automatiquement les calculs
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="preferences.autoSave" @change="savePreferences" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Objectifs environnementaux -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Objectifs Environnementaux
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Objectif mensuel d'émissions (kg CO₂e)
              </label>
              <input v-model.number="preferences.monthlyGoal" @change="savePreferences" type="number" min="0" step="10"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Votre moyenne actuelle : {{ monthlyAverage.toFixed(1) }} kg CO₂e/mois
              </p>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Progrès vers l'objectif
              </h3>
              <div class="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div class="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(goalProgress, 100)}%` }"></div>
              </div>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                {{ goalProgress.toFixed(1) }}% de l'objectif atteint ce mois
              </p>
            </div>
          </div>
        </div>

        <!-- Actions du compte -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Gestion du Compte
          </h2>

          <div class="space-y-4">
            <button @click="exportData"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Exporter mes données
            </button>

            <button @click="clearAllData"
              class="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
              Effacer toutes les données
            </button>

            <button @click="deleteAccount"
              class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Supprimer le compte
            </button>
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCalculationsStore } from '../stores/calculations';

const router = useRouter();
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

const monthlyAverage = computed(() => {
  const allCalculations = [...calculationsStore.calculations, ...calculationsStore.favorites];
  if (allCalculations.length === 0) return 0;

  // Calculer la moyenne mensuelle basée sur les 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCalculations = allCalculations.filter(calc =>
    new Date(calc.date) >= thirtyDaysAgo
  );

  const recentEmissions = recentCalculations.reduce((total, calc) => total + calc.emissions, 0);
  return recentEmissions;
});

const goalProgress = computed(() => {
  if (preferences.value.monthlyGoal === 0) return 0;
  return Math.max(0, 100 - (monthlyAverage.value / preferences.value.monthlyGoal) * 100);
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

// Mettre à jour le thème
const updateTheme = () => {
  const theme = preferences.value.theme;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  } else {
    // Auto - suivre les préférences système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.removeItem('darkMode');
  }

  savePreferences();
};

// Sauvegarder les préférences
const savePreferences = () => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences.value));
};

// Charger les préférences
const loadPreferences = () => {
  const saved = localStorage.getItem('userPreferences');
  if (saved) {
    preferences.value = { ...preferences.value, ...JSON.parse(saved) };
  }
};

// Exporter les données
const exportData = () => {
  const allData = {
    user: user.value,
    calculations: calculationsStore.calculations,
    favorites: calculationsStore.favorites,
    preferences: preferences.value,
    exportDate: new Date().toISOString()
  };

  const dataStr = JSON.stringify(allData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `co2-calculator-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

// Effacer toutes les données
const clearAllData = () => {
  confirmModal.value = {
    title: 'Effacer toutes les données',
    message: 'Êtes-vous sûr de vouloir effacer tous vos calculs et favoris ? Cette action est irréversible.',
    action: async () => {
      try {
        // Ici, vous appelleriez les méthodes pour supprimer les données de Firestore
        calculationsStore.calculations = [];
        calculationsStore.favorites = [];
        localStorage.removeItem('calculations-store');
        showConfirmModal.value = false;
        alert('Toutes les données ont été effacées.');
      } catch (error) {
        console.error('Erreur lors de la suppression des données:', error);
        alert('Erreur lors de la suppression des données.');
      }
    }
  };
  showConfirmModal.value = true;
};

// Supprimer le compte
const deleteAccount = () => {
  confirmModal.value = {
    title: 'Supprimer le compte',
    message: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Toutes vos données seront perdues.',
    action: async () => {
      try {
        await authStore.signOut();
        // Ici, vous appelleriez une fonction pour supprimer le compte Firebase
        showConfirmModal.value = false;
        router.push('/login');
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        alert('Erreur lors de la suppression du compte.');
      }
    }
  };
  showConfirmModal.value = true;
};

onMounted(async () => {
  loadPreferences();
  await calculationsStore.fetchCalculations();
});
</script>
