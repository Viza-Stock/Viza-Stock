import React from 'react'
import { OrdemProducao } from '../../types'
import { KanbanCard } from './KanbanCard'
import { cn } from '../../lib/utils'

interface KanbanColumnProps {
  titulo: string
  ordens: OrdemProducao[]
  cor: string
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA'
  onStatusChange: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => void
  onDrop: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  isDragOver: boolean
  // Handlers recebidos do board para controlar drag dos cards
  onCardDragStart: (ordemId: string) => void
  onCardDragEnd: () => void
  draggedOrdemId: string | null
  onEdit?: (ordem: OrdemProducao) => void
  onDelete?: (ordem: OrdemProducao) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  titulo, 
  ordens, 
  cor, 
  status, 
  onStatusChange,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  isDragOver,
  onCardDragStart,
  onCardDragEnd,
  draggedOrdemId,
  onEdit,
  onDelete
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const ordemId = e.dataTransfer.getData('text/plain')
    if (ordemId) {
      onDrop(ordemId, status)
    }
  }

  return (
    <div 
      className={cn(
        'flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-96 transition-all',
        isDragOver && 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 dark:bg-blue-900/20'
      )}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${cor}`}></div>
          {titulo}
        </h3>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm font-medium">
          {ordens.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {ordens.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2 opacity-50">📋</div>
            <p className="text-sm">Nenhuma ordem {titulo.toLowerCase()}</p>
          </div>
        ) : (
          ordens.map((ordem) => (
            <KanbanCard 
              key={ordem.id} 
              ordem={ordem} 
              onStatusChange={onStatusChange}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              isDragging={draggedOrdemId === ordem.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}