import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [],
  }),

  actions: {
    add(result) {
      this.items.push(result)
    },

    remove(index) {
      this.items.splice(index, 1)
    },

    clear() {
      this.items = []
    },
  },
})
