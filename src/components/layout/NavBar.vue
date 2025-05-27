<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-800 dark:text-white">CO₂ Calculator</span>
            </router-link>
          </div>

          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/dashboard" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path === '/dashboard' ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']">
              Tableau de bord
            </router-link>

            <router-link to="/calculator/cloud"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path.includes('/calculator') ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']">
              Calculateurs
            </router-link>

            <router-link to="/comparisons" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path === '/comparisons' ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200']">
              Comparaisons
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex-shrink-0">
            <button @click="toggleDarkMode"
              class="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

          <div class="ml-3 relative">
            <div>
              <button @click="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <img v-if="user?.photoURL" :src="user.photoURL" alt="Photo de profil" class="h-8 w-8 rounded-full" />
                <div v-else
                  class="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                  {{ userInitials }}
                </div>
              </button>
            </div>

            <div v-if="isProfileMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <router-link to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                @click="isProfileMenuOpen = false">
                Votre profil
              </router-link>
              <button @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <div class="-mr-2 flex items-center sm:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
            <svg :class="[isMobileMenuOpen ? 'hidden' : 'block', 'h-6 w-6']" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg :class="[isMobileMenuOpen ? 'block' : 'hidden', 'h-6 w-6']" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div :class="[isMobileMenuOpen ? 'block' : 'hidden', 'sm:hidden']">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/dashboard" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === '/dashboard' ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="isMobileMenuOpen = false">
          Tableau de bord
        </router-link>

        <router-link to="/calculator/cloud" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path.includes('/calculator') ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="isMobileMenuOpen = false">
          Calculateurs
        </router-link>

        <router-link to="/comparisons" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === '/comparisons' ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
          @click="isMobileMenuOpen = false">
          Comparaisons
        </router-link>
      </div>

      <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img v-if="user?.photoURL" :src="user.photoURL" alt="Photo de profil" class="h-10 w-10 rounded-full" />
            <div v-else
              class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
              {{ userInitials }}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800 dark:text-white">{{ user?.displayName }}</div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <router-link to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="isMobileMenuOpen = false">
            Votre profil
          </router-link>
          <button @click="logout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isMobileMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value?.displayName) return '?';

  return user.value.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const logout = async () => {
  try {
    await authStore.signOut();
    isProfileMenuOpen.value = false;
    isMobileMenuOpen.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
</script>
