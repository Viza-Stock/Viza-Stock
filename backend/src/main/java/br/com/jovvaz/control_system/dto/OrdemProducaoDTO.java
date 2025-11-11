package br.com.jovvaz.control_system.dto;

import java.time.LocalDateTime;

public class OrdemProducaoDTO {
    private String id;
    private String produtoAcabadoId;
    private String produtoNome;
    private double quantidadeProduzida;
    private String status;
    private LocalDateTime dataExecucao;

    public OrdemProducaoDTO() {}

    public OrdemProducaoDTO(String id, String produtoAcabadoId, String produtoNome, double quantidadeProduzida, String status, LocalDateTime dataExecucao) {
        this.id = id;
        this.produtoAcabadoId = produtoAcabadoId;
        this.produtoNome = produtoNome;
        this.quantidadeProduzida = quantidadeProduzida;
        this.status = status;
        this.dataExecucao = dataExecucao;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProdutoAcabadoId() { return produtoAcabadoId; }
    public void setProdutoAcabadoId(String produtoAcabadoId) { this.produtoAcabadoId = produtoAcabadoId; }
    public String getProdutoNome() { return produtoNome; }
    public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }
    public double getQuantidadeProduzida() { return quantidadeProduzida; }
    public void setQuantidadeProduzida(double quantidadeProduzida) { this.quantidadeProduzida = quantidadeProduzida; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDataExecucao() { return dataExecucao; }
    public void setDataExecucao(LocalDateTime dataExecucao) { this.dataExecucao = dataExecucao; }
}