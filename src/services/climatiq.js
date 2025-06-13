const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY

import axios from 'axios'

const apiBase = 'https://api.climatiq.io/compute/v1'
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
