const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY

export async function estimateCpuEmission(region, cpuCount) {
  const API_URL = 'https://api.climatiq.io/compute/v1/aws/cpu'

  const body = {
    region: region,
    cpu_count: cpuCount,
    average_vcpu_utilization: 0.5,
    duration: 2,
    duration_unit: "hour"
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erreur API Climatiq: ${response.status} - ${errorText}`)
  }

  return response.json()
}
