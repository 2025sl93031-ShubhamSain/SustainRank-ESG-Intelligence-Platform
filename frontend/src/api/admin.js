import api from './axiosInstance'

export async function getLeaderboard() {
  const res = await api.get('/admin/leaderboard/')
  return res.data
}
