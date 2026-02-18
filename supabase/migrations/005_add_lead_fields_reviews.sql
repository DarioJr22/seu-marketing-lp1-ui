-- ============================================
-- Migration 005: Lead fields, lead-appointment relation, reviews
-- ============================================

-- 1. Add observacoes and valor_estimado to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS observacoes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS valor_estimado NUMERIC DEFAULT 0;

-- 2. Add lead_id FK to agendamentos (relationship: agendamento pertence a um lead)
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_agendamentos_lead_id ON agendamentos(lead_id);

-- 3. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  texto TEXT NOT NULL,
  nota INTEGER NOT NULL DEFAULT 5 CHECK (nota >= 1 AND nota <= 5),
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_ativo ON reviews(ativo);
CREATE INDEX IF NOT EXISTS idx_reviews_ordem ON reviews(ordem);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Leitura pública (landing page precisa ler sem auth)
CREATE POLICY "reviews_public_read"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "reviews_auth_insert"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "reviews_auth_update"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "reviews_auth_delete"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- 4. Seed initial reviews (dados que já estavam hardcoded na landing page)
INSERT INTO reviews (nome, cargo, empresa, texto, nota, ativo, ordem) VALUES
  ('Maria Silva', 'CEO', 'TechStart Digital', 'A SEU MARKETING transformou nossa presença digital. Em 3 meses triplicamos nosso faturamento online!', 5, true, 1),
  ('João Santos', 'Diretor de Marketing', 'Inovare Soluções', 'Finalmente encontramos uma agência que entende de resultados, não só de likes.', 5, true, 2),
  ('Ana Costa', 'Proprietária', 'Beleza & Estilo', 'O ROI das campanhas superou todas as expectativas. Melhor investimento que fizemos!', 5, true, 3),
  ('Pedro Oliveira', 'Gerente Comercial', 'AutoPeças Premium', 'Profissionais sérios e comprometidos com resultados. Aumentamos 250% em leads qualificados.', 5, true, 4),
  ('Juliana Ferreira', 'Fundadora', 'EcoLife Store', 'Atendimento humanizado e estratégias que realmente funcionam. Nosso Instagram cresceu 400%!', 5, true, 5),
  ('Carlos Mendes', 'CEO', 'Construtora Horizonte', 'Transparência total nos relatórios e resultados acima do prometido. Equipe excepcional!', 5, true, 6)
ON CONFLICT DO NOTHING;
