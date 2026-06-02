import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Fonts } from '../constants'
import DashboardScreen from '../screens/DashboardScreen'
import EnvelopesScreen from '../screens/EnvelopesScreen'
import InsightsScreen from '../screens/InsightsScreen'
import PerfilScreen from '../screens/PerfilScreen'

const Tab = createBottomTabNavigator()

// Ícones SVG como texto unicode — sem dependência extra
function IconInicio({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>⊞</Text>
}
function IconEnvelopes({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>🗂</Text>
}
function IconInsights({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>📊</Text>
}
function IconPerfil({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>👤</Text>
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Início"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <IconInicio focused={focused} /> }}
      />
      <Tab.Screen
        name="Envelopes"
        component={EnvelopesScreen}
        options={{ tabBarIcon: ({ focused }) => <IconEnvelopes focused={focused} /> }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ tabBarIcon: ({ focused }) => <IconInsights focused={focused} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: ({ focused }) => <IconPerfil focused={focused} /> }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13,15,20,0.95)',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: Fonts.xs,
    letterSpacing: 0.4,
  },
})