import api from './axiosInstance'

export async function calculateCarbon(data) {
  const res = await api.post('/carbon_calculator/', data)
  return res.data
}

export async function calculateEnergy(data) {
  const res = await api.post('/energy_calculator/', data)
  return res.data
}

export async function calculateWaste(data) {
  const res = await api.post('/waste_calculator/', data)
  return res.data
}

export async function calculateEevta(data) {
  const res = await api.post('/calculate_eevta_score/', data)
  return res.data
}

export async function calculateSustainability(data) {
  const res = await api.post('/sustainability_calculator/', data)
  return res.data
}
