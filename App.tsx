import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import TabNavigator from './src/navigation/TabNavigator'
import OnboardingScreen from './src/screens/OnboardingScreen'
import CadastroScreen from './src/screens/CadastroScreen'
import LoginScreen from './src/screens/LoginScreen'
import { Colors } from './src/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Fluxo: Onboarding → Cadastro/Login → Dashboard
type Tela = 'onboarding' | 'cadastro' | 'login' | 'app'

function AppContent() {
  const { usuario, carregando } = useAuth()
  const [tela, setTela] = useState<Tela>('onboarding')

  useEffect(() => {
    // Se já está logado vai direto pro app
    if (!carregando && usuario) {
      setTela('app')
    }
  }, [carregando, usuario])

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    )
  }

  // Já logado — vai direto pro app
  if (usuario) {
    return (
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    )
  }

  // Fluxo de autenticação
  if (tela === 'onboarding') {
    return (
      <OnboardingScreen
        onConcluir={() => setTela('cadastro')}
      />
    )
  }

  if (tela === 'cadastro') {
    return (
      <CadastroScreen
        onIrParaLogin={() => setTela('login')}
        onCadastrado={() => setTela('app')}
      />
    )
  }

  if (tela === 'login') {
    return (
      <LoginScreen
        onIrParaCadastro={() => setTela('cadastro')}
        onLogado={() => setTela('app')}
      />
    )
  }

  return null
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  )
}