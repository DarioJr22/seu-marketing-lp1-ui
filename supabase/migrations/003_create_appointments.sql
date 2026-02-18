-- ============================================
-- Migration 003: Tabela Agendamentos
-- ============================================

CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  empresa TEXT,
  servicos TEXT[] DEFAULT '{}',
  orcamento_min NUMERIC DEFAULT 0,
  orcamento_max NUMERIC DEFAULT 0,
  data_agendamento DATE,
  horario TEXT,
  preferencia TEXT DEFAULT 'whatsapp',
  mensagem TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  notificado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_created_at ON agendamentos(created_at DESC);

-- Trigger para updated_at
CREATE TRIGGER agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Política: Anônimos podem criar agendamentos (formulário do site)
CREATE POLICY "agendamentos_anon_insert"
  ON agendamentos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Apenas autenticados podem ler agendamentos
CREATE POLICY "agendamentos_auth_read"
  ON agendamentos FOR SELECT
  TO authenticated
  USING (true);

-- Política: Apenas autenticados podem atualizar agendamentos
CREATE POLICY "agendamentos_auth_update"
  ON agendamentos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Apenas autenticados podem deletar agendamentos
CREATE POLICY "agendamentos_auth_delete"
  ON agendamentos FOR DELETE
  TO authenticated
  USING (true);
