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

export async function calculateTravelEmission({ travel_mode, origin, destination, car_type }) {
  const payload = {
    travel_mode,
    origin: { query: origin },
    destination: { query: destination },
  }

  if (travel_mode === 'car' && car_type) {
    payload.car_details = { car_type }
  }

  const response = await axios.post(apiTravelUrl, payload, {
    headers: { Authorization: token },
  })

  return response.data
}
