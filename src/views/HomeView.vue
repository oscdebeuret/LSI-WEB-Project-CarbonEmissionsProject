<template>
  <section class="flex flex-col items-center justify-center text-center min-h-[80vh]">
    <h2 class="text-3xl font-bold text-green-600 mb-4">Bienvenue sur Carbon Tracker 🌱</h2>
    <p class="text-gray-600 mb-6 max-w-xl">
      Calculez vos émissions de CO2 en quelques clics et découvrez leur impact sur la planète. Connectez-vous pour
      commencer.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <GoogleLoginButton />
      <MicrosoftLoginButton />
    </div>
  </section>
</template>

<script setup>
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import MicrosoftLoginButton from '@/components/MicrosoftLoginButton.vue'
</script>
