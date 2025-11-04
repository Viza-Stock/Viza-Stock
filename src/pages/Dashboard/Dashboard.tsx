import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Factory,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { useProdutoStore, useProdutosEstoqueBaixo } from '../../stores/produtoStore'
import { useProducaoStore } from '../../stores/producaoStore'
import { relatoriosService } from '../../services/api'
import type { DashboardMetrics, MovimentacaoEstoque } from '../../types'
import { cn } from '../../lib/utils'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface MetricCard {
  title: string
  value: string | number
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { produtos, fetchProdutos } = useProdutoStore()
  const { ordensProducao } = useProducaoStore()
  const produtosEstoqueBaixo = useProdutosEstoqueBaixo()
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        await fetchProdutos()
        
        // Carregar métricas do dashboard
        const dashboardMetrics = await relatoriosService.getDashboardMetrics()
        setMetrics(dashboardMetrics)
        
        // Carregar movimentações recentes
        const movimentacoesRecentes = await relatoriosService.getMovimentacoesHistoricas()
        setMovimentacoes(movimentacoesRecentes.slice(0, 10))
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [fetchProdutos])

  // Calcular métricas baseadas nos dados locais
  const totalProdutos = produtos?.length || 0
  const produtosBaixoEstoqueCount = produtosEstoqueBaixo?.length || 0
  const ordensRecentes = ordensProducao?.slice(0, 5) || []
  // Como o backend atual não possui preço, exibimos o total de unidades em estoque
  const estoqueTotalUnidades = produtos?.reduce((total, produto) => 
    total + (produto.quantidadeEmEstoque ?? 0), 0
  ) || 0
  
  // Garantir que produtosBaixoEstoque seja um array
  const produtosBaixoEstoqueArray = Array.isArray(produtosEstoqueBaixo) ? produtosEstoqueBaixo : []

  const metricCards: MetricCard[] = [
    {
      title: 'Total de Produtos',
      value: totalProdutos,
      change: metrics?.crescimentoProdutos || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Estoque Total (Unidades)',
      value: estoqueTotalUnidades.toLocaleString('pt-BR'),
      change: metrics?.crescimentoEstoque || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Estoque Baixo',
      value: produtosBaixoEstoqueCount,
      change: metrics?.alertasEstoque || 0,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Ordens de Produção',
      value: ordensRecentes.length,
      change: metrics?.ordensProducao || 0,
      icon: Factory,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ]

  // Dados para gráfico de movimentações
  const movimentacoesChartData = {
    labels: movimentacoes.map(m => 
      new Date(m.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    ),
    datasets: [
      {
        label: 'Entradas',
        data: movimentacoes.map(m => m.tipo === 'ENTRADA' ? m.quantidade : 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Saídas',
        data: movimentacoes.map(m => m.tipo === 'SAIDA' ? m.quantidade : 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }

  // Dados para gráfico de categorias
  const formatTipo = (tipo: 'MATERIA_PRIMA' | 'PRODUTO_ACABADO') => {
    return tipo === 'MATERIA_PRIMA' ? 'Matéria-prima' : 'Produto acabado'
  }

  const categorias = produtos.reduce((acc, produto) => {
    const categoria = formatTipo(produto.tipo)
    acc[categoria] = (acc[categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoriasChartData = {
    labels: Object.keys(categorias),
    datasets: [
      {
        data: Object.values(categorias),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema de estoque
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/relatorios')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Relatório Completo</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon
          const isPositive = card.change >= 0
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-lg", card.bgColor)}>
                  <Icon className={cn("w-6 h-6", card.color)} />
                </div>
                
                <div className={cn(
                  "flex items-center space-x-1 text-sm",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {card.title}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Movimentações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Movimentações Recentes
          </h3>
          <div className="h-64">
            <Line 
              data={movimentacoesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfico de Categorias */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produtos por Categoria
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={categoriasChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Alertas e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Estoque Baixo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alertas de Estoque
          </h3>
          
          {produtosBaixoEstoqueArray.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Todos os produtos estão com estoque adequado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {produtosBaixoEstoqueArray.slice(0, 5).map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {produto.nome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Estoque: {produto.quantidadeEmEstoque ?? 0} {produto.unidadeMedida}
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                    Baixo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ordens de Produção Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ordens de Produção
          </h3>
          
          {ordensRecentes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma ordem de produção recente
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ordensRecentes.map((ordem) => (
                <div
                  key={ordem.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Factory className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ordem.produtoNome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qtd: {ordem.quantidadeProduzida}
                      </p>
                    </div>
                  </div>
                  
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    ordem.status === 'EXECUTADA' 
                      ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                      : "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                  )}>
                    {ordem.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}