-- Esse arquivo é reaplicado quando muda seu conteúdo
CREATE OR REPLACE VIEW vw_produtos_baixo_estoque AS
SELECT id, nome, unidade_medida, quantidade_em_estoque
FROM produto
WHERE quantidade_em_estoque < 10;