import React, { useEffect, useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Package,
  Factory,
  DollarSign
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { relatoriosService } from '../../services/api'
import { useProdutoStore } from '../../stores/produtoStore'
import { useProducaoStore } from '../../stores/producaoStore'
import type { MovimentacaoEstoque, Produto } from '../../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export const Relatorios: React.FC = () => {
  const { produtos } = useProdutoStore()
  const { ordensProducao } = useProducaoStore()
  const [loading, setLoading] = useState(true)
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [filtroData, setFiltroData] = useState({
    inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fim: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const movimentacoesData = await relatoriosService.getMovimentacoesHistoricas()
        setMovimentacoes(movimentacoesData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar movimentações por data
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const dataMovimentacao = new Date(mov.data).toISOString().split('T')[0]
    return dataMovimentacao >= filtroData.inicio && dataMovimentacao <= filtroData.fim
  })

  // Dados para gráfico de movimentações por dia
  const movimentacoesPorDia = movimentacoesFiltradas.reduce((acc, mov) => {
    const data = new Date(mov.data).toLocaleDateString('pt-BR')
    if (!acc[data]) {
      acc[data] = { entradas: 0, saidas: 0 }
    }
    if (mov.tipo === 'ENTRADA') {
      acc[data].entradas += mov.quantidade
    } else {
      acc[data].saidas += mov.quantidade
    }
    return acc
  }, {} as Record<string, { entradas: number; saidas: number }>)

  const chartMovimentacoes = {
    labels: Object.keys(movimentacoesPorDia),
    datasets: [
      {
        label: 'Entradas',
        data: Object.values(movimentacoesPorDia).map(d => d.entradas),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      },
      {
        label: 'Saídas',
        data: Object.values(movimentacoesPorDia).map(d => d.saidas),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  }

  // Dados para gráfico de produtos por categoria
  const formatTipo = (tipo: Produto['tipo']) => tipo === 'MATERIA_PRIMA' ? 'Matéria-prima' : 'Produto acabado'

  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    const categoria = formatTipo(produto.tipo)
    acc[categoria] = (acc[categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartCategorias = {
    labels: Object.keys(produtosPorCategoria),
    datasets: [
      {
        data: Object.values(produtosPorCategoria),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  // Dados para gráfico de estoque (unidades) por categoria
  const estoquePorCategoria = produtos.reduce((acc, produto) => {
    const categoria = formatTipo(produto.tipo)
    const unidades = produto.quantidadeEmEstoque || 0
    acc[categoria] = (acc[categoria] || 0) + unidades
    return acc
  }, {} as Record<string, number>)

  const chartValorEstoque = {
    labels: Object.keys(estoquePorCategoria),
    datasets: [
      {
        label: 'Unidades em Estoque',
        data: Object.values(estoquePorCategoria),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    ]
  }

  const exportarRelatorio = () => {
    // Aqui seria implementada a exportação do relatório
    console.log('Exportando relatório...')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            Relatórios e Análises
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Dashboards analíticos e relatórios gerenciais
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={exportarRelatorio}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</span>
          </div>
          <input
            type="date"
            value={filtroData.inicio}
            onChange={(e) => setFiltroData(prev => ({ ...prev, inicio: e.target.value }))}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">até</span>
          <input
            type="date"
            value={filtroData.fim}
            onChange={(e) => setFiltroData(prev => ({ ...prev, fim: e.target.value }))}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {produtos.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Total (Unidades)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {produtos.reduce((total, p) => total + (p.quantidadeEmEstoque || 0), 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Movimentações</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {movimentacoesFiltradas.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ordens de Produção</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ordensProducao.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Movimentações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Movimentações por Dia
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64">
            <Bar
              data={chartMovimentacoes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico de Produtos por Categoria */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Produtos por Categoria
            </h3>
            <Package className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64">
            <Doughnut
              data={chartCategorias}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Estoque (Unidades) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unidades em Estoque por Categoria
          </h3>
          <DollarSign className="w-5 h-5 text-gray-500" />
        </div>
        <div className="h-64">
          <Bar
            data={chartValorEstoque}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return Number(value).toLocaleString('pt-BR')
                    }
                  }
                },
              },
            }}
          />
        </div>
      </div>

      {/* Tabela de Resumo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resumo por Categoria
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unidades Totais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unidades Médias
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(produtosPorCategoria).map(([categoria, quantidade]) => {
                const produtosCategoria = produtos.filter(p => formatTipo(p.tipo) === categoria)
                const quantidadeTotal = produtosCategoria.reduce((sum, p) => sum + (p.quantidadeEmEstoque || 0), 0)
                const unidadesMedias = quantidadeTotal / quantidade

                return (
                  <tr key={categoria} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {quantidadeTotal.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {unidadesMedias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}