package br.com.jovvaz.control_system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordem_producao")
public class OrdemProducao {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_acabado_id", nullable = false)
    private Produto produtoAcabado;

    @Column(name = "quantidade_produzida", nullable = false)
    private double quantidadeProduzida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusOrdemProducao status;

    @Column(name = "data_execucao", nullable = false)
    private LocalDateTime dataExecucao;

    public OrdemProducao() {}

    public OrdemProducao(String id, Produto produtoAcabado, double quantidadeProduzida, StatusOrdemProducao status, LocalDateTime dataExecucao) {
        this.id = id;
        this.produtoAcabado = produtoAcabado;
        this.quantidadeProduzida = quantidadeProduzida;
        this.status = status;
        this.dataExecucao = dataExecucao;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Produto getProdutoAcabado() { return produtoAcabado; }
    public void setProdutoAcabado(Produto produtoAcabado) { this.produtoAcabado = produtoAcabado; }

    public double getQuantidadeProduzida() { return quantidadeProduzida; }
    public void setQuantidadeProduzida(double quantidadeProduzida) { this.quantidadeProduzida = quantidadeProduzida; }

    public StatusOrdemProducao getStatus() { return status; }
    public void setStatus(StatusOrdemProducao status) { this.status = status; }

    public LocalDateTime getDataExecucao() { return dataExecucao; }
    public void setDataExecucao(LocalDateTime dataExecucao) { this.dataExecucao = dataExecucao; }
}