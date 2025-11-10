import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Clock, CheckCircle, AlertTriangle, Calendar, Package, Edit3, Trash2, Factory } from 'lucide-react'
import { OrdemProducao } from '../../types'
import { cn } from '../../lib/utils'

interface KanbanCardProps {
  ordem: OrdemProducao
  onStatusChange: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => void
  onDragStart: (ordemId: string) => void
  onDragEnd: () => void
  isDragging: boolean
  onEdit?: (ordem: OrdemProducao) => void
  onDelete?: (ordem: OrdemProducao) => void
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ ordem, onStatusChange, onDragStart, onDragEnd, isDragging, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', ordem.id)
    onDragStart(ordem.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
      case 'EM_ANDAMENTO':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
      case 'EXECUTADA':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      case 'CANCELADA':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Clock className="w-4 h-4" />
      case 'EM_ANDAMENTO':
        return <Factory className="w-4 h-4" />
      case 'EXECUTADA':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELADA':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const opcoesStatus = [
    { valor: 'PENDENTE' as const, label: 'Pendente', icone: <Clock className="w-3 h-3" /> },
    { valor: 'EM_ANDAMENTO' as const, label: 'Em andamento', icone: <Factory className="w-3 h-3" /> },
    { valor: 'EXECUTADA' as const, label: 'Executada', icone: <CheckCircle className="w-3 h-3" /> },
    { valor: 'CANCELADA' as const, label: 'Cancelada', icone: <AlertTriangle className="w-3 h-3" /> }
  ]

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-move',
        isDragging && 'opacity-50 rotate-2 scale-105'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            #{ordem.id}
          </span>
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            getStatusColor(ordem.status)
          )}>
            {getStatusIcon(ordem.status)}
            <span className="ml-1">{ordem.status.replace('_', ' ')}</span>
          </span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                <p className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mudar status
                </p>
                {opcoesStatus.map(opcao => (
                  <button
                    key={opcao.valor}
                    onClick={() => {
                      onStatusChange(ordem.id, opcao.valor)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={ordem.status === opcao.valor}
                  >
                    {opcao.icone}
                    <span>{opcao.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <button 
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    onEdit?.(ordem)
                    setShowMenu(false)
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
                <button 
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    onDelete?.(ordem)
                    setShowMenu(false)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
        {ordem.produtoNome}
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Package className="w-4 h-4" />
          <span>{ordem.quantidadeProduzida} unidades</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(ordem.dataExecucao).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Barra de progresso simples */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progresso</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
    </div>
  )
}