-- ============================================
-- Migration 002: Tabela Leads
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  mensagem TEXT,
  servicos TEXT[] DEFAULT '{}',
  orcamento_min NUMERIC DEFAULT 0,
  orcamento_max NUMERIC DEFAULT 0,
  origem TEXT NOT NULL DEFAULT 'site',
  landing_page_id INTEGER,
  status TEXT NOT NULL DEFAULT 'novo',
  prioridade TEXT DEFAULT 'media',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_prioridade ON leads(prioridade);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Anônimos podem criar leads (formulário do site)
CREATE POLICY "leads_anon_insert"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Apenas autenticados podem ler leads
CREATE POLICY "leads_auth_read"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Política: Apenas autenticados podem atualizar leads
CREATE POLICY "leads_auth_update"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Apenas autenticados podem deletar leads
CREATE POLICY "leads_auth_delete"
  ON leads FOR DELETE
  TO authenticated
  USING (true);
