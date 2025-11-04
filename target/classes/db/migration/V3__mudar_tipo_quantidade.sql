BEGIN;

-- Verificar se a coluna existe e o tipo atual
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'produto' AND column_name = 'quantidade_em_estoque') THEN
    -- Converter com segurança
    ALTER TABLE produto ALTER COLUMN quantidade_em_estoque TYPE NUMERIC(15,2)
      USING quantidade_em_estoque::NUMERIC;
  END IF;
END$$;

COMMIT;