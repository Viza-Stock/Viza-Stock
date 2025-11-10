import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, SystemRole } from './authStore'

// Tipos de apoio para gerenciamento de usuários
export type Department = 'FATURAMENTO' | 'EMBALADORA' | 'EXTRUSORA' | 'TI' | 'DIRETORIA'
export type ManagedUser = User & { department: Department }

interface UserManagementState {
  users: ManagedUser[]
  // Ações
  initDefaults: () => void
  addUser: (user: ManagedUser) => void
  updateUser: (user: ManagedUser) => void
  deleteUser: (id: string) => void
  clearAll: () => void
}

// Lista padrão usada na primeira inicialização (sem backend)
const DEFAULT_USERS: ManagedUser[] = [
  { id: '0', nome: 'Root (Desenvolvedor)', email: 'root@viza.com', role: 'ADMINISTRADOR', systemRole: 'ROOT', department: 'TI' },
  { id: '3', nome: 'Administrador do Sistema', email: 'admin@viza.com', role: 'ADMINISTRADOR', systemRole: 'ADMINISTRADOR', department: 'TI' },
  { id: '2', nome: 'Gerente de Produção', email: 'gerente@viza.com', role: 'GERENTE_PRODUCAO', systemRole: 'PADRAO', department: 'EXTRUSORA' },
  { id: '1', nome: 'Operador de Estoque', email: 'operador@viza.com', role: 'OPERADOR_ESTOQUE', systemRole: 'PADRAO', department: 'EMBALADORA' }
]

export const useUserStore = create<UserManagementState>()(
  persist(
    (set, get) => ({
      users: [],
      initDefaults: () => {
        const current = get().users
        if (!current || current.length === 0) {
          set({ users: DEFAULT_USERS })
        }
      },
      addUser: (user: ManagedUser) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (user: ManagedUser) => set((state) => ({ users: state.users.map(u => u.id === user.id ? user : u) })),
      deleteUser: (id: string) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
      clearAll: () => set({ users: [] })
    }),
    {
      name: 'viza-users-storage',
      partialize: (state) => ({ users: state.users })
    }
  )
)

// Utilitário de permissões por nível de acesso do sistema
export const canEditSystemRole = (currentSystemRole: SystemRole | undefined, targetSystemRole: SystemRole) => {
  if (!currentSystemRole) return false
  if (currentSystemRole === 'ROOT') return true
  if (currentSystemRole === 'ADMINISTRADOR') return targetSystemRole === 'PADRAO'
  return false
}