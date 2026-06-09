import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// URL da API em produção
const BASE_URL = 'https://controlefin-api.onrender.com/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s — necessário pois o Render dorme e demora pra acordar
})

// Interceptor — injeta o token JWT em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@controle_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expirado — limpa o storage
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@controle_token', '@controle_usuario'])
    }
    return Promise.reject(error)
  }
)

export default api