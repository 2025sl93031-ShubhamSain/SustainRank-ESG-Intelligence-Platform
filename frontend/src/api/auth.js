import api from './axiosInstance'

export async function loginUser(username, password) {
  try {
    const res = await api.post('/login/', { username, password })
    return res.data
  } catch (err) {
    return err?.response?.data ?? { success: false, error: 'Invalid username or password.' }
  }
}

export async function registerUser(data) {
  const res = await api.post('/register/', data)
  return res.data
}

export async function logoutUser() {
  const res = await api.post('/logout/')
  return res.data
}

export async function getProfile() {
  const res = await api.get('/page/result-page/')
  return res.data
}

export async function getSdgData() {
  const res = await api.get('/index/')
  return res.data
}
