import { ref } from 'vue'

export function useClimatiqApi() {
  const loading = ref(false)
  const error = ref(null)

  // Fonction pour calculer les émissions cloud
  const calculateCloudEmissions = async (params) => {
    loading.value = true
    error.value = null

    try {
      // Ici, vous feriez un appel à l'API Climatiq
      // Pour cet exemple, nous simulons une réponse

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Facteurs d'émission approximatifs (kg CO2e par heure)
      const emissionFactors = {
        aws: {
          't3.micro': 0.01,
          't3.small': 0.02,
          'm5.large': 0.05,
          'c5.xlarge': 0.08,
        },
        gcp: {
          'e2-micro': 0.009,
          'e2-small': 0.018,
          'n1-standard-2': 0.045,
          'n1-standard-4': 0.075,
        },
        azure: {
          Standard_B1s: 0.01,
          Standard_B2s: 0.02,
          Standard_D2s_v3: 0.05,
          Standard_D4s_v3: 0.08,
        },
      }

      // Facteurs régionaux (multiplicateurs)
      const regionFactors = {
        'us-east-1': 1.0,
        'us-west-1': 0.8,
        'eu-west-1': 0.7,
        'ap-southeast-1': 1.2,
        'us-central1': 1.0,
        'europe-west1': 0.7,
        'asia-east1': 1.2,
        eastus: 1.0,
        westeurope: 0.7,
        southeastasia: 1.2,
      }

      // Calculer les émissions
      const baseFactor = emissionFactors[params.provider][params.instanceType] || 0.03
      const regionFactor = regionFactors[params.region] || 1.0
      const cpuFactor = params.cpuUtilization / 100

      const emissions = baseFactor * regionFactor * cpuFactor * params.instanceCount * params.hours

      return emissions
    } catch (err) {
      error.value = err.message || 'Erreur lors du calcul des émissions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour calculer les émissions des vols
  const calculateFlightEmissions = async (params) => {
    loading.value = true
    error.value = null

    try {
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Facteur d'émission moyen pour les vols (kg CO2e par km)
      const emissionFactor = 0.2

      // Calculer les émissions
      const emissions = params.distance * emissionFactor * params.passengers

      // Ajuster en fonction de la classe
      const classFactors = {
        economy: 1.0,
        business: 2.0,
        first: 3.0,
      }

      return emissions * (classFactors[params.class] || 1.0)
    } catch (err) {
      error.value = err.message || 'Erreur lors du calcul des émissions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour calculer les émissions personnalisées
  const calculateCustomEmissions = async (params) => {
    loading.value = true
    error.value = null

    try {
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Facteur d'émission pour l'électricité (kg CO2e par kWh)
      // Varie selon le pays
      const countryFactors = {
        FR: 0.05, // France (beaucoup de nucléaire)
        DE: 0.35, // Allemagne
        US: 0.42, // États-Unis
        CN: 0.7, // Chine
        IN: 0.82, // Inde
      }

      const emissionFactor = countryFactors[params.country] || 0.42

      // Calculer les émissions
      return params.kwh * emissionFactor
    } catch (err) {
      error.value = err.message || 'Erreur lors du calcul des émissions'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    calculateCloudEmissions,
    calculateFlightEmissions,
    calculateCustomEmissions,
  }
}
