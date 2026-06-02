import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts } from '../constants'

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.placeholder}>Configurações em construção... 🚧</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  container:   { flex: 1, padding: 24 },
  title:       { fontSize: Fonts.xl, color: Colors.text, fontWeight: '700' },
  placeholder: { fontSize: Fonts.md, color: Colors.muted, marginTop: 40, textAlign: 'center' },
})