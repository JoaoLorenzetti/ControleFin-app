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
  onIrParaLogin: () => void
  onCadastrado: () => void
}

export default function CadastroScreen({ onIrParaLogin, onCadastrado }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { cadastrar } = useAuth()

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos')
      return
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres')
      return
    }

    setCarregando(true)
    try {
      await cadastrar(nome, email, senha)
      onCadastrado()
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao cadastrar. Tente novamente.'
      Alert.alert('Erro', mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>É rápido e gratuito 🚀</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor={Colors.muted}
            autoCapitalize="words"
          />

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.muted}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, carregando && styles.btnDesabilitado]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color={Colors.bg} />
              : <Text style={styles.btnText}>Criar conta</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={onIrParaLogin}>
            <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkDestaque}>Entrar</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { flexGrow: 1, padding: 24, justifyContent: 'center' },
  titulo:  { fontSize: Fonts.xxl, color: Colors.text, fontWeight: '800', marginBottom: 4 },
  subtitulo: { fontSize: Fonts.sm, color: Colors.muted, marginBottom: 40 },
  label:   { fontSize: Fonts.xs, color: Colors.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  input:   {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: Fonts.md, color: Colors.text, marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.accent, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center', marginTop: 8,
  },
  btnDesabilitado: { opacity: 0.5 },
  btnText: { color: Colors.bg, fontSize: Fonts.md, fontWeight: '800' },
  linkBtn: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: Fonts.sm, color: Colors.muted },
  linkDestaque: { color: Colors.accent, fontWeight: '700' },
})