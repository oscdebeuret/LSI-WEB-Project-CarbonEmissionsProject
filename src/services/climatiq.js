const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY

import axios from 'axios'

const apiBase = 'https://api.climatiq.io/compute/v1'
const apiTravelUrl = 'https://preview.api.climatiq.io/travel/v1-preview1/distance'
const token = `Bearer ${CLIMATIQ_API_KEY}`

export async function fetchProviders() {
  const res = await axios.get(`${apiBase}/metadata`, {
    headers: { Authorization: token },
  })
  return res.data.cloud_providers
}

export async function calculateEmission({ provider, type, payload }) {
  let endpoint = ''
  switch (type) {
    case 'cpu':
      endpoint = 'cpu'
      break
    case 'memory':
      endpoint = 'memory'
      break
    case 'storage':
      endpoint = 'storage'
      break
    default:
      throw new Error('Type d’activité non supporté')
  }

  const url = `${apiBase}/${provider}/${endpoint}`
  const res = await axios.post(url, payload, {
    headers: { Authorization: token },
  })
  return res.data
}

export async function calculateTravelEmission({ travel_mode, origin, destination }) {
  const payload = {
    travel_mode,
    origin: { query: origin },
    destination: { query: destination },
  }

  const response = await axios.post(apiTravelUrl, payload, {
    headers: { Authorization: token },
  })

  return response.data
}

export async function calculateElectricityEmission({ region, energy }) {
  const res = await fetch('https://api.climatiq.io/energy/v1/electricity', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      region,
      source_set: 'core',
      amount: {
        energy,
        energy_unit: 'kWh',
      },
    }),
  })

  if (!res.ok) throw new Error('Erreur API Climatiq')
  const data = await res.json()
  return data.location?.consumption || data.market?.consumption || data
}
