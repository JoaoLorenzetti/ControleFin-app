import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts } from '../constants'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  onIrParaCadastro: () => void
  onLogado: () => void
}

export default function LoginScreen({ onIrParaCadastro, onLogado }: Props) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos')
      return
    }

    setCarregando(true)
    try {
      await login(email, senha)
      onLogado()
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Credenciais inválidas'
      Alert.alert('Erro', mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <Text style={styles.logo}>💰</Text>
          <Text style={styles.titulo}>Entrar</Text>
          <Text style={styles.subtitulo}>Bem-vindo de volta!</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={Colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••"
            placeholderTextColor={Colors.muted}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, carregando && styles.btnDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color={Colors.bg} />
              : <Text style={styles.btnText}>Entrar</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={onIrParaCadastro}>
            <Text style={styles.linkText}>Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logo:      { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  titulo:    { fontSize: Fonts.xxl, color: Colors.text, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  subtitulo: { fontSize: Fonts.sm, color: Colors.muted, marginBottom: 40, textAlign: 'center' },
  label:     { fontSize: Fonts.xs, color: Colors.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  input:     {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: Fonts.md, color: Colors.text, marginBottom: 20,
  },
  btn:             { backgroundColor: Colors.accent, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  btnDesabilitado: { opacity: 0.5 },
  btnText:         { color: Colors.bg, fontSize: Fonts.md, fontWeight: '800' },
  linkBtn:         { alignItems: 'center', marginTop: 20 },
  linkText:        { fontSize: Fonts.sm, color: Colors.muted },
  linkDestaque:    { color: Colors.accent, fontWeight: '700' },
})