import React, { useEffect, useState } from 'react'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Package,
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react'
import { useProdutoStore, useProdutosEstoqueBaixo } from '../../stores/produtoStore'
import { relatoriosService } from '../../services/api'
import type { MovimentacaoEstoque } from '../../types'
import { cn } from '../../lib/utils'

export const Estoque: React.FC = () => {
  const { produtos, fetchProdutos } = useProdutoStore()
  const limiteEstoqueBaixo = 10
  const produtosEstoqueBaixo = useProdutosEstoqueBaixo(limiteEstoqueBaixo)
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'ENTRADA' | 'SAIDA'>('TODOS')
  const [filtroData, setFiltroData] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await fetchProdutos()
        const movimentacoesData = await relatoriosService.getMovimentacoesHistoricas()
        setMovimentacoes(movimentacoesData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchProdutos])

  // Filtrar movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchSearch = mov.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTipo = filtroTipo === 'TODOS' || mov.tipo === filtroTipo
    const matchData = !filtroData || new Date(mov.data).toISOString().split('T')[0] === filtroData
    
    return matchSearch && matchTipo && matchData
  })

  // Calcular estatísticas
  const totalProdutos = produtos.length
  const quantidadeTotalEmEstoque = produtos.reduce((total, produto) => 
    total + (produto.quantidadeEmEstoque || 0), 0
  )
  const entradasHoje = movimentacoesFiltradas.filter(m => 
    m.tipo === 'ENTRADA' && 
    new Date(m.data).toDateString() === new Date().toDateString()
  ).length
  const saidasHoje = movimentacoesFiltradas.filter(m => 
    m.tipo === 'SAIDA' && 
    new Date(m.data).toDateString() === new Date().toDateString()
  ).length

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
            Controle de Estoque
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Movimentações e status do estoque
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProdutos}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Itens em Estoque</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quantidadeTotalEmEstoque.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Entradas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {entradasHoje}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saídas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {saidasHoje}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Estoque Baixo */}
      {produtosEstoqueBaixo.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Alertas de Estoque Baixo
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {produtosEstoqueBaixo.slice(0, 6).map((produto) => (
              <div
                key={produto.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {produto.nome}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Atual: {produto.quantidadeEmEstoque} {produto.unidadeMedida} | 
                  Limite: {limiteEstoqueBaixo} {produto.unidadeMedida}
                </p>
              </div>
            ))}
          </div>
          
          {produtosEstoqueBaixo.length > 6 && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
              E mais {produtosEstoqueBaixo.length - 6} produtos com estoque baixo...
            </p>
          )}
        </div>
      )}

      {/* Filtros e Pesquisa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODOS">Todos os tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SAIDA">Saídas</option>
          </select>

          {/* Filtro por Data */}
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Botão Limpar */}
          <button
            onClick={() => {
              setSearchTerm('')
              setFiltroTipo('TODOS')
              setFiltroData('')
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Histórico de Movimentações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Histórico de Movimentações
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {movimentacoesFiltradas.length} movimentações encontradas
          </p>
        </div>

        {movimentacoesFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma movimentação encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros de pesquisa
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Observação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {movimentacoesFiltradas.map((movimentacao, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {movimentacao.produtoNome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        movimentacao.tipo === 'ENTRADA'
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                      )}>
                        {movimentacao.tipo === 'ENTRADA' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {movimentacao.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {movimentacao.quantidade} {(() => {
                        const produto = produtos.find(p => p.id === movimentacao.produtoId)
                        return produto?.unidadeMedida || ''
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(movimentacao.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {movimentacao.observacao || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}