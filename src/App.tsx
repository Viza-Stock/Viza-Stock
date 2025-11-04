import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Produtos } from './pages/Produtos'
import { Estoque } from './pages/Estoque'
import { FichasTecnicas } from './pages/FichasTecnicas'
import { Producao } from './pages/Producao'
import { Relatorios } from './pages/Relatorios'
import { Configuracoes } from './pages/Configuracoes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="fichas-tecnicas" element={<FichasTecnicas />} />
          <Route path="producao" element={<Producao />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
