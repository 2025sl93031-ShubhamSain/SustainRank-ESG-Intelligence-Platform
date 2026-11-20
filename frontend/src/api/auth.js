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
  try {
    const res = await api.post('/register/', data)
    return res.data
  } catch (err) {
    const msg = err.response?.data?.error || 'Registration failed. Please try again.'
    throw new Error(msg)
  }
}

export async function logoutUser() {
  const res = await api.post('/logout/')
  return res.data
}

export async function getSdgData() {
  const res = await api.get('/index/')
  return res.data
}

export async function getCompanyProfile() {
  const res = await api.get('/profile/')
  return res.data
}

export async function updateCompanyProfile(data) {
  const res = await api.put('/profile/', data)
  return res.data
}

export async function analyseReport(file) {
  try {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/reports/analyse', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return err?.response?.data ?? { success: false, error: 'Failed to analyse report.' }
  }
}

export async function changePassword(data) {
  try {
    const res = await api.post('/profile/change-password/', data)
    return res.data
  } catch (err) {
    return err?.response?.data ?? { success: false, error: 'Failed to change password.' }
  }
}
