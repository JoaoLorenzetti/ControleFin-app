import { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface ResumoDashboard {
  renda: number
  gastosFixos: number
  meta: string
  totalOrcamento: number
  totalGasto: number
  saldoLivre: number
  orcamentoDiario: number
  porcentagemMes: number
  diasRestantes: number
  envelopesEstourados: number
}

export default function DashboardScreen() {
  const { usuario, logout } = useAuth()
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)

  const carregarResumo = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard')
      setResumo(data.dados)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setCarregando(false)
      setAtualizando(false)
    }
  }, [])

  useEffect(() => {
    carregarResumo()
  }, [carregarResumo])

  function onRefresh() {
    setAtualizando(true)
    carregarResumo()
  }

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? ''

  // Saudação baseada no horário
  function saudacao() {
    const hora = new Date().getHours()
    if (hora < 12) return 'BOM DIA'
    if (hora < 18) return 'BOA TARDE'
    return 'BOA NOITE'
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.saudacao}>{saudacao()}</Text>
            <Text style={styles.nome}>{primeiroNome} 👋</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {resumo && (
          <>
            {/* Card principal — Saldo livre */}
            <View style={styles.cardPrincipal}>
              <Text style={styles.cardLabel}>SALDO LIVRE</Text>
              <Text style={[
                styles.cardValor,
                resumo.saldoLivre < 0 && { color: Colors.warn }
              ]}>
                R$ {resumo.saldoLivre.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.cardSub}>
                de R$ {resumo.totalOrcamento.toFixed(2).replace('.', ',')} orçados
              </Text>

              {/* Barra de progresso do mês */}
              <View style={styles.barraFundo}>
                <View
                  style={[
                    styles.barraPreenchida,
                    {
                      width: `${Math.min(resumo.porcentagemMes, 100)}%` as any,
                      backgroundColor: resumo.porcentagemMes > 90 ? Colors.warn : Colors.accent,
                    }
                  ]}
                />
              </View>
              <Text style={styles.barraLabel}>{resumo.porcentagemMes}% do orçamento usado</Text>
            </View>

            {/* Cards de métricas */}
            <View style={styles.metricas}>
              <View style={styles.metricaCard}>
                <Text style={styles.metricaEmoji}>📅</Text>
                <Text style={styles.metricaValor}>
                  R$ {resumo.orcamentoDiario.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.metricaLabel}>por dia</Text>
              </View>

              <View style={styles.metricaCard}>
                <Text style={styles.metricaEmoji}>🗓</Text>
                <Text style={styles.metricaValor}>{resumo.diasRestantes}</Text>
                <Text style={styles.metricaLabel}>dias restantes</Text>
              </View>

              <View style={[styles.metricaCard, resumo.envelopesEstourados > 0 && styles.metricaCardWarn]}>
                <Text style={styles.metricaEmoji}>⚠️</Text>
                <Text style={[styles.metricaValor, resumo.envelopesEstourados > 0 && { color: Colors.warn }]}>
                  {resumo.envelopesEstourados}
                </Text>
                <Text style={styles.metricaLabel}>estourados</Text>
              </View>
            </View>

            {/* Meta */}
            <View style={styles.metaCard}>
              <Text style={styles.metaEmoji}>🎯</Text>
              <View style={styles.metaTexto}>
                <Text style={styles.metaLabel}>SUA META</Text>
                <Text style={styles.metaValor}>{resumo.meta}</Text>
              </View>
            </View>

            {/* Gasto do mês */}
            <View style={styles.gastoCard}>
              <View style={styles.gastoLinha}>
                <Text style={styles.gastoLabel}>Gasto este mês</Text>
                <Text style={styles.gastoValor}>
                  R$ {resumo.totalGasto.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <View style={styles.gastoLinha}>
                <Text style={styles.gastoLabel}>Renda</Text>
                <Text style={[styles.gastoValor, { color: Colors.accent }]}>
                  R$ {resumo.renda.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <View style={styles.gastoLinha}>
                <Text style={styles.gastoLabel}>Gastos fixos</Text>
                <Text style={[styles.gastoValor, { color: Colors.warn }]}>
                  R$ {resumo.gastosFixos.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { flex: 1 },
  loading: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 24, paddingBottom: 16,
  },
  saudacao: { fontSize: Fonts.xs, color: Colors.muted, letterSpacing: 1.5 },
  nome:     { fontSize: Fonts.xl, color: Colors.text, fontWeight: '700', marginTop: 2 },
  logoutBtn: { padding: 8 },
  logoutText: { fontSize: Fonts.sm, color: Colors.muted },

  // Card principal
  cardPrincipal: {
    margin: 20, marginTop: 4, padding: 24,
    backgroundColor: Colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardLabel: { fontSize: Fonts.xs, color: Colors.muted, letterSpacing: 1.5, marginBottom: 8 },
  cardValor: { fontSize: 40, color: Colors.accent, fontWeight: '800', letterSpacing: -1 },
  cardSub:   { fontSize: Fonts.sm, color: Colors.muted, marginTop: 4, marginBottom: 16 },
  barraFundo: {
    height: 6, backgroundColor: Colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  barraPreenchida: { height: '100%', borderRadius: 3 },
  barraLabel: { fontSize: Fonts.xs, color: Colors.muted, marginTop: 8 },

  // Métricas
  metricas: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, marginBottom: 12,
  },
  metricaCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 14, alignItems: 'center',
  },
  metricaCardWarn: { borderColor: Colors.warn },
  metricaEmoji: { fontSize: 20, marginBottom: 6 },
  metricaValor: { fontSize: Fonts.lg, color: Colors.text, fontWeight: '700' },
  metricaLabel: { fontSize: 10, color: Colors.muted, marginTop: 2, textAlign: 'center' },

  // Meta
  metaCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 12, padding: 16,
    backgroundColor: 'rgba(200,241,53,0.08)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(200,241,53,0.2)',
  },
  metaEmoji:  { fontSize: 28 },
  metaTexto:  { flex: 1 },
  metaLabel:  { fontSize: Fonts.xs, color: Colors.accent, letterSpacing: 1, opacity: 0.7 },
  metaValor:  { fontSize: Fonts.md, color: Colors.text, fontWeight: '600', marginTop: 2 },

  // Gasto
  gastoCard: {
    marginHorizontal: 20, padding: 16,
    backgroundColor: Colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  gastoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gastoLabel: { fontSize: Fonts.sm, color: Colors.muted },
  gastoValor: { fontSize: Fonts.sm, color: Colors.text, fontWeight: '600' },
})