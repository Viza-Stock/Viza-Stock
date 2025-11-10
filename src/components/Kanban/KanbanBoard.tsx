import React, { useState } from 'react'
import { OrdemProducao } from '../../types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  ordens: OrdemProducao[]
  onStatusChange: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => void
  onEdit?: (ordem: OrdemProducao) => void
  onDelete?: (ordem: OrdemProducao) => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ ordens, onStatusChange, onEdit, onDelete }) => {
  const [draggedOrdem, setDraggedOrdem] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)

  const handleDragStart = (ordemId: string) => {
    setDraggedOrdem(ordemId)
  }

  const handleDragEnd = () => {
    setDraggedOrdem(null)
    setDragOverStatus(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (status: string) => {
    setDragOverStatus(status)
  }

  const handleDragLeave = () => {
    setDragOverStatus(null)
  }

  const handleDrop = (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => {
    onStatusChange(ordemId, novoStatus)
    setDraggedOrdem(null)
    setDragOverStatus(null)
  }
  const ordensPendentes = ordens.filter(ordem => ordem.status === 'PENDENTE')
  const ordensEmAndamento = ordens.filter(ordem => ordem.status === 'EM_ANDAMENTO')
  const ordensExecutadas = ordens.filter(ordem => ordem.status === 'EXECUTADA')
  const ordensCanceladas = ordens.filter(ordem => ordem.status === 'CANCELADA')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KanbanColumn
          titulo="Pendentes"
          ordens={ordensPendentes}
          cor="bg-yellow-500"
          status="PENDENTE"
          onStatusChange={onStatusChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => { e.preventDefault(); handleDragEnter('PENDENTE') }}
          onDragLeave={handleDragLeave}
          isDragOver={dragOverStatus === 'PENDENTE'}
          onCardDragStart={handleDragStart}
          onCardDragEnd={handleDragEnd}
          draggedOrdemId={draggedOrdem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          titulo="Em andamento"
          ordens={ordensEmAndamento}
          cor="bg-blue-500"
          status="EM_ANDAMENTO"
          onStatusChange={onStatusChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => { e.preventDefault(); handleDragEnter('EM_ANDAMENTO') }}
          onDragLeave={handleDragLeave}
          isDragOver={dragOverStatus === 'EM_ANDAMENTO'}
          onCardDragStart={handleDragStart}
          onCardDragEnd={handleDragEnd}
          draggedOrdemId={draggedOrdem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          titulo="Executadas"
          ordens={ordensExecutadas}
          cor="bg-green-500"
          status="EXECUTADA"
          onStatusChange={onStatusChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => { e.preventDefault(); handleDragEnter('EXECUTADA') }}
          onDragLeave={handleDragLeave}
          isDragOver={dragOverStatus === 'EXECUTADA'}
          onCardDragStart={handleDragStart}
          onCardDragEnd={handleDragEnd}
          draggedOrdemId={draggedOrdem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          titulo="Canceladas"
          ordens={ordensCanceladas}
          cor="bg-red-500"
          status="CANCELADA"
          onStatusChange={onStatusChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => { e.preventDefault(); handleDragEnter('CANCELADA') }}
          onDragLeave={handleDragLeave}
          isDragOver={dragOverStatus === 'CANCELADA'}
          onCardDragStart={handleDragStart}
          onCardDragEnd={handleDragEnd}
          draggedOrdemId={draggedOrdem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}