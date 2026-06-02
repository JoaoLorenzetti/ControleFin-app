import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts } from '../constants'

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.greeting}>BOA TARDE</Text>
          <Text style={styles.name}>João Pedro</Text>
          <Text style={styles.placeholder}>Dashboard em construção... 🚧</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  greeting: {
    fontSize: Fonts.xs,
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  name: {
    fontSize: Fonts.xl,
    color: Colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  placeholder: {
    fontSize: Fonts.md,
    color: Colors.muted,
    marginTop: 40,
    textAlign: 'center',
  },
})