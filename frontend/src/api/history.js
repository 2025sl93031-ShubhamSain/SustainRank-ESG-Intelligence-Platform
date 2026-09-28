import api from './axiosInstance'

export async function getHistory() {
  const res = await api.get('/history/')
  return res.data
}
