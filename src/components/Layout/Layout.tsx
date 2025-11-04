import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore, useResponsive } from '../../stores/uiStore'
import { cn } from '../../lib/utils'

export const Layout: React.FC = () => {
  const { sidebarOpen, theme } = useUIStore()
  const { handleResize } = useResponsive()

  // Configurar tema inicial
  useEffect(() => {
    // Aplicar tema inicial
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Configurar responsividade
  useEffect(() => {
    // Executar uma vez no mount
    handleResize()
    
    // Adicionar listener com debounce
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }
    
    window.addEventListener('resize', debouncedResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-72" : "lg:ml-0"
      )}>
        {/* Header */}
        <Header />

        {/* Área de Conteúdo */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sistema de Notificações */}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme={theme}
      />
    </div>
  )
}