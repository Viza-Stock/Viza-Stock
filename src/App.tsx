import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Produtos } from './pages/Produtos'
import { Estoque } from './pages/Estoque'
import { FichasTecnicas } from './pages/FichasTecnicas'
import { Producao } from './pages/Producao'
import { Relatorios } from './pages/Relatorios'
import { Configuracoes } from './pages/Configuracoes'
import { Login } from './pages/Login'
import { useAuthStore } from './stores/authStore'
import { RequireSystemRoles } from './components/RequireSystemRoles'

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login - não protegida */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Ao acessar a raiz, sempre redirecionar para a página de Login */}
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="fichas-tecnicas" element={<FichasTecnicas />} />
          <Route path="producao" element={<Producao />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route 
            path="configuracoes" 
            element={
              <RequireSystemRoles allowed={["ROOT", "ADMINISTRADOR"]}>
                <Configuracoes />
              </RequireSystemRoles>
            } 
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
