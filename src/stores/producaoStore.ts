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
  criarProdutoAcabado: (produto: ProdutoAcabadoRequestDTO) => Promise<void>
  executarOrdem: (ordem: OrdemProducaoRequestDTO) => Promise<void>
  verificarViabilidade: (produtoId: string, quantidade: number) => Promise<boolean>
  buscarFichaTecnica: (produtoId: string) => Promise<FichaTecnica | null>
  alterarStatusOrdem: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => void
  criarOrdemPendente: (dados: { produtoAcabadoId: string; produtoNome: string; quantidadeAProduzir: number }) => void
  editarOrdem: (ordemId: string, dados: Partial<Pick<OrdemProducao, 'quantidadeProduzida' | 'status' | 'produtoNome'>>) => void
  deletarOrdem: (ordemId: string) => void
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
      
      // Adicionar ordem ao histórico local
      const novaOrdem: OrdemProducao = {
        id: `OP-${Date.now()}`,
        produtoAcabadoId: ordem.produtoAcabadoId,
        produtoNome: '', // Será preenchido pela API
        quantidadeProduzida: ordem.quantidadeAProduzir,
        dataExecucao: new Date(),
        status: 'EXECUTADA'
      }

      set(state => ({
        ordensProducao: [novaOrdem, ...state.ordensProducao],
        loading: false
      }))
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
  alterarStatusOrdem: (ordemId: string, novoStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'EXECUTADA' | 'CANCELADA') => {
    set(state => ({
      ordensProducao: state.ordensProducao.map(o =>
        o.id === ordemId ? { ...o, status: novoStatus } : o
      )
    }))
  }
  ,

  // Criar ordem PENDENTE localmente (fluxo correto: cria -> start para EM_ANDAMENTO -> executar -> EXECUTADA)
  criarOrdemPendente: ({ produtoAcabadoId, produtoNome, quantidadeAProduzir }) => {
    const novaOrdem: OrdemProducao = {
      id: `OP-${Date.now()}`,
      produtoAcabadoId,
      produtoNome,
      quantidadeProduzida: quantidadeAProduzir,
      dataExecucao: new Date(),
      status: 'PENDENTE'
    }
    set(state => ({ ordensProducao: [novaOrdem, ...state.ordensProducao] }))
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
  deletarOrdem: (ordemId) => {
    set(state => ({
      ordensProducao: state.ordensProducao.filter(o => o.id !== ordemId)
    }))
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