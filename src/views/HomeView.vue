<template>
  <div class="relative overflow-hidden">
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

    <section class="relative z-10 flex flex-col items-center justify-center text-center min-h-[100vh] px-6">
      <div class="max-w-4xl mx-auto space-y-8">

        <div class="space-y-4">
          <h1 class="text-5xl md:text-7xl font-bold leading-tight">
            <span class="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Calculez votre
            </span>
            <br>
            <span class="text-gray-900 dark:text-white">
              empreinte carbone
            </span>
            <span class="inline-block ml-4 text-4xl md:text-6xl animate-bounce">🌱</span>
          </h1>

          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'impact de vos activités sur la planète et agissez pour un avenir plus durable.
            <span class="text-green-600 dark:text-green-400 font-semibold">Simple, précis, gratuit.</span>
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RouterLink to="/login"
            class="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
            <div class="relative flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Commencer gratuitement
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

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

/* Animation de rebond pour l'emoji */
@keyframes bounce {

  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -15px, 0);
  }

  70% {
    transform: translate3d(0, -7px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
