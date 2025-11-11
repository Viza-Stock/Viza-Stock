import React from 'react'

interface FullScreenAlertProps {
  title?: string
  message: string
  onConfirm: () => void
  confirmText?: string
}

// Alerta em tela cheia, bloqueante, com fundo vermelho
export const FullScreenAlert: React.FC<FullScreenAlertProps> = ({
  title = 'Atenção',
  message,
  onConfirm,
  confirmText = 'Ok, estou ciente disso'
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="full-screen-alert-title"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop vermelho */}
      <div className="absolute inset-0 bg-red-700/90" />

      {/* Conteúdo */}
      <div className="relative max-w-xl w-full mx-4 p-6 bg-white rounded-lg shadow-lg">
        <h2 id="full-screen-alert-title" className="text-2xl font-bold text-red-700 mb-2">
          {title}
        </h2>
        <p className="text-gray-700 mb-6">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            autoFocus
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FullScreenAlert