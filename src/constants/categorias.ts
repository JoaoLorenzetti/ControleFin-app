// Categorias de envelopes disponíveis no app
export const CATEGORIAS = [
  { key: 'mercado',      emoji: '🛒', nome: 'Mercado',       cor: '#c8f135' },
  { key: 'lazer',        emoji: '🎮', nome: 'Lazer',         cor: '#4f8eff' },
  { key: 'alimentacao',  emoji: '🍔', nome: 'Comida',        cor: '#ff6b4a' },
  { key: 'transporte',   emoji: '🚗', nome: 'Transporte',    cor: '#a078ff' },
  { key: 'fixas',        emoji: '💡', nome: 'Contas fixas',  cor: '#a078ff' },
  { key: 'investimento', emoji: '📈', nome: 'Investimento',  cor: '#ffc400' },
  { key: 'saude',        emoji: '🏥', nome: 'Saúde',         cor: '#22c55e' },
  { key: 'outros',       emoji: '📦', nome: 'Outros',        cor: '#5a6078' },
] as const

export type CategoriaKey = typeof CATEGORIAS[number]['key']