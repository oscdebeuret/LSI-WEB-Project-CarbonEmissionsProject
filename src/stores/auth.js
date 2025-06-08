import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
} from 'firebase/auth'
import { app } from '@/auth/firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userProfile: (state) => state.user,
  },

  actions: {
    initAuth() {
      const auth = getAuth(app)

      onAuthStateChanged(auth, (user) => {
        this.loading = false

        if (user) {
          this.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        } else {
          this.user = null
        }
      })
    },

    async signInWithGoogle(router, redirectTo = '/dashboard') {
      this.loading = true
      this.error = null

      try {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        const result = await signInWithPopup(auth, provider)

        this.user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }

        router.push(redirectTo)
        return result.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signInWithMicrosoft(router, redirectTo = '/dashboard') {
      this.loading = true
      this.error = null

      try {
        const auth = getAuth(app)
        const provider = new OAuthProvider('microsoft.com')
        const result = await signInWithPopup(auth, provider)

        this.user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }

        router.push(redirectTo)
        return result.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut(router) {
      const auth = getAuth(app)

      try {
        await signOut(auth)
        this.user = null

        router.push('/')
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

  },

  persist: {
    key: 'auth-store',
    storage: localStorage,
    paths: ['user'],
  },
})
