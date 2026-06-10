import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

interface Usuario {
  id: string
  nome: string
  email: string
  perfilCompleto: boolean
}

interface DadosPerfil {
  renda: number
  ciclo: string
  gastosFixos: number
  meta: string
}

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  cadastrar: (nome: string, email: string, senha: string) => Promise<string>
  login: (email: string, senha: string) => Promise<Usuario>
  salvarPerfil: (dados: DadosPerfil, tokenOverride?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Recupera sessão salva ao abrir o app
  useEffect(() => {
    async function carregarSessao() {
      try {
        const [tokenSalvo, usuarioSalvo] = await AsyncStorage.multiGet([
          '@controle_token',
          '@controle_usuario',
        ])
        if (tokenSalvo[1] && usuarioSalvo[1]) {
          setToken(tokenSalvo[1])
          setUsuario(JSON.parse(usuarioSalvo[1]))
        }
      } catch (e) {
        console.error('Erro ao carregar sessão:', e)
      } finally {
        setCarregando(false)
      }
    }
    carregarSessao()
  }, [])

  async function cadastrar(nome: string, email: string, senha: string): Promise<string> {
    const { data } = await api.post('/auth/cadastrar', { nome, email, senha })
    const { token: novoToken, usuario: novoUsuario } = data.dados

    console.log('Token recebido no cadastro:', novoToken)

    await AsyncStorage.multiSet([
      ['@controle_token', novoToken],
      ['@controle_usuario', JSON.stringify(novoUsuario)],
    ])

    const tokenSalvo = await AsyncStorage.getItem('@controle_token')
    console.log('Token salvo no AsyncStorage:', tokenSalvo)

    setToken(novoToken)
    setUsuario(novoUsuario)

    return novoToken
  }

  async function login(email: string, senha: string): Promise<Usuario> {
    const { data } = await api.post('/auth/login', { email, senha })
    const { token: novoToken, usuario: novoUsuario } = data.dados

    await AsyncStorage.multiSet([
      ['@controle_token', novoToken],
      ['@controle_usuario', JSON.stringify(novoUsuario)],
    ])

    setToken(novoToken)
    setUsuario(novoUsuario)
    return novoUsuario
  }

  async function salvarPerfil(dados: DadosPerfil, tokenOverride?: string): Promise<void> {
    const tokenUsado = tokenOverride || await AsyncStorage.getItem('@controle_token')
    console.log('Token usado no salvarPerfil:', tokenUsado)

    await api.post('/auth/perfil', dados, {
      headers: { Authorization: `Bearer ${tokenUsado}` }
    })

    const usuarioAtualizado = { ...usuario!, perfilCompleto: true }
    await AsyncStorage.setItem('@controle_usuario', JSON.stringify(usuarioAtualizado))
    setUsuario(usuarioAtualizado)
  }

  async function logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      '@controle_token',
      '@controle_usuario',
      '@controle_onboarding',
    ])
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, cadastrar, login, salvarPerfil, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}