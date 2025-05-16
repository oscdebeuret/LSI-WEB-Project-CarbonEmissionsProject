import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    loginWithGoogle(credential) {
      try {
        const payload = JSON.parse(atob(credential.split('.')[1]))
        this.user = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        }
        this.token = credential
      } catch (e) {
        console.error('Échec du décodage du token Google :', e)
      }
    },
    logout() {
      this.user = null
      this.token = null
    },
  },

  persist: true,
})
