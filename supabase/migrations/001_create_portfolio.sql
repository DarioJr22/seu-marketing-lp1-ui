-- ============================================
-- Migration 001: Tabela Portfolio
-- ============================================

-- Função reutilizável para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela principal de portfolio
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  cliente TEXT,
  imagem_capa TEXT,
  url TEXT,
  resultado TEXT,
  tags TEXT[] DEFAULT '{}',
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_portfolio_categoria ON portfolio(categoria);
CREATE INDEX IF NOT EXISTS idx_portfolio_ativo ON portfolio(ativo);
CREATE INDEX IF NOT EXISTS idx_portfolio_destaque ON portfolio(destaque);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);

-- Trigger para updated_at automático
CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode ler itens ativos do portfolio
CREATE POLICY "portfolio_public_read"
  ON portfolio FOR SELECT
  USING (true);

-- Política: Apenas usuários autenticados podem inserir
CREATE POLICY "portfolio_auth_insert"
  ON portfolio FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Apenas usuários autenticados podem atualizar
CREATE POLICY "portfolio_auth_update"
  ON portfolio FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Apenas usuários autenticados podem deletar
CREATE POLICY "portfolio_auth_delete"
  ON portfolio FOR DELETE
  TO authenticated
  USING (true);
