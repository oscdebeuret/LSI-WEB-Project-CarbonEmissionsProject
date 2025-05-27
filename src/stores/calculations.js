import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from './auth'

export const useCalculationsStore = defineStore('calculations', () => {
  // State
  const calculations = ref([])
  const loading = ref(false)
  const error = ref('')
  const lastCalculation = ref(null)
  const totalEmissions = ref(0)
  const monthlyEmissions = ref(0)
  const yearlyEmissions = ref(0)

  // Getters
  const getCalculationById = computed(() => {
    return (id) => calculations.value.find((calc) => calc.id === id)
  })

  const getCalculationsByType = computed(() => {
    return (type) => calculations.value.filter((calc) => calc.type === type)
  })

  const getCalculationsByDateRange = computed(() => {
    return (startDate, endDate) => {
      return calculations.value.filter((calc) => {
        const calcDate = new Date(calc.createdAt)
        return calcDate >= startDate && calcDate <= endDate
      })
    }
  })

  const getRecentCalculations = computed(() => {
    return calculations.value
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  })

  const getCalculationStats = computed(() => {
    const stats = {
      total: calculations.value.length,
      cloud: 0,
      flight: 0,
      custom: 0,
      totalEmissions: 0,
      averageEmissions: 0,
    }

    calculations.value.forEach((calc) => {
      stats[calc.type]++
      stats.totalEmissions += calc.result
    })

    stats.averageEmissions = stats.total > 0 ? stats.totalEmissions / stats.total : 0

    return stats
  })

  const getEmissionsByPeriod = computed(() => {
    return (period = 'month') => {
      const periodData = {}

      calculations.value.forEach((calc) => {
        const calcDate = new Date(calc.createdAt)
        let key

        switch (period) {
          case 'day':
            key = calcDate.toISOString().split('T')[0]
            break
          case 'week':
            var weekStart = new Date(calcDate)
            weekStart.setDate(calcDate.getDate() - calcDate.getDay())
            key = weekStart.toISOString().split('T')[0]
            break
          case 'month':
            key = `${calcDate.getFullYear()}-${String(calcDate.getMonth() + 1).padStart(2, '0')}`
            break
          case 'year':
            key = calcDate.getFullYear().toString()
            break
          default:
            key = calcDate.toISOString().split('T')[0]
        }

        if (!periodData[key]) {
          periodData[key] = {
            date: key,
            emissions: 0,
            count: 0,
            types: { cloud: 0, flight: 0, custom: 0 },
          }
        }

        periodData[key].emissions += calc.result
        periodData[key].count++
        periodData[key].types[calc.type]++
      })

      return Object.values(periodData).sort((a, b) => a.date.localeCompare(b.date))
    }
  })

  // Actions
  const loadCalculations = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = ''

    try {
      const q = query(
        collection(db, 'calculations'),
        where('userId', '==', authStore.user.uid),
        orderBy('createdAt', 'desc'),
      )

      const querySnapshot = await getDocs(q)
      calculations.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }))

      updateStats()
    } catch (err) {
      error.value = 'Erreur lors du chargement des calculs: ' + err.message
      console.error('Erreur loadCalculations:', err)
    } finally {
      loading.value = false
    }
  }

  const addCalculation = async (calculationData) => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      throw new Error('Utilisateur non connecté')
    }

    loading.value = true
    error.value = ''

    try {
      const newCalculation = {
        ...calculationData,
        userId: authStore.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: Date.now().toString(), // ID temporaire
      }

      // Ajouter à Firestore
      const docRef = await addDoc(collection(db, 'calculations'), newCalculation)

      // Mettre à jour l'ID avec celui de Firestore
      newCalculation.id = docRef.id
      newCalculation.createdAt = new Date()
      newCalculation.updatedAt = new Date()

      // Ajouter au store local
      calculations.value.unshift(newCalculation)
      lastCalculation.value = newCalculation

      updateStats()

      return newCalculation
    } catch (err) {
      error.value = "Erreur lors de l'ajout du calcul: " + err.message
      console.error('Erreur addCalculation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCalculation = async (id, updates) => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      throw new Error('Utilisateur non connecté')
    }

    loading.value = true
    error.value = ''

    try {
      const calculationRef = doc(db, 'calculations', id)
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(calculationRef, updateData)

      // Mettre à jour le store local
      const index = calculations.value.findIndex((calc) => calc.id === id)
      if (index !== -1) {
        calculations.value[index] = {
          ...calculations.value[index],
          ...updates,
          updatedAt: new Date(),
        }
      }

      updateStats()
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour: ' + err.message
      console.error('Erreur updateCalculation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCalculation = async (id) => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      throw new Error('Utilisateur non connecté')
    }

    loading.value = true
    error.value = ''

    try {
      await deleteDoc(doc(db, 'calculations', id))

      // Supprimer du store local
      const index = calculations.value.findIndex((calc) => calc.id === id)
      if (index !== -1) {
        calculations.value.splice(index, 1)
      }

      updateStats()
    } catch (err) {
      error.value = 'Erreur lors de la suppression: ' + err.message
      console.error('Erreur deleteCalculation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateCalculation = async (id) => {
    const calculation = getCalculationById.value(id)
    if (!calculation) {
      throw new Error('Calcul non trouvé')
    }

    const duplicatedCalculation = {
      type: calculation.type,
      parameters: { ...calculation.parameters },
      result: calculation.result,
      description: `${calculation.description || ''} (copie)`,
      category: calculation.category,
      unit: calculation.unit,
    }

    return await addCalculation(duplicatedCalculation)
  }

  const exportCalculations = (format = 'json', filters = {}) => {
    let filteredCalculations = calculations.value

    // Appliquer les filtres
    if (filters.type) {
      filteredCalculations = filteredCalculations.filter((calc) => calc.type === filters.type)
    }
    if (filters.startDate) {
      filteredCalculations = filteredCalculations.filter(
        (calc) => new Date(calc.createdAt) >= new Date(filters.startDate),
      )
    }
    if (filters.endDate) {
      filteredCalculations = filteredCalculations.filter(
        (calc) => new Date(calc.createdAt) <= new Date(filters.endDate),
      )
    }

    if (format === 'csv') {
      return exportToCSV(filteredCalculations)
    } else {
      return JSON.stringify(filteredCalculations, null, 2)
    }
  }

  const exportToCSV = (data) => {
    const headers = [
      'ID',
      'Type',
      'Date de création',
      'Résultat (kg CO₂e)',
      'Description',
      'Paramètres',
    ]

    const rows = data.map((calc) => [
      calc.id,
      calc.type,
      new Date(calc.createdAt).toLocaleDateString('fr-FR'),
      calc.result.toFixed(2),
      calc.description || '',
      JSON.stringify(calc.parameters),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }

  const getEmissionsTrend = (period = 30) => {
    const now = new Date()
    const periodStart = new Date(now.getTime() - period * 24 * 60 * 60 * 1000)

    const currentPeriodEmissions = calculations.value
      .filter((calc) => new Date(calc.createdAt) >= periodStart)
      .reduce((total, calc) => total + calc.result, 0)

    const previousPeriodStart = new Date(periodStart.getTime() - period * 24 * 60 * 60 * 1000)
    const previousPeriodEmissions = calculations.value
      .filter((calc) => {
        const calcDate = new Date(calc.createdAt)
        return calcDate >= previousPeriodStart && calcDate < periodStart
      })
      .reduce((total, calc) => total + calc.result, 0)

    if (previousPeriodEmissions === 0) return 0
    return ((currentPeriodEmissions - previousPeriodEmissions) / previousPeriodEmissions) * 100
  }

  const getTopEmissionSources = (limit = 5) => {
    const sourceMap = new Map()

    calculations.value.forEach((calc) => {
      const key = `${calc.type}-${JSON.stringify(calc.parameters)}`
      if (!sourceMap.has(key)) {
        sourceMap.set(key, {
          type: calc.type,
          parameters: calc.parameters,
          totalEmissions: 0,
          count: 0,
          averageEmissions: 0,
        })
      }

      const source = sourceMap.get(key)
      source.totalEmissions += calc.result
      source.count++
      source.averageEmissions = source.totalEmissions / source.count
    })

    return Array.from(sourceMap.values())
      .sort((a, b) => b.totalEmissions - a.totalEmissions)
      .slice(0, limit)
  }

  const updateStats = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    totalEmissions.value = calculations.value.reduce((total, calc) => total + calc.result, 0)

    monthlyEmissions.value = calculations.value
      .filter((calc) => {
        const calcDate = new Date(calc.createdAt)
        return calcDate.getMonth() === currentMonth && calcDate.getFullYear() === currentYear
      })
      .reduce((total, calc) => total + calc.result, 0)

    yearlyEmissions.value = calculations.value
      .filter((calc) => new Date(calc.createdAt).getFullYear() === currentYear)
      .reduce((total, calc) => total + calc.result, 0)
  }

  const subscribeToCalculations = () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const q = query(
      collection(db, 'calculations'),
      where('userId', '==', authStore.user.uid),
      orderBy('createdAt', 'desc'),
    )

    return onSnapshot(
      q,
      (querySnapshot) => {
        calculations.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))
        updateStats()
      },
      (err) => {
        error.value = 'Erreur de synchronisation: ' + err.message
        console.error('Erreur subscription:', err)
      },
    )
  }

  const clearCalculations = () => {
    calculations.value = []
    lastCalculation.value = null
    totalEmissions.value = 0
    monthlyEmissions.value = 0
    yearlyEmissions.value = 0
    error.value = ''
  }

  const searchCalculations = (searchTerm) => {
    if (!searchTerm) return calculations.value

    const term = searchTerm.toLowerCase()
    return calculations.value.filter(
      (calc) =>
        calc.type.toLowerCase().includes(term) ||
        calc.description?.toLowerCase().includes(term) ||
        JSON.stringify(calc.parameters).toLowerCase().includes(term),
    )
  }

  const getCalculationsByCategory = (category) => {
    return calculations.value.filter((calc) => calc.category === category)
  }

  const getEmissionsComparison = (comparisonType = 'month') => {
    const now = new Date()
    let currentPeriod, previousPeriod

    switch (comparisonType) {
      case 'week':
        currentPeriod = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousPeriod = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        currentPeriod = new Date(now.getFullYear(), now.getMonth(), 1)
        previousPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        break
      case 'year':
        currentPeriod = new Date(now.getFullYear(), 0, 1)
        previousPeriod = new Date(now.getFullYear() - 1, 0, 1)
        break
      default:
        currentPeriod = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousPeriod = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    }

    const currentEmissions = calculations.value
      .filter((calc) => new Date(calc.createdAt) >= currentPeriod)
      .reduce((total, calc) => total + calc.result, 0)

    const previousEmissions = calculations.value
      .filter((calc) => {
        const calcDate = new Date(calc.createdAt)
        return calcDate >= previousPeriod && calcDate < currentPeriod
      })
      .reduce((total, calc) => total + calc.result, 0)

    const change =
      previousEmissions > 0 ? ((currentEmissions - previousEmissions) / previousEmissions) * 100 : 0

    return {
      current: currentEmissions,
      previous: previousEmissions,
      change: change,
      trend: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
    }
  }

  return {
    // State
    calculations,
    loading,
    error,
    lastCalculation,
    totalEmissions,
    monthlyEmissions,
    yearlyEmissions,

    // Getters
    getCalculationById,
    getCalculationsByType,
    getCalculationsByDateRange,
    getRecentCalculations,
    getCalculationStats,
    getEmissionsByPeriod,

    // Actions
    loadCalculations,
    addCalculation,
    updateCalculation,
    deleteCalculation,
    duplicateCalculation,
    exportCalculations,
    getEmissionsTrend,
    getTopEmissionSources,
    subscribeToCalculations,
    clearCalculations,
    searchCalculations,
    getCalculationsByCategory,
    getEmissionsComparison,
  }
})
