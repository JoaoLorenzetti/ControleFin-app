import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TabNavigator from './src/navigation/TabNavigator'
import OnboardingScreen from './src/screens/OnboardingScreen'
import { Colors } from './src/constants'

export default function App() {
  const [carregando, setCarregando] = useState(true)
  const [onboardingFeito, setOnboardingFeito] = useState(false)

  useEffect(() => {
    verificarOnboarding()
  }, [])

  async function verificarOnboarding() {
    try {
      const feito = await AsyncStorage.getItem('@controle_onboarding')
      setOnboardingFeito(feito === 'true')
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  // Tela de loading enquanto verifica o AsyncStorage
  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {onboardingFeito ? (
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      ) : (
        <OnboardingScreen onConcluir={() => setOnboardingFeito(true)} />
      )}
    </SafeAreaProvider>
  )
}