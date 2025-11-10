import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Factory } from 'lucide-react'
import type { OrdemProducao } from '../../types'
import { cn } from '../../lib/utils'
import { useProducaoStore } from '../../stores/producaoStore'

const editarOrdemSchema = z.object({
  quantidadeProduzida: z.number().min(1, 'Quantidade deve ser maior que zero')
})

type EditarOrdemFormData = z.infer<typeof editarOrdemSchema>

interface EditOrdemModalProps {
  ordem: OrdemProducao
  onClose: () => void
  onSuccess: () => void
}

export const EditOrdemModal: React.FC<EditOrdemModalProps> = ({ ordem, onClose, onSuccess }) => {
  const { editarOrdem } = useProducaoStore()

  const { register, handleSubmit, formState: { errors } } = useForm<EditarOrdemFormData>({
    resolver: zodResolver(editarOrdemSchema),
    defaultValues: {
      quantidadeProduzida: ordem.quantidadeProduzida
    }
  })

  const onSubmit = (data: EditarOrdemFormData) => {
    editarOrdem(ordem.id, { quantidadeProduzida: data.quantidadeProduzida })
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Factory className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Editar Ordem #{ordem.id}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {ordem.produtoNome}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantidade Produzida
            </label>
            <input
              type="number"
              min={1}
              step={1}
              {...register('quantidadeProduzida', { valueAsNumber: true })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'border-gray-300 dark:border-gray-600',
                errors.quantidadeProduzida && 'border-red-500 focus:ring-red-500'
              )}
            />
            {errors.quantidadeProduzida && (
              <p className="text-red-500 text-sm mt-1">{errors.quantidadeProduzida.message}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}