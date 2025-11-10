import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../pages/Login'
import { describe, it, expect, vi } from 'vitest'

// Mock do useAuthStore
vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({
    login: vi.fn().mockResolvedValue(true),
    loading: false,
    error: null,
    clearError: vi.fn()
  })
}))

// Mock do useUIStore
vi.mock('../stores/uiStore', () => ({
  useUIStore: () => ({
    theme: 'light'
  })
}))

// Mock do useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Login Component', () => {
  it('renders login form with all elements', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    // Verificar se os elementos principais estão presentes
    expect(screen.getByText('Viza Stock')).toBeInTheDocument()
    expect(screen.getByText('Sistema de Controle de Estoque')).toBeInTheDocument()
    expect(screen.getByLabelText('Usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /lembrar-me/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    })
  })

  it('shows validation error for short username', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const usuarioInput = screen.getByLabelText('Usuário')
    fireEvent.change(usuarioInput, { target: { value: 'ab' } })

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Usuário deve ter pelo menos 3 caracteres')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText('Senha')
    const toggleButton = screen.getByLabelText(/mostrar senha/i)

    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  // Removidos testes de credenciais demo obsoletos
})