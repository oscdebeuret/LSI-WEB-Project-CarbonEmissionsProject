import { ref } from 'vue'

export function useClimatiqApi() {
  const loading = ref(false)
  const error = ref(null)

  // Configuration de l'API Climatiq avec la variable d'environnement
  const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY
  const CLIMATIQ_BASE_URL = 'https://api.climatiq.io/data/v1'

  // Headers par défaut pour l'API Climatiq
  const getHeaders = () => ({
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json',
  })

  // Vérifier si l'API key est configurée
  const isConfigured = () => {
    if (!CLIMATIQ_API_KEY) {
      console.warn('Clé API Climatiq non configurée')
      return false
    }
    return true
  }

  // Rechercher des facteurs d'émission
  const getEmissionFactors = async (params = {}) => {
    if (!isConfigured()) {
      // Retourner des données de démonstration si pas de clé API
      return getDemoEmissionFactors(params)
    }

    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams({
        query: params.query || '',
        region: params.region || '',
        category: params.category || '',
        limit: params.limit || 20,
        ...params,
      })

      const response = await fetch(`${CLIMATIQ_BASE_URL}/emission-factors?${queryParams}`, {
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Erreur API Climatiq: ${response.status}`)
      }

      const data = await response.json()
      return data.results || []
    } catch (err) {
      error.value = err.message
      console.error("Erreur lors de la récupération des facteurs d'émission:", err)
      // Fallback vers les données de démo en cas d'erreur
      return getDemoEmissionFactors(params)
    } finally {
      loading.value = false
    }
  }

  // Données de démonstration pour le développement
  const getDemoEmissionFactors = (params) => {
    const demoFactors = {
      'cloud computing': [
        {
          id: 'demo-cloud-1',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, France',
          factor: 0.0571,
          factor_unit: 'kg CO2e/kWh',
          category: 'Electricity',
          region: 'FR',
        },
        {
          id: 'demo-cloud-2',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, Germany',
          factor: 0.4008,
          factor_unit: 'kg CO2e/kWh',
          category: 'Electricity',
          region: 'DE',
        },
      ],
      'passenger flight': [
        {
          id: 'demo-flight-1',
          activity_id: 'passenger_flight-route_type_domestic',
          name: 'Passenger flight, domestic',
          factor: 0.255,
          factor_unit: 'kg CO2e/passenger.km',
          category: 'Transport',
          region: 'GLOBAL',
        },
        {
          id: 'demo-flight-2',
          activity_id: 'passenger_flight-route_type_international',
          name: 'Passenger flight, international',
          factor: 0.195,
          factor_unit: 'kg CO2e/passenger.km',
          category: 'Transport',
          region: 'GLOBAL',
        },
      ],
      electricity: [
        {
          id: 'demo-elec-fr',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, France',
          factor: 57.1,
          factor_unit: 'g CO2e/kWh',
          category: 'Electricity',
          region: 'FR',
        },
        {
          id: 'demo-elec-de',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, Germany',
          factor: 400.8,
          factor_unit: 'g CO2e/kWh',
          category: 'Electricity',
          region: 'DE',
        },
        {
          id: 'demo-elec-us',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, United States',
          factor: 493.0,
          factor_unit: 'g CO2e/kWh',
          category: 'Electricity',
          region: 'US',
        },
        {
          id: 'demo-elec-cn',
          activity_id: 'electricity-energy_source_grid_mix',
          name: 'Grid electricity, China',
          factor: 681.0,
          factor_unit: 'g CO2e/kWh',
          category: 'Electricity',
          region: 'CN',
        },
      ],
    }

    // Rechercher dans les données de démo
    const query = params.query?.toLowerCase() || ''
    for (const [key, factors] of Object.entries(demoFactors)) {
      if (query.includes(key.split(' ')[0])) {
        return factors.filter((f) => !params.region || f.region === params.region)
      }
    }

    return demoFactors['electricity'] // Fallback par défaut
  }

  // Calculer les émissions avec l'API Climatiq
  const calculateEmissions = async (emissionData) => {
    if (!isConfigured()) {
      // Calcul de démonstration
      return calculateDemoEmissions(emissionData)
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${CLIMATIQ_BASE_URL}/estimate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(emissionData),
      })

      if (!response.ok) {
        throw new Error(`Erreur calcul Climatiq: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du calcul des émissions:', err)
      // Fallback vers le calcul de démo
      return calculateDemoEmissions(emissionData)
    } finally {
      loading.value = false
    }
  }

  // Calcul de démonstration
  const calculateDemoEmissions = (emissionData) => {
    const factor = emissionData.emission_factor?.factor || 0.4 // Facteur par défaut
    const params = emissionData.parameters || {}

    let total = 0

    // Calcul basique selon les paramètres
    if (params.energy) {
      total = params.energy * factor
    } else if (params.distance) {
      total = params.distance * factor * (params.passengers || 1)
    } else if (params.amount) {
      total = params.amount * factor
    }

    return {
      co2e: total,
      co2e_unit: 'kg',
      co2e_calculation_method: 'demo',
      emission_factor: emissionData.emission_factor,
    }
  }

  // Calculer les émissions cloud computing
  const calculateCloudEmissions = async (cloudData) => {
    try {
      // Rechercher les facteurs d'émission pour le cloud computing
      const factors = await getEmissionFactors({
        query: 'cloud computing electricity',
        region: cloudData.region || 'FR',
      })

      if (factors.length === 0) {
        throw new Error("Aucun facteur d'émission trouvé pour le cloud computing")
      }

      const factor = factors[0]

      // Calculer l'énergie totale consommée
      let totalEnergy = 0

      if (cloudData.cpu_hours) {
        totalEnergy += cloudData.cpu_hours * 0.1 // 0.1 kWh par heure de CPU
      }

      if (cloudData.memory_gb_hours) {
        totalEnergy += cloudData.memory_gb_hours * 0.01 // 0.01 kWh par GB-heure
      }

      if (cloudData.storage_gb_hours) {
        totalEnergy += cloudData.storage_gb_hours * 0.001 // 0.001 kWh par GB-heure de stockage
      }

      if (cloudData.network_gb) {
        totalEnergy += cloudData.network_gb * 0.005 // 0.005 kWh par GB transféré
      }

      // Préparer les données pour le calcul
      const estimateData = {
        emission_factor: factor,
        parameters: {
          energy: totalEnergy,
          energy_unit: 'kWh',
        },
      }

      return await calculateEmissions(estimateData)
    } catch (err) {
      console.error('Erreur calcul cloud:', err)
      throw err
    }
  }

  // Calculer les émissions de vol
  const calculateFlightEmissions = async (flightData) => {
    try {
      // Rechercher les facteurs d'émission pour les vols
      const factors = await getEmissionFactors({
        query: 'passenger flight',
        category: 'Transport',
      })

      if (factors.length === 0) {
        throw new Error("Aucun facteur d'émission trouvé pour les vols")
      }

      const factor = factors[0]

      // Préparer les données pour le calcul
      const estimateData = {
        emission_factor: factor,
        parameters: {
          distance: flightData.distance,
          distance_unit: 'km',
          passengers: flightData.passengers || 1,
        },
      }

      return await calculateEmissions(estimateData)
    } catch (err) {
      console.error('Erreur calcul vol:', err)
      throw err
    }
  }

  // Calculer les émissions personnalisées
  const calculateCustomEmissions = async (customData) => {
    try {
      // Rechercher les facteurs d'émission basés sur la requête personnalisée
      const factors = await getEmissionFactors({
        query: customData.activity_type,
        category: customData.category,
      })

      if (factors.length === 0) {
        throw new Error("Aucun facteur d'émission trouvé pour cette activité")
      }

      const factor = factors[0]

      // Préparer les données pour le calcul
      const estimateData = {
        emission_factor: factor,
        parameters: customData.parameters,
      }

      return await calculateEmissions(estimateData)
    } catch (err) {
      console.error('Erreur calcul personnalisé:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    isConfigured,
    getEmissionFactors,
    calculateEmissions,
    calculateCloudEmissions,
    calculateFlightEmissions,
    calculateCustomEmissions,
  }
}
