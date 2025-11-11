import { create } from 'zustand'
import type { 
  FichaTecnica, 
  OrdemProducao, 
  ProdutoAcabadoRequestDTO, 
  OrdemProducaoRequestDTO 
} from '../types'
import { producaoService } from '../services/api'

interface ProducaoStore {
  // Estado
  fichasTecnicas: FichaTecnica[]
  ordensProducao: OrdemProducao[]
  loading: boolean
  error: string | null

  // Ações
  fetchFichasTecnicas: () => Promise<void>
  fetchOrdensProducao: () => Promise<void>
  criarProdutoAcabado: (produto: ProdutoAcabadoRequestDTO) => Promise<void>
  executarOrdem: (ordem: OrdemProducaoRequestDTO) => Promise<void>
  verificarViabilidade: (produtoId: string, quantidade: number) => Promise<boolean>
  buscarFichaTecnica: (produtoId: string) => Promise<FichaTecnica | null>
  alterarStatusOrdem: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => Promise<void>
  criarOrdemPendente: (dados: { produtoAcabadoId: string; produtoNome: string; quantidadeAProduzir: number }) => Promise<void>
  editarOrdem: (ordemId: string, dados: Partial<Pick<OrdemProducao, 'quantidadeProduzida' | 'status' | 'produtoNome'>>) => void
  deletarOrdem: (ordemId: string) => Promise<void>
  clearError: () => void
}

export const useProducaoStore = create<ProducaoStore>((set, get) => ({
  // Estado inicial
  fichasTecnicas: [],
  ordensProducao: [],
  loading: false,
  error: null,

  // Buscar todas as fichas técnicas
  fetchFichasTecnicas: async () => {
    set({ loading: true, error: null })
    try {
      const fichas = await producaoService.listarFichasTecnicas()
      set({ fichasTecnicas: fichas, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar fichas técnicas',
        loading: false 
      })
    }
  },

  // Buscar ordens de produção persistidas no backend
  fetchOrdensProducao: async () => {
    set({ loading: true, error: null })
    try {
      const ordens = await producaoService.listarOrdensProducao()
      // Garantir ordenação por data mais recente primeiro
      ordens.sort((a, b) => b.dataExecucao.getTime() - a.dataExecucao.getTime())
      set({ ordensProducao: ordens, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar ordens de produção',
        loading: false 
      })
    }
  },

  // Criar produto acabado com ficha técnica
  criarProdutoAcabado: async (produto: ProdutoAcabadoRequestDTO) => {
    set({ loading: true, error: null })
    try {
      await producaoService.criarProdutoAcabado(produto)
      
      // Recarregar fichas técnicas após criar produto
      await get().fetchFichasTecnicas()
      
      set({ loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar produto acabado',
        loading: false 
      })
      throw error
    }
  },

  // Executar ordem de produção
  executarOrdem: async (ordem: OrdemProducaoRequestDTO) => {
    set({ loading: true, error: null })
    try {
      await producaoService.executarOrdem(ordem)
      // A execução é registrada pelo backend; recarregar ordens
      await get().fetchOrdensProducao()
      set({ loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao executar ordem de produção',
        loading: false 
      })
      throw error
    }
  },

  // Verificar viabilidade de produção
  verificarViabilidade: async (produtoId: string, quantidade: number) => {
    try {
      return await producaoService.verificarViabilidade(produtoId, quantidade)
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao verificar viabilidade'
      })
      return false
    }
  },

  // Buscar ficha técnica específica
  buscarFichaTecnica: async (produtoId: string) => {
    const { fichasTecnicas } = get()
    
    // Primeiro verifica se já está no estado
    const fichaExistente = fichasTecnicas.find(f => f.produtoAcabado.id === produtoId)
    if (fichaExistente) {
      return fichaExistente
    }

    // Se não estiver, busca na API
    try {
      const ficha = await producaoService.buscarFichaTecnica(produtoId)
      
      // Adiciona ao estado local
      set(state => ({
        fichasTecnicas: [...state.fichasTecnicas, ficha]
      }))
      
      return ficha
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao buscar ficha técnica'
      })
      return null
    }
  },

  // Limpar erro
  clearError: () => {
    set({ error: null })
  }
  ,

  // Alterar status de uma ordem de produção (apenas na store local por enquanto)
  alterarStatusOrdem: async (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => {
    set({ loading: true, error: null })
    try {
      const atualizada = await producaoService.atualizarStatusOrdem(ordemId, novoStatus)
      set(state => ({
        ordensProducao: state.ordensProducao.map(o => o.id === ordemId ? atualizada : o),
        loading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar status da ordem',
        loading: false 
      })
      throw error
    }
  }
  ,

  // Criar ordem PENDENTE localmente (fluxo correto: cria -> start para EM_ANDAMENTO -> executar -> EXECUTADA)
  criarOrdemPendente: async ({ produtoAcabadoId, produtoNome, quantidadeAProduzir }) => {
    set({ loading: true, error: null })
    try {
      const criada = await producaoService.criarOrdemPersistida({ produtoAcabadoId, quantidadeAProduzir })
      // Preencher produtoNome se vier vazio do backend
      const ordemFinal: OrdemProducao = {
        ...criada,
        produtoNome: criada.produtoNome || produtoNome
      }
      set(state => ({ ordensProducao: [ordemFinal, ...state.ordensProducao], loading: false }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar ordem de produção',
        loading: false 
      })
      throw error
    }
  }
  ,

  // Editar campos básicos da ordem localmente (MVP)
  editarOrdem: (ordemId, dados) => {
    set(state => ({
      ordensProducao: state.ordensProducao.map(o =>
        o.id === ordemId ? { ...o, ...dados } as OrdemProducao : o
      )
    }))
  }
  ,

  // Deletar ordem localmente (MVP)
  deletarOrdem: async (ordemId) => {
    set({ loading: true, error: null })
    try {
      await producaoService.deletarOrdem(ordemId)
      set(state => ({
        ordensProducao: state.ordensProducao.filter(o => o.id !== ordemId),
        loading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar ordem de produção',
        loading: false 
      })
      throw error
    }
  }
}))

// Seletores computados
export const useFichasPorProduto = (produtoId: string) => {
  const fichasTecnicas = useProducaoStore(state => state.fichasTecnicas)
  return fichasTecnicas.find(f => f.produtoAcabado.id === produtoId)
}

export const useOrdensRecentes = (limite = 10) => {
  const ordensProducao = useProducaoStore(state => state.ordensProducao)
  return ordensProducao
    .sort((a, b) => b.dataExecucao.getTime() - a.dataExecucao.getTime())
    .slice(0, limite)
}