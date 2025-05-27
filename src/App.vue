<template>
  <Navbar />
  <div class="container mx-auto">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <AppFooter />
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

onAuthStateChanged(auth, (user) => {
  console.log('Connected user:', user)
})

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
