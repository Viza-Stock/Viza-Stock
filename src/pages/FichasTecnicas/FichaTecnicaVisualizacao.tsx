import React from 'react'
import { X, Package, AlertCircle, CheckCircle } from 'lucide-react'

import type { FichaTecnica } from '../../types'
import { cn } from '../../lib/utils'

interface FichaTecnicaVisualizacaoProps {
  ficha: FichaTecnica
  onClose: () => void
}

export const FichaTecnicaVisualizacao: React.FC<FichaTecnicaVisualizacaoProps> = ({
  ficha,
  onClose
}) => {
  const produtoFinal = ficha.produtoAcabado
  
  // Calcular informações dos componentes (estoque e suficiência)
  const componentesDetalhados = (ficha.componentes || []).map(comp => {
    const produto = comp.materiaPrima
    const estoqueDisponivel = produto?.quantidadeEmEstoque ?? 0
    return {
      ...comp,
      produto,
      estoqueDisponivel,
      suficiente: estoqueDisponivel >= comp.quantidade
    }
  })

  const producaoViavel = componentesDetalhados.every(comp => comp.suficiente)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ficha Técnica - {produtoFinal?.nome}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visualização detalhada da receita de produção
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Informações do Produto Final */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                    Produto Final
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {produtoFinal?.nome}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Unidade de Medida:</span>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {produtoFinal?.unidadeMedida}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Estoque Atual:</span>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {produtoFinal?.quantidadeEmEstoque ?? 0}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Descrição:</span>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {produtoFinal?.desc || 'Sem descrição'}
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição do Produto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Descrição do Produto
              </h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {produtoFinal?.desc || 'Sem descrição'}
              </p>
            </div>

            {/* Status de Viabilidade */}
            <div className={cn(
              "rounded-lg p-4 border",
              producaoViavel
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            )}>
              <div className="flex items-center space-x-2 mb-2">
                {producaoViavel ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <h3 className={cn(
                  "font-semibold",
                  producaoViavel
                    ? "text-green-900 dark:text-green-200"
                    : "text-red-900 dark:text-red-200"
                )}>
                  {producaoViavel ? 'Produção Viável' : 'Estoque Insuficiente'}
                </h3>
              </div>
              <p className={cn(
                "text-sm",
                producaoViavel
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              )}>
                {producaoViavel
                  ? 'Todos os componentes estão disponíveis em estoque.'
                  : 'Alguns componentes não possuem estoque suficiente para a produção.'
                }
              </p>
            </div>

            {/* Lista de Componentes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Componentes Necessários
              </h3>
              
              <div className="space-y-3">
                {componentesDetalhados.map((comp, index) => (
                  <div
                    key={index}
                    className={cn(
                      "border rounded-lg p-4",
                      comp.suficiente
                        ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          comp.suficiente
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        )}>
                          {comp.suficiente ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {comp.produto?.nome || 'Matéria-prima não encontrada'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {comp.produto?.unidadeMedida}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Necessário: {comp.quantidade} {comp.produto?.unidadeMedida}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Disponível: {comp.estoqueDisponivel} {comp.produto?.unidadeMedida}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Necessário:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comp.quantidade} {comp.produto?.unidadeMedida}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Disponível:</span>
                        <p className={cn(
                          "font-medium",
                          comp.suficiente
                            ? "text-green-600"
                            : "text-red-600"
                        )}>
                          {comp.estoqueDisponivel} {comp.produto?.unidadeMedida}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <p className={cn(
                          "font-medium",
                          comp.suficiente
                            ? "text-green-600"
                            : "text-red-600"
                        )}>
                          {comp.suficiente ? 'Suficiente' : 'Insuficiente'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fim do conteúdo */}
          </div>
        </div>
      </div>
    </div>
  )
}