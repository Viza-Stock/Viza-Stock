package br.com.jovvaz.control_system.service;

import br.com.jovvaz.control_system.dto.OrdemProducaoCreateDTO;
import br.com.jovvaz.control_system.dto.OrdemProducaoDTO;
import br.com.jovvaz.control_system.model.OrdemProducao;
import br.com.jovvaz.control_system.model.Produto;
import br.com.jovvaz.control_system.model.StatusOrdemProducao;
import br.com.jovvaz.control_system.repository.OrdemProducaoRepository;
import br.com.jovvaz.control_system.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrdemProducaoService {

    private final OrdemProducaoRepository ordemRepo;
    private final ProdutoRepository produtoRepo;
    private final ProducaoService producaoService;

    public OrdemProducaoService(OrdemProducaoRepository ordemRepo,
                                ProdutoRepository produtoRepo,
                                ProducaoService producaoService) {
        this.ordemRepo = ordemRepo;
        this.produtoRepo = produtoRepo;
        this.producaoService = producaoService;
    }

    public List<OrdemProducaoDTO> listar() {
        return ordemRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrdemProducaoDTO criar(OrdemProducaoCreateDTO dto) {
        Produto produto = produtoRepo.findById(dto.getProdutoAcabadoId())
                .orElseThrow(() -> new EntityNotFoundException("Produto acabado não encontrado: " + dto.getProdutoAcabadoId()));

        String id = "OP-" + UUID.randomUUID().toString().substring(0, 8);
        OrdemProducao ordem = new OrdemProducao(
                id,
                produto,
                dto.getQuantidadeAProduzir(),
                StatusOrdemProducao.PENDENTE,
                LocalDateTime.now()
        );
        ordem = ordemRepo.save(ordem);
        return toDTO(ordem);
    }

    @Transactional
    public OrdemProducaoDTO atualizarStatus(String id, StatusOrdemProducao novoStatus) {
        OrdemProducao ordem = ordemRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ordem não encontrada: " + id));

        // Se executar, integra com a lógica de produção (baixa/entrada)
        if (novoStatus == StatusOrdemProducao.EXECUTADA) {
            producaoService.executarOrdemDeProducao(ordem.getProdutoAcabado().getId(), ordem.getQuantidadeProduzida());
            ordem.setDataExecucao(LocalDateTime.now());
        }

        ordem.setStatus(novoStatus);
        ordem = ordemRepo.save(ordem);
        return toDTO(ordem);
    }

    @Transactional
    public void deletar(String id) {
        if (!ordemRepo.existsById(id)) {
            throw new EntityNotFoundException("Ordem não encontrada: " + id);
        }
        ordemRepo.deleteById(id);
    }

    private OrdemProducaoDTO toDTO(OrdemProducao ordem) {
        return new OrdemProducaoDTO(
                ordem.getId(),
                ordem.getProdutoAcabado().getId(),
                ordem.getProdutoAcabado().getNome(),
                ordem.getQuantidadeProduzida(),
                ordem.getStatus().name(),
                ordem.getDataExecucao()
        );
    }
}