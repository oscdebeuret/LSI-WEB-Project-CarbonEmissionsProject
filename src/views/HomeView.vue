<template>
  <section class="flex flex-col items-center justify-center text-center min-h-[80vh]">
    <h2 class="text-3xl font-bold text-green-600 mb-4">Bienvenue sur Carbon Tracker 🌱</h2>
    <p class="text-gray-600 mb-6 max-w-xl">
      Calculez vos émissions de CO2 en quelques clics et découvrez leur impact sur la planète. Connectez-vous pour
      commencer.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <RouterLink to="/login" type="button"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Se connecter avec Google</RouterLink>
    </div>
  </section>
</template>
