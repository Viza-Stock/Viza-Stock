package br.com.jovvaz.control_system.controller;

import br.com.jovvaz.control_system.dto.DashboardResumoDTO;
import br.com.jovvaz.control_system.dto.MovimentacaoEstoqueDTO;
import br.com.jovvaz.control_system.model.Produto;
import br.com.jovvaz.control_system.repository.ProdutoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatoriosController {

    private final ProdutoRepository produtoRepository;

    public RelatoriosController(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    /**
     * Endpoint simples para métricas do dashboard.
     * Por enquanto retorna valores estáticos/derivados, até que haja persistência própria para relatórios.
     */
    @GetMapping("/dashboard")
    public DashboardResumoDTO dashboard() {
        List<Produto> produtos = produtoRepository.findAll();

        int alertasEstoque = (int) produtos.stream()
                .filter(p -> p.getQuantidadeEmEstoque() <= 10)
                .count();

        // Crescimentos estáticos por ora; podem ser ajustados conforme regras reais
        double crescimentoProdutos = 0.0;
        double crescimentoEstoque = 0.0;
        double crescimentoProducao = 0.0;
        double crescimentoValor = 0.0;

        // Ordens de produção não são persistidas no momento; retornamos 0
        int ordensProducao = 0;

        return new DashboardResumoDTO(
                crescimentoProdutos,
                crescimentoEstoque,
                crescimentoProducao,
                crescimentoValor,
                alertasEstoque,
                ordensProducao
        );
    }

    /**
     * Histórico de movimentações de estoque.
     * Como ainda não há entidade/tabela de movimentações, retorna lista vazia.
     */
    @GetMapping("/movimentacoes-historicas")
    public List<MovimentacaoEstoqueDTO> movimentacoesHistoricas() {
        // Retorna lista vazia por ora. No futuro, popular a partir de uma tabela de movimentações.
        return new ArrayList<>();
    }
}