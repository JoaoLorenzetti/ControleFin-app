import { View, Text, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Colors } from './src/constants/colors'

// Tela temporária — será substituída pela navegação no Dia 2
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.emoji}>💰</Text>
      <Text style={styles.title}>ControleFin</Text>
      <Text style={styles.sub}>Setup concluído!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    color: Colors.accent,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  sub: {
    color: Colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
})