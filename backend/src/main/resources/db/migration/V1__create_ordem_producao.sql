-- Criação da tabela de Ordens de Produção
CREATE TABLE IF NOT EXISTS ordem_producao (
    id VARCHAR(50) PRIMARY KEY,
    produto_acabado_id VARCHAR(255) NOT NULL,
    quantidade_produzida DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_execucao TIMESTAMP NOT NULL,
    CONSTRAINT fk_ordem_produto FOREIGN KEY (produto_acabado_id) REFERENCES produto(id)
);