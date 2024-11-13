import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include API key
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key')
  if (apiKey) {
    config.headers['x-api-key'] = apiKey
  }
  return config
})

// Transactions
export const createTransaction = async (data: any) => {
  const response = await api.post('/transactions', data)
  return response.data
}

export const getTransactions = async (params: any) => {
  const response = await api.get('/transactions', { params })
  return response.data
}

export const getTransaction = async (id: string) => {
  const response = await api.get(`/transactions/${id}`)
  return response.data
}

// Bank Accounts
export const createBankAccount = async (data: any) => {
  const response = await api.post('/bank-accounts', data)
  return response.data
}

export const getBankAccounts = async (params: any) => {
  const response = await api.get('/bank-accounts', { params })
  return response.data
}

export const updateBankAccountStatus = async (id: string, status: string) => {
  const response = await api.patch(`/bank-accounts/${id}/status`, { status })
  return response.data
}

// Analytics
export const getTransactionVolume = async (period: string) => {
  const response = await api.get('/analytics/transactions/volume', {
    params: { period }
  })
  return response.data
}

export const getSuccessRate = async () => {
  const response = await api.get('/analytics/success-rate')
  return response.data
}

export const getBankPerformance = async () => {
  const response = await api.get('/analytics/bank-performance')
  return response.data
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('api_key')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)