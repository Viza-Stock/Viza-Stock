package br.com.jovvaz.control_system.dto;

import java.time.Instant;

/**
 * DTO simples representando uma movimentação de estoque para relatórios.
 */
public class MovimentacaoEstoqueDTO {
    private String id;
    private String produtoId;
    private String produtoNome;
    private String tipo; // ENTRADA | SAIDA | PRODUCAO
    private double quantidade;
    private Instant data;
    private String observacao;

    public MovimentacaoEstoqueDTO() {}

    public MovimentacaoEstoqueDTO(String id, String produtoId, String produtoNome, String tipo,
                                   double quantidade, Instant data, String observacao) {
        this.id = id;
        this.produtoId = produtoId;
        this.produtoNome = produtoNome;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.data = data;
        this.observacao = observacao;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProdutoId() { return produtoId; }
    public void setProdutoId(String produtoId) { this.produtoId = produtoId; }

    public String getProdutoNome() { return produtoNome; }
    public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public double getQuantidade() { return quantidade; }
    public void setQuantidade(double quantidade) { this.quantidade = quantidade; }

    public Instant getData() { return data; }
    public void setData(Instant data) { this.data = data; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}