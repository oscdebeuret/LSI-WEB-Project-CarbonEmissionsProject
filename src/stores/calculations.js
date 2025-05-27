import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'

export const useCalculationsStore = defineStore('calculations', {
  state: () => ({
    calculations: [],
    favorites: [],
    loading: false,
    error: null,
  }),

  getters: {
    recentCalculations: (state) => {
      return [...state.calculations]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    },

    savedCalculations: (state) => {
      return state.favorites
    },

    comparisons: (state) => {
      // Grouper les calculs par type pour les comparaisons
      const comparisons = []
      const types = [...new Set(state.favorites.map((calc) => calc.type))]

      types.forEach((type) => {
        const typeCalculations = state.favorites.filter((calc) => calc.type === type)
        if (typeCalculations.length > 1) {
          comparisons.push({
            id: `comparison-${type}`,
            type,
            calculations: typeCalculations,
          })
        }
      })

      return comparisons
    },
  },

  actions: {
    async fetchCalculations() {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          throw new Error('Utilisateur non connecté')
        }

        // Récupérer les calculs récents
        const calculationsRef = collection(db, 'calculations')
        const q = query(calculationsRef, where('userId', '==', authStore.user.uid))
        const querySnapshot = await getDocs(q)

        this.calculations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Récupérer les favoris
        const favoritesRef = collection(db, 'favorites')
        const favoritesQuery = query(favoritesRef, where('userId', '==', authStore.user.uid))
        const favoritesSnapshot = await getDocs(favoritesQuery)

        this.favorites = favoritesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la récupération des calculs:', error)
      } finally {
        this.loading = false
      }
    },

    async addCalculation(calculation) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          throw new Error('Utilisateur non connecté')
        }

        const calculationWithUser = {
          ...calculation,
          userId: authStore.user.uid,
        }

        const docRef = await addDoc(collection(db, 'calculations'), calculationWithUser)

        // Ajouter le calcul à l'état local
        this.calculations.push({
          id: docRef.id,
          ...calculationWithUser,
        })

        return docRef.id
      } catch (error) {
        this.error = error.message
        console.error("Erreur lors de l'ajout du calcul:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(calculation) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          throw new Error('Utilisateur non connecté')
        }

        const favoriteWithUser = {
          ...calculation,
          userId: authStore.user.uid,
        }

        const docRef = await addDoc(collection(db, 'favorites'), favoriteWithUser)

        // Ajouter le favori à l'état local
        this.favorites.push({
          id: docRef.id,
          ...favoriteWithUser,
        })

        return docRef.id
      } catch (error) {
        this.error = error.message
        console.error("Erreur lors de l'ajout aux favoris:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromFavorites(id) {
      this.loading = true
      this.error = null

      try {
        await deleteDoc(doc(db, 'favorites', id))

        // Supprimer le favori de l'état local
        this.favorites = this.favorites.filter((fav) => fav.id !== id)
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la suppression du favori:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  persist: {
    key: 'calculations-store',
    storage: localStorage,
    paths: ['calculations', 'favorites'],
  },
})
