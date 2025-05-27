<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Particules d'arrière-plan -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000">
      </div>
      <div
        class="absolute top-40 left-40 w-80 h-80 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000">
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau de bord 🌱
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Bienvenue {{ userName }}, suivez et réduisez votre empreinte carbone
            </p>
          </div>

          <div class="mt-4 md:mt-0 flex items-center space-x-4">
            <!-- Sélecteur de période -->
            <select v-model="selectedPeriod"
              class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">3 derniers mois</option>
              <option value="365">Dernière année</option>
            </select>

            <!-- Bouton d'export -->
            <button
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total CO₂</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalCO2 }}T</p>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                -12% ce mois
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Calculs ce mois -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Calculs ce mois</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ monthlyCalculations }}</p>
              <p class="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                +23% vs mois dernier
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Objectif mensuel -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Objectif mensuel</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ monthlyGoal }}T</p>
              <div class="mt-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Progression</span>
                  <span class="text-green-600 dark:text-green-400 font-medium">{{ goalProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div class="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: goalProgress + '%' }"></div>
                </div>
              </div>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Score écologique -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Score écologique</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ ecoScore }}/100</p>
              <p class="text-sm text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Bon niveau
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des calculateurs -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Calculateurs CO₂</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Cloud Computing -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            @click="navigateToCalculator('cloud')">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Cloud Computing</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Calculez les émissions de vos activités cloud : CPU, mémoire, stockage et transferts de données.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">{{ cloudCalculations }}
                calculs</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Flights -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            @click="navigateToCalculator('flight')">
            <div
              class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Vols</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Estimez l'impact carbone de vos voyages en avion selon la distance et la classe de voyage.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">{{ flightCalculations }}
                calculs</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Custom Activities -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            @click="navigateToCalculator('custom')">
            <div
              class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Activités personnalisées</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Créez vos propres calculs pour des activités spécifiques avec des facteurs d'émission personnalisés.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">{{ customCalculations }}
                calculs</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques et comparaisons -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Graphique des émissions dans le temps -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Évolution des émissions</h3>
            <div class="flex items-center space-x-2">
              <button v-for="period in chartPeriods" :key="period.value" @click="selectedChartPeriod = period.value"
                :class="[
                  'px-3 py-1 text-sm rounded-lg transition-colors duration-200',
                  selectedChartPeriod === period.value
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]">
                {{ period.label }}
              </button>
            </div>
          </div>

          <!-- Placeholder pour le graphique -->
          <div
            class="h-64 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-gray-600 dark:text-gray-400">Graphique des émissions CO₂</p>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Données des {{ selectedChartPeriod }} derniers
                jours</p>
            </div>
          </div>

          <!-- Légende -->
          <div class="flex items-center justify-center space-x-6 mt-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Cloud</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Vols</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Autres</span>
            </div>
          </div>
        </div>

        <!-- Comparaisons par pays -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Comparaison par pays</h3>
            <select v-model="selectedCountryComparison"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
              <option value="per_capita">Par habitant</option>
              <option value="total">Total national</option>
              <option value="intensity">Intensité carbone</option>
            </select>
          </div>

          <!-- Liste des pays avec barres de progression -->
          <div class="space-y-4">
            <div v-for="country in countryComparisons" :key="country.code" class="flex items-center">
              <div class="flex items-center w-24">
                <span class="text-2xl mr-2">{{ country.flag }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ country.name }}</span>
              </div>
              <div class="flex-1 mx-4">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div class="h-3 rounded-full transition-all duration-500" :class="country.color"
                    :style="{ width: country.percentage + '%' }"></div>
                </div>
              </div>
              <div class="w-16 text-right">
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ country.value }}T</span>
              </div>
            </div>
          </div>

          <!-- Votre position -->
          <div
            class="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Votre empreinte</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Position mondiale</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ totalCO2 }}T</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ userRanking }}e position</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Activité récente</h3>
          <RouterLink to="/calculations"
            class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors duration-200">
            Voir tout
          </RouterLink>
        </div>

        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id"
            class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mr-4', activity.iconBg]">
              <component :is="activity.icon" class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">{{ activity.co2 }} kg CO₂</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Conseils et recommandations -->
      <div class="mt-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold mb-2">💡 Conseil du jour</h3>
            <p class="text-green-100">Réduisez votre impact environnemental avec ces actions simples</p>
          </div>
          <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="tip in dailyTips" :key="tip.id" class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div class="text-3xl mb-3">{{ tip.icon }}</div>
            <h4 class="font-bold mb-2">{{ tip.title }}</h4>
            <p class="text-green-100 text-sm leading-relaxed">{{ tip.description }}</p>
            <div class="mt-4 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>{{ tip.impact }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Données utilisateur
const userName = computed(() => authStore.user?.displayName || 'Utilisateur');

// Données du dashboard (valeurs en dur)
const selectedPeriod = ref(30);
const selectedChartPeriod = ref(30);
const selectedCountryComparison = ref('per_capita');

// Statistiques principales
const totalCO2 = ref(8.7);
const monthlyCalculations = ref(24);
const monthlyGoal = ref(6.5);
const goalProgress = ref(75);
const ecoScore = ref(78);

// Compteurs par type de calcul
const cloudCalculations = ref(12);
const flightCalculations = ref(8);
const customCalculations = ref(4);

// Périodes pour les graphiques
const chartPeriods = [
  { label: '7J', value: 7 },
  { label: '30J', value: 30 },
  { label: '3M', value: 90 },
  { label: '1A', value: 365 }
];

// Comparaisons par pays
const countryComparisons = ref([
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', value: 37.3, percentage: 100, color: 'bg-red-500' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼', value: 25.2, percentage: 68, color: 'bg-orange-500' },
  { code: 'AE', name: 'EAU', flag: '🇦🇪', value: 22.4, percentage: 60, color: 'bg-yellow-500' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', value: 16.1, percentage: 43, color: 'bg-blue-500' },
  { code: 'FR', name: 'France', flag: '🇫🇷', value: 4.6, percentage: 12, color: 'bg-green-500' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', value: 1.9, percentage: 5, color: 'bg-teal-500' }
]);

const userRanking = ref(45);

// Activités récentes
const recentActivities = ref([
  {
    id: 1,
    title: 'Vol Paris → New York',
    description: 'Classe économique, aller simple',
    co2: 986,
    date: 'Il y a 2 jours',
    icon: 'svg',
    iconBg: 'bg-purple-500'
  },
  {
    id: 2,
    title: 'Serveur cloud AWS',
    description: '24h de calcul intensif',
    co2: 45,
    date: 'Il y a 3 jours',
    icon: 'svg',
    iconBg: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'Transport en commun',
    description: 'Trajet domicile-travail',
    co2: 12,
    date: 'Il y a 5 jours',
    icon: 'svg',
    iconBg: 'bg-green-500'
  }
]);

// Conseils du jour
const dailyTips = ref([
  {
    id: 1,
    icon: '💻',
    title: 'Optimisez votre cloud',
    description: 'Éteignez vos instances inutilisées et utilisez des régions alimentées par des énergies renouvelables.',
    impact: 'Jusqu\'à -40% d\'émissions'
  },
  {
    id: 2,
    icon: '✈️',
    title: 'Voyagez responsable',
    description: 'Privilégiez les vols directs et compensez vos émissions avec des projets certifiés.',
    impact: 'Jusqu\'à -25% d\'émissions'
  },
  {
    id: 3,
    icon: '🌱',
    title: 'Mesurez régulièrement',
    description: 'Suivez vos émissions chaque semaine pour identifier les sources principales.',
    impact: 'Conscience +100%'
  }
]);

// Navigation vers les calculateurs
const navigateToCalculator = (type) => {
  router.push(`/calculator/${type}`);
};
</script>

<style scoped>
/* Animations personnalisées */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
