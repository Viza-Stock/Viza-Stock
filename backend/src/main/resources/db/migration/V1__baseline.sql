-- Baseline do schema atual; gerado por pg_dump --schema-only
-- Inclua CREATE TABLE/INDEX/CONSTRAINT de todas as tabelas existentes
-- Exemplo ilustrativo (ajuste para o seu schema real):
CREATE TABLE produto (
  id VARCHAR(255) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  desc TEXT,
  unidade_medida VARCHAR(50) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  quantidade_em_estoque NUMERIC(15,2) NOT NULL DEFAULT 0
);

-- Índices e constraints existentes
-- CREATE INDEX idx_produto_nome ON produto (nome);