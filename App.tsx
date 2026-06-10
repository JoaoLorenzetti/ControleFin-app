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

type Tela = 'onboarding' | 'onboarding-perfil' | 'cadastro' | 'login' | 'app'

function AppContent() {
  const { usuario, carregando } = useAuth()
  const [tela, setTela] = useState<Tela>('onboarding')
  const [tokenCadastro, setTokenCadastro] = useState<string | null>(null)

  useEffect(() => {
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

  if (usuario) {
    return (
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    )
  }

  if (tela === 'onboarding') {
    return <OnboardingScreen onConcluir={() => setTela('cadastro')} />
  }

  if (tela === 'cadastro') {
    return (
      <CadastroScreen
        onIrParaLogin={() => setTela('login')}
        onCadastrado={(token) => {
          setTokenCadastro(token)
          setTela('onboarding-perfil')
        }}
      />
    )
  }

  if (tela === 'onboarding-perfil') {
    return (
      <OnboardingScreen
        onConcluir={() => setTela('app')}
        // @ts-ignore: tokenOverride is used conditionally for onboarding flow
        tokenOverride={tokenCadastro ?? undefined}
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