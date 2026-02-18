-- ============================================
-- Seed: Dados de exemplo para desenvolvimento
-- ============================================

-- Portfolio de exemplo
INSERT INTO portfolio (titulo, slug, descricao, categoria, cliente, imagem_capa, url, resultado, tags, destaque, ordem, ativo)
VALUES
  ('Campanha Black Friday', 'campanha-black-friday', 'Campanha completa de Black Friday com resultados expressivos em vendas.', 'Tráfego Pago', 'Loja Fashion', NULL, 'https://instagram.com/example', '+340% ROI em 30 dias', ARRAY['ads', 'meta', 'google'], true, 1, true),
  ('Rebranding Completo', 'rebranding-completo', 'Redesign completo da identidade visual e presença digital.', 'Branding', 'Tech Startup', NULL, NULL, 'Aumento de 200% no engajamento', ARRAY['branding', 'design', 'identidade'], true, 2, true),
  ('Gestão Instagram', 'gestao-instagram', 'Gestão completa do perfil com crescimento orgânico consistente.', 'Social Media', 'Restaurante Gourmet', NULL, 'https://instagram.com/example2', '+15k seguidores em 3 meses', ARRAY['instagram', 'social', 'organico'], false, 3, true),
  ('Landing Page de Vendas', 'landing-page-vendas', 'Criação de landing page otimizada para conversão.', 'Design e Criação', 'Consultoria XYZ', NULL, NULL, 'Taxa de conversão de 12%', ARRAY['landing-page', 'design', 'conversao'], false, 4, true);

-- Leads de exemplo
INSERT INTO leads (nome, email, telefone, empresa, mensagem, servicos, orcamento_min, orcamento_max, origem, status, prioridade)
VALUES
  ('João Silva', 'joao@empresa.com', '81999990001', 'Empresa ABC', 'Gostaria de saber mais sobre gestão de redes sociais.', ARRAY['Gestão de Redes Sociais'], 3000, 5000, 'site_contato', 'novo', 'alta'),
  ('Maria Oliveira', 'maria@startup.io', '81999990002', 'Startup IO', 'Preciso de tráfego pago e branding.', ARRAY['Tráfego Pago', 'Branding e Posicionamento'], 5000, 10000, 'site_contato', 'contato_realizado', 'alta'),
  ('Carlos Santos', 'carlos@loja.com', '81999990003', 'Loja Online', 'Quero melhorar minhas vendas online.', ARRAY['Tráfego Pago', 'Gestão de Redes Sociais'], 2000, 4000, 'whatsapp', 'qualificado', 'media'),
  ('Ana Costa', 'ana@restaurante.com', '81999990004', 'Restaurante Sabor', 'Preciso de produção de conteúdo.', ARRAY['Produção de Conteúdo', 'Design e Criação'], 1500, 3000, 'site_contato', 'proposta_enviada', 'media'),
  ('Pedro Almeida', 'pedro@tech.com', '81999990005', 'Tech Solutions', 'Interesse em pacote completo.', ARRAY['Pacote Completo'], 8000, 15000, 'site_contato', 'negociacao', 'alta'),
  ('Fernanda Lima', 'fernanda@moda.com', '81999990006', 'Moda Express', 'Quero crescer no Instagram.', ARRAY['Gestão de Redes Sociais', 'Produção Audiovisual'], 4000, 7000, 'whatsapp', 'convertido', 'media'),
  ('Roberto Dias', 'roberto@auto.com', '81999990007', 'Auto Center', 'Não tenho interesse no momento.', ARRAY['Assessoria e Estratégia'], 2000, 3000, 'site_contato', 'perdido', 'baixa');

-- Agendamentos de exemplo
INSERT INTO agendamentos (nome, email, telefone, empresa, servicos, orcamento_min, orcamento_max, data_agendamento, horario, preferencia, mensagem, status)
VALUES
  ('João Silva', 'joao@empresa.com', '81999990001', 'Empresa ABC', ARRAY['Gestão de Redes Sociais'], 3000, 5000, CURRENT_DATE + INTERVAL '2 days', '10:00', 'whatsapp', 'Primeira reunião para alinhamento.', 'confirmado'),
  ('Maria Oliveira', 'maria@startup.io', '81999990002', 'Startup IO', ARRAY['Tráfego Pago', 'Branding e Posicionamento'], 5000, 10000, CURRENT_DATE + INTERVAL '3 days', '14:00', 'email', 'Apresentação de proposta.', 'pendente'),
  ('Carlos Santos', 'carlos@loja.com', '81999990003', 'Loja Online', ARRAY['Tráfego Pago'], 2000, 4000, CURRENT_DATE - INTERVAL '1 day', '09:00', 'whatsapp', NULL, 'realizado'),
  ('Lucas Mendes', 'lucas@agencia.com', '81999990008', NULL, ARRAY['Assessoria e Estratégia'], 0, 0, CURRENT_DATE + INTERVAL '5 days', '16:00', 'telefone', 'Quero entender os serviços.', 'pendente');
