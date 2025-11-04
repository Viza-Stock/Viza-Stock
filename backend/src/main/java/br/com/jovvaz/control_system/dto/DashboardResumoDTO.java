package br.com.jovvaz.control_system.dto;

/**
 * DTO simples para métricas do dashboard utilizadas no frontend.
 */
public class DashboardResumoDTO {
    private double crescimentoProdutos;
    private double crescimentoEstoque;
    private double crescimentoProducao;
    private double crescimentoValor;
    private int alertasEstoque;
    private int ordensProducao;

    public DashboardResumoDTO() {}

    public DashboardResumoDTO(double crescimentoProdutos,
                              double crescimentoEstoque,
                              double crescimentoProducao,
                              double crescimentoValor,
                              int alertasEstoque,
                              int ordensProducao) {
        this.crescimentoProdutos = crescimentoProdutos;
        this.crescimentoEstoque = crescimentoEstoque;
        this.crescimentoProducao = crescimentoProducao;
        this.crescimentoValor = crescimentoValor;
        this.alertasEstoque = alertasEstoque;
        this.ordensProducao = ordensProducao;
    }

    public double getCrescimentoProdutos() { return crescimentoProdutos; }
    public void setCrescimentoProdutos(double crescimentoProdutos) { this.crescimentoProdutos = crescimentoProdutos; }

    public double getCrescimentoEstoque() { return crescimentoEstoque; }
    public void setCrescimentoEstoque(double crescimentoEstoque) { this.crescimentoEstoque = crescimentoEstoque; }

    public double getCrescimentoProducao() { return crescimentoProducao; }
    public void setCrescimentoProducao(double crescimentoProducao) { this.crescimentoProducao = crescimentoProducao; }

    public double getCrescimentoValor() { return crescimentoValor; }
    public void setCrescimentoValor(double crescimentoValor) { this.crescimentoValor = crescimentoValor; }

    public int getAlertasEstoque() { return alertasEstoque; }
    public void setAlertasEstoque(int alertasEstoque) { this.alertasEstoque = alertasEstoque; }

    public int getOrdensProducao() { return ordensProducao; }
    public void setOrdensProducao(int ordensProducao) { this.ordensProducao = ordensProducao; }
}