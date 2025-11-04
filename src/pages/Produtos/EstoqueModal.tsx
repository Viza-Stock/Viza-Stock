import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Minus, Package } from 'lucide-react'
import { useProdutoStore } from '../../stores/produtoStore'
import { useNotifications } from '../../stores/uiStore'
import type { Produto } from '../../types'
import { cn } from '../../lib/utils'

const estoqueSchema = z.object({
  quantidade: z.number().min(0.01, 'Quantidade deve ser maior que zero')
})

type EstoqueFormData = z.infer<typeof estoqueSchema>

interface EstoqueModalProps {
  produto: Produto
  isOpen: boolean
  onClose: () => void
}

export const EstoqueModal: React.FC<EstoqueModalProps> = ({
  produto,
  isOpen,
  onClose
}) => {
  const { darEntrada, darBaixa, loading } = useProdutoStore()
  const { showSuccess, showError } = useNotifications()
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<EstoqueFormData>({
    resolver: zodResolver(estoqueSchema),
    defaultValues: {
      quantidade: 0
    }
  })

  const quantidade = watch('quantidade')
  const novaQuantidade = tipoMovimentacao === 'entrada'
    ? (produto.quantidadeEmEstoque ?? 0) + (quantidade || 0)
    : (produto.quantidadeEmEstoque ?? 0) - (quantidade || 0)

  const onSubmit = async (data: EstoqueFormData) => {
    try {
      if (tipoMovimentacao === 'entrada') {
        await darEntrada({ produtoId: produto.id, quantidade: data.quantidade })
        showSuccess(
          'Entrada registrada', 
          `Entrada de ${data.quantidade} ${produto.unidadeMedida} registrada com sucesso`
        )
      } else {
        if (data.quantidade > (produto.quantidadeEmEstoque ?? 0)) {
          showError(
            'Quantidade insuficiente',
            `Não é possível dar baixa de ${data.quantidade} ${produto.unidadeMedida}. Estoque atual: ${produto.quantidadeEmEstoque ?? 0} ${produto.unidadeMedida}`
          )
          return
        }

        await darBaixa(produto.id, data.quantidade)
        showSuccess(
          'Saída registrada', 
          `Saída de ${data.quantidade} ${produto.unidadeMedida} registrada com sucesso`
        )
      }

      reset()
      onClose()
    } catch (error) {
      showError(
        'Erro na movimentação',
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      )
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gerenciar Estoque
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {produto.nome}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Informações do Produto */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Atual</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {produto.quantidadeEmEstoque ?? 0} {produto.unidadeMedida}
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Tipo de Movimentação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoMovimentacao('entrada')}
                className={cn(
                  "flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors",
                  tipoMovimentacao === 'entrada'
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600"
                )}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Entrada</span>
              </button>
              
              <button
                type="button"
                onClick={() => setTipoMovimentacao('saida')}
                className={cn(
                  "flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors",
                  tipoMovimentacao === 'saida'
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : "border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600"
                )}
              >
                <Minus className="w-4 h-4" />
                <span className="font-medium">Saída</span>
              </button>
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantidade ({produto.unidadeMedida})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={tipoMovimentacao === 'saida' ? (produto.quantidadeEmEstoque ?? 0) : undefined}
              {...register('quantidade', { valueAsNumber: true })}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.quantidade
                  ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              )}
              placeholder={`Digite a quantidade em ${produto.unidadeMedida}`}
            />
            {errors.quantidade && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.quantidade.message}
              </p>
            )}
            
            {tipoMovimentacao === 'saida' && quantidade > (produto.quantidadeEmEstoque ?? 0) && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Quantidade maior que o estoque disponível ({produto.quantidadeEmEstoque ?? 0} {produto.unidadeMedida})
              </p>
            )}
          </div>
          {/* Removido: Observação (não suportado pelo backend atual) */}

          {/* Preview da Nova Quantidade */}
          {quantidade > 0 && (
            <div className={cn(
              "p-4 rounded-lg border",
              tipoMovimentacao === 'entrada'
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : novaQuantidade >= 0
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Novo estoque após {tipoMovimentacao}:
                </span>
                <span className={cn(
                  "text-lg font-bold",
                  tipoMovimentacao === 'entrada'
                    ? "text-green-700 dark:text-green-300"
                    : novaQuantidade >= 0
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-red-700 dark:text-red-300"
                )}>
                  {novaQuantidade.toFixed(2)} {produto.unidadeMedida}
                </span>
              </div>
              
              {/* Avisos de estoque mínimo removidos por não serem suportados pelo backend atual */}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || loading || (tipoMovimentacao === 'saida' && quantidade > (produto.quantidadeEmEstoque ?? 0))}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              tipoMovimentacao === 'entrada'
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {tipoMovimentacao === 'entrada' ? (
              <Plus className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>
              {isSubmitting || loading 
                ? 'Processando...' 
                : tipoMovimentacao === 'entrada'
                  ? 'Registrar Entrada'
                  : 'Registrar Saída'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}