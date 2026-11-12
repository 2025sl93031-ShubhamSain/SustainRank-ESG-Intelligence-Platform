import api from './axiosInstance'

export async function getHistory() {
  const res = await api.get('/history/')
  return res.data
}

export async function deleteHistory(id) {
  await api.delete(`/history/${id}/`)
}
