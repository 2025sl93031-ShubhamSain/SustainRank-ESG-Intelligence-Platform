import api from './axiosInstance'

export async function getDashboardData() {
  const res = await api.get('/dashboard/')
  return res.data
}
