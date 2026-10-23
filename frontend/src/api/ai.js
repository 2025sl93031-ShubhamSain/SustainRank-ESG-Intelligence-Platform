import api from './axiosInstance'

export async function getResultRecommendations(type, score, industry, details = {}) {
  const res = await api.post('/ai/result', { type, score, industry, details })
  return res.data.recommendations || []
}

export async function getDashboardRecommendations(rank, totalCompanies, sustainabilityScore, environmentalScore, socialScore, governanceScore, industry) {
  const res = await api.post('/ai/dashboard', {
    rank,
    totalCompanies,
    sustainabilityScore,
    environmentalScore,
    socialScore,
    governanceScore,
    industry,
  })
  return res.data.recommendations || []
}
