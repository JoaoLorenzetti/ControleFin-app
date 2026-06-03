import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors, Fonts } from '../constants'

// Cada etapa do onboarding
type Etapa = 'renda' | 'fixos' | 'meta'

export default function OnboardingScreen({ onConcluir }: { onConcluir: () => void }) {
  const [etapa, setEtapa] = useState<Etapa>('renda')
  const [renda, setRenda] = useState('')
  const [ciclo, setCiclo] = useState<'mensal' | 'quinzenal' | 'semanal'>('mensal')
  const [gastosFixos, setGastosFixos] = useState('')
  const [meta, setMeta] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function salvarEAvancar() {
    if (etapa === 'renda') {
      if (!renda || parseFloat(renda) <= 0) return
      setEtapa('fixos')
      return
    }

    if (etapa === 'fixos') {
      setEtapa('meta')
      return
    }

    // Etapa final — salva tudo e conclui
    if (etapa === 'meta') {
      setCarregando(true)
      try {
        const perfil = {
          renda: parseFloat(renda),
          ciclo,
          gastosFixos: parseFloat(gastosFixos) || 0,
          meta: meta || 'Reserva de emergência',
          criadoEm: new Date().toISOString(),
        }
        await AsyncStorage.setItem('@controle_perfil', JSON.stringify(perfil))
        await AsyncStorage.setItem('@controle_onboarding', 'true')
        onConcluir()
      } catch (e) {
        console.error('Erro ao salvar perfil:', e)
      } finally {
        setCarregando(false)
      }
    }
  }

  function voltarEtapa() {
    if (etapa === 'fixos') setEtapa('renda')
    if (etapa === 'meta') setEtapa('fixos')
  }

  // Progresso visual (1 de 3, 2 de 3, 3 de 3)
  const progresso = etapa === 'renda' ? 1 : etapa === 'fixos' ? 2 : 3

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com progresso */}
          <View style={styles.header}>
            <View style={styles.progressRow}>
              {[1, 2, 3].map((n) => (
                <View
                  key={n}
                  style={[styles.progressDot, n <= progresso && styles.progressDotActive]}
                />
              ))}
            </View>
            <Text style={styles.progressLabel}>{progresso} de 3</Text>
          </View>

          {/* Etapa 1 — Renda */}
          {etapa === 'renda' && (
            <View style={styles.etapa}>
              <Text style={styles.emoji}>💰</Text>
              <Text style={styles.titulo}>Quanto você recebe?</Text>
              <Text style={styles.subtitulo}>
                Usamos isso para calcular seu orçamento diário livre.
              </Text>

              <Text style={styles.label}>Renda mensal</Text>
              <View style={styles.inputRow}>
                <Text style={styles.prefix}>R$</Text>
                <TextInput
                  style={styles.input}
                  value={renda}
                  onChangeText={setRenda}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={Colors.muted}
                  autoFocus
                />
              </View>

              <Text style={styles.label}>Ciclo de recebimento</Text>
              <View style={styles.opcoes}>
                {(['mensal', 'quinzenal', 'semanal'] as const).map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.opcao, ciclo === c && styles.opcaoAtiva]}
                    onPress={() => setCiclo(c)}
                  >
                    <Text style={[styles.opcaoText, ciclo === c && styles.opcaoTextAtiva]}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Etapa 2 — Gastos Fixos */}
          {etapa === 'fixos' && (
            <View style={styles.etapa}>
              <Text style={styles.emoji}>🏠</Text>
              <Text style={styles.titulo}>Seus gastos fixos</Text>
              <Text style={styles.subtitulo}>
                Aluguel, assinaturas, transporte... Descontamos isso para calcular seu saldo livre real.
              </Text>

              <Text style={styles.label}>Total de gastos fixos mensais</Text>
              <View style={styles.inputRow}>
                <Text style={styles.prefix}>R$</Text>
                <TextInput
                  style={styles.input}
                  value={gastosFixos}
                  onChangeText={setGastosFixos}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={Colors.muted}
                  autoFocus
                />
              </View>
              <Text style={styles.dica}>
                💡 Pode pular se não souber agora — dá para ajustar depois.
              </Text>
            </View>
          )}

          {/* Etapa 3 — Meta */}
          {etapa === 'meta' && (
            <View style={styles.etapa}>
              <Text style={styles.emoji}>🎯</Text>
              <Text style={styles.titulo}>Qual é sua meta agora?</Text>
              <Text style={styles.subtitulo}>
                Ela aparece em destaque no dashboard para te motivar todo dia.
              </Text>

              {/* Sugestões rápidas */}
              <View style={styles.sugestoes}>
                {['Reserva de emergência', 'Viagem', 'Investir R$ 200/mês', 'Sair do vermelho'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sugestao, meta === s && styles.sugestaoAtiva]}
                    onPress={() => setMeta(s)}
                  >
                    <Text style={[styles.sugestaoText, meta === s && styles.sugestaoTextAtiva]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Ou escreva a sua</Text>
              <TextInput
                style={styles.inputTexto}
                value={meta}
                onChangeText={setMeta}
                placeholder="Ex: Comprar um notebook"
                placeholderTextColor={Colors.muted}
              />
            </View>
          )}

          {/* Botões */}
          <View style={styles.botoes}>
            {etapa !== 'renda' && (
              <TouchableOpacity style={styles.btnVoltar} onPress={voltarEtapa}>
                <Text style={styles.btnVoltarText}>← Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btnAvancar, carregando && styles.btnDesabilitado]}
              onPress={salvarEAvancar}
              disabled={carregando}
            >
              <Text style={styles.btnAvancarText}>
                {etapa === 'meta' ? (carregando ? 'Salvando...' : 'Começar 🚀') : 'Continuar →'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, padding: 24 },

  header: { alignItems: 'center', marginBottom: 40, marginTop: 8 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  progressDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.border,
  },
  progressDotActive: { backgroundColor: Colors.accent, width: 24 },
  progressLabel: { fontSize: Fonts.xs, color: Colors.muted },

  etapa: { flex: 1 },
  emoji: { fontSize: 48, marginBottom: 16 },
  titulo: { fontSize: Fonts.xxl, color: Colors.text, fontWeight: '800', marginBottom: 8 },
  subtitulo: { fontSize: Fonts.sm, color: Colors.muted, lineHeight: 20, marginBottom: 32 },

  label: { fontSize: Fonts.xs, color: Colors.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, marginBottom: 24,
  },
  prefix: { fontSize: Fonts.lg, color: Colors.muted, marginRight: 8 },
  input: {
    flex: 1, fontSize: Fonts.xxl, color: Colors.text,
    fontWeight: '700', paddingVertical: 16,
  },

  inputTexto: {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: Fonts.md, color: Colors.text,
    marginBottom: 24,
  },

  opcoes: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  opcao: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  opcaoAtiva: { backgroundColor: 'rgba(200,241,53,0.1)', borderColor: Colors.accent },
  opcaoText: { fontSize: Fonts.sm, color: Colors.muted, fontWeight: '500' },
  opcaoTextAtiva: { color: Colors.accent, fontWeight: '700' },

  sugestoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  sugestao: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 100,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  sugestaoAtiva: { backgroundColor: 'rgba(200,241,53,0.1)', borderColor: Colors.accent },
  sugestaoText: { fontSize: Fonts.sm, color: Colors.muted },
  sugestaoTextAtiva: { color: Colors.accent, fontWeight: '600' },

  dica: { fontSize: Fonts.sm, color: Colors.muted, fontStyle: 'italic', marginBottom: 24 },

  botoes: { marginTop: 32, gap: 12 },
  btnAvancar: {
    backgroundColor: Colors.accent, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDesabilitado: { opacity: 0.5 },
  btnAvancarText: { color: Colors.bg, fontSize: Fonts.md, fontWeight: '800' },
  btnVoltar: { alignItems: 'center', paddingVertical: 8 },
  btnVoltarText: { color: Colors.muted, fontSize: Fonts.sm },
})