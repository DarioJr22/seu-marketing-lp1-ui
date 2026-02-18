# 🚀 Guia de Migração — Supabase + Admin Panel + Google Analytics

## O que foi feito

Este documento descreve todas as alterações realizadas na migração do backend customizado + MinIO para Supabase, criação do painel administrativo e integração com Google Analytics.

---

## 📁 Arquivos Criados

### Configuração
| Arquivo | Descrição |
|---|---|
| `.env` | Variáveis de ambiente com credenciais Supabase e GA |
| `.env.example` | Template de variáveis de ambiente (sem segredos) |
| `src/lib/supabase.ts` | Cliente Supabase + helpers de Storage (upload, delete, getUrl) |
| `src/lib/analytics.ts` | Helper completo do Google Analytics 4 com eventos customizados |

### SQL Migrations
| Arquivo | Descrição |
|---|---|
| `supabase/migrations/001_create_portfolio.sql` | Tabela `portfolio` com RLS e triggers |
| `supabase/migrations/002_create_leads.sql` | Tabela `leads` com RLS (anon insert, auth read/update/delete) |
| `supabase/migrations/003_create_appointments.sql` | Tabela `agendamentos` com RLS (anon insert, auth read/update/delete) |
| `supabase/migrations/004_create_storage_buckets.sql` | Buckets `portfolio-images` e `site-assets` com políticas |
| `supabase/seed.sql` | Dados de exemplo para todas as tabelas |

### Painel Administrativo
| Arquivo | Descrição |
|---|---|
| `src/admin/hooks/useAuth.ts` | Hook de autenticação Supabase (login, logout, session) |
| `src/admin/components/ProtectedRoute.tsx` | Componente que protege rotas admin |
| `src/admin/components/Sidebar.tsx` | Sidebar com navegação e collapse |
| `src/admin/components/Layout.tsx` | Layout base do admin (sidebar + content + toaster) |
| `src/admin/pages/Login.tsx` | Página de login com email/senha |
| `src/admin/pages/Dashboard.tsx` | Dashboard com KPIs, gráficos e leads recentes |
| `src/admin/pages/LeadsKanban.tsx` | Kanban drag & drop com 7 colunas de status |
| `src/admin/pages/Appointments.tsx` | Tabela de agendamentos com filtros e CRUD |
| `src/admin/pages/Portfolio.tsx` | CRUD completo de portfólio com upload de imagens |

---

## 📝 Arquivos Modificados

| Arquivo | O que mudou |
|---|---|
| `src/types/admin.ts` | IDs mudaram de `number` para `string` (UUID), novos tipos `LeadStatus`, `AgendamentoStatus`. O DTO de agendamento agora reflete a estrutura real do DB |
| `src/services/api.ts` | Reescrito para usar Supabase ao invés de fetch HTTP. Mappers snake_case ↔ camelCase mantêm compatibilidade com DTOs existentes |
| `src/App.tsx` | Adicionado React Router com rotas `/` (landing page) e `/admin/*` (painel admin com lazy loading) |
| `src/main.tsx` | Adicionado `BrowserRouter` e `QueryClientProvider` envolvendo o App |
| `index.html` | Adicionado script do Google Analytics 4 (gtag.js) |
| `src/components/ContactSection.tsx` | Adicionado `trackLeadSubmit()` ao submeter formulário |
| `src/components/ScheduleModal.tsx` | Adicionado `trackAppointmentSubmit()` ao agendar |
| `package.json` | Novas dependências: `@supabase/supabase-js`, `react-router-dom`, `@dnd-kit/*`, `@tanstack/react-query` |

---

## 🔧 Como Configurar

### 1. Aplicar as Migrations no Supabase

Acesse o [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → **SQL Editor** e execute as migrations na ordem:

```
1. supabase/migrations/001_create_portfolio.sql
2. supabase/migrations/002_create_leads.sql
3. supabase/migrations/003_create_appointments.sql
4. supabase/migrations/004_create_storage_buckets.sql
5. supabase/seed.sql (opcional - dados de exemplo)
```

> **Importante:** Execute na ordem pois a migration 001 cria a função `update_updated_at()` usada pelas demais.

### 2. Criar Usuário Admin

No Supabase Dashboard → **Authentication** → **Users** → **Add User**:
- Email: `admin@seumarketing.com` (ou o desejado)
- Senha: defina uma senha forte
- Marque "Auto Confirm User"

### 3. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:
```env
VITE_SUPABASE_URL=https://fuaasqsnelktuhkjakyt.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_GA_MEASUREMENT_ID=G-SEU-ID  # Substituir pelo ID real do GA4
```

### 4. Configurar Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade GA4
3. Copie o Measurement ID (formato `G-XXXXXXXXXX`)
4. Substitua em `.env` e em `index.html` (duas ocorrências de `G-XXXXXXXXXX`)

### 5. Instalar Dependências e Rodar

```bash
npm install
npm run dev
```

---

## 🧪 Como Testar

### Teste 1: Landing Page (formulários públicos)

1. **Acesse** `http://localhost:5173/`
2. **Teste o formulário de contato** (seção "Contato"):
   - Preencha nome, email, serviços
   - Clique em "Enviar Mensagem"
   - **Verificar:** Lead deve aparecer na tabela `leads` no Supabase
3. **Teste o agendamento** (botão "Agendar Horário" no header):
   - Preencha dados, selecione data, hora e serviço
   - Clique em "Agendar"
   - **Verificar:** Registro deve aparecer na tabela `agendamentos` no Supabase
4. **Portfólio público**:
   - A seção de portfólio deve carregar items da tabela `portfolio`
   - Se executou o seed.sql, 4 projetos devem aparecer

### Teste 2: Login Admin

1. **Acesse** `http://localhost:5173/admin/login`
2. **Login** com email e senha do usuário criado no passo 2
3. **Verificar:** Redirecionamento para `/admin` (Dashboard)
4. **Teste logout:** Clique em "Sair" na sidebar

### Teste 3: Dashboard

1. **Acesse** `/admin` após login
2. **Verificar:**
   - KPI cards com contadores (leads, agendamentos, portfólio)
   - Gráfico de linha (leads nos últimos 14 dias)
   - Gráfico de pizza (leads por status)
   - Tabela de leads recentes

### Teste 4: Kanban de Leads

1. **Acesse** `/admin/leads`
2. **Verificar colunas:** Novo, Contato Realizado, Qualificado, Proposta Enviada, Negociação, Convertido, Perdido
3. **Drag & Drop:**
   - Arraste um card de uma coluna para outra
   - **Verificar:** Status atualizado no Supabase (`leads.status`)
   - Toast de confirmação deve aparecer
4. **Busca:** Digite no campo de busca para filtrar por nome/email/empresa
5. **Detalhes:** Clique em um card para abrir o painel lateral com informações completas
6. **Deletar:** No painel lateral, clique em "Remover Lead"

### Teste 5: Agendamentos

1. **Acesse** `/admin/appointments`
2. **Filtros:** Teste busca por nome e filtro por status
3. **Ações** (menu "..." em cada linha):
   - **Confirmar:** Muda status de pendente para confirmado
   - **Cancelar:** Muda status para cancelado
   - **Editar:** Abre modal para editar dados
   - **Remover:** Confirmação + delete
4. **Verificar:** Todas as alterações refletem no Supabase

### Teste 6: Portfólio (CRUD completo)

1. **Acesse** `/admin/portfolio`
2. **Criar:** Clique em "Novo Projeto"
   - Preencha título (slug gera automaticamente)
   - Faça upload de imagem (verificar no Supabase Storage → bucket `portfolio-images`)
   - Salve e verifique na tabela
3. **Editar:** Clique no ícone de lápis em qualquer projeto
   - Altere campos e salve
4. **Destaque:** Clique na estrela para toggle de destaque
5. **Ativo:** Toggle para ativar/desativar (projetos inativos não aparecem no site)
6. **Deletar:** Clique no ícone de lixeira → confirme
   - **Verificar:** Imagem removida do Storage + registro deletado
7. **Filtros:** Buscar por título/cliente, filtrar por categoria

### Teste 7: Google Analytics

1. Abra o Console do navegador (F12 → Console)
2. Verifique que `window.gtag` está definida
3. Submeta um formulário de contato e verifique no:
   - **GA4 Real-time:** Deve aparecer o evento `form_submit_lead`
   - **Debug View:** Eventos com parâmetros customizados
4. Eventos rastreados:
   - `form_submit_lead` - Formulário de contato
   - `form_submit_appointment` - Agendamento
   - `portfolio_view` - Visualização de projeto
   - `cta_click` - Clique em CTAs
   - `whatsapp_click` - Clique no WhatsApp

### Teste 8: Proteção de Rotas

1. **Sem login:** Acesse `/admin` → deve redirecionar para `/admin/login`
2. **Com login:** Acesse `/admin/login` → deve redirecionar para `/admin`
3. **URL inválida:** Acesse `/qualquer-coisa` → deve redirecionar para `/`

### Teste 9: Storage (Upload de Imagens)

1. No CRUD de portfólio, faça upload de uma imagem
2. Verifique no Supabase Dashboard → **Storage** → bucket `portfolio-images`
3. A imagem deve estar em `covers/slug-do-projeto-timestamp.ext`
4. A URL pública deve estar salva no campo `imagem_capa` do registro

---

## 🏗️ Arquitetura da Migração

### Antes (Backend Customizado)
```
Frontend → fetch() → API REST (Java/Spring) → PostgreSQL
                                             → MinIO Storage
```

### Depois (Supabase)
```
Frontend → @supabase/supabase-js → Supabase API → PostgreSQL
                                                 → Supabase Storage
         → RLS (Row Level Security) controla acesso
```

### Mapeamento de Campos (DB snake_case → DTO camelCase)

| DB Column | DTO Field | Tabela |
|---|---|---|
| `imagem_capa` | `imagemCapa` | portfolio |
| `created_at` | `createdAt` | todas |
| `updated_at` | `updatedAt` | portfolio, agendamentos |
| `orcamento_min` | `orcamentoMin` | leads, agendamentos |
| `orcamento_max` | `orcamentoMax` | leads, agendamentos |
| `landing_page_id` | `landingPageId` | leads |
| `data_agendamento` | `dataAgendamento` | agendamentos |

### Segurança (RLS Policies)

| Tabela | Operação | anon | authenticated |
|---|---|---|---|
| `portfolio` | SELECT | ✅ | ✅ |
| `portfolio` | INSERT/UPDATE/DELETE | ❌ | ✅ |
| `leads` | INSERT | ✅ | ✅ |
| `leads` | SELECT/UPDATE/DELETE | ❌ | ✅ |
| `agendamentos` | INSERT | ✅ | ✅ |
| `agendamentos` | SELECT/UPDATE/DELETE | ❌ | ✅ |

---

## 📦 Novas Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `@supabase/supabase-js` | ^2.x | Cliente Supabase (DB, Auth, Storage) |
| `react-router-dom` | ^7.x | Roteamento SPA |
| `@dnd-kit/core` | ^6.x | Drag & Drop (Kanban) |
| `@dnd-kit/sortable` | ^10.x | Sortable (Kanban) |
| `@dnd-kit/utilities` | ^3.x | Utilitários DnD |
| `@tanstack/react-query` | ^5.x | Cache e gerenciamento de dados |

---

## ⚠️ Notas Importantes

1. **Service Role Key** nunca deve ir no frontend. Apenas `VITE_SUPABASE_ANON_KEY` é exposta.
2. **GA Measurement ID** (`G-XXXXXXXXXX`) precisa ser substituído pelo ID real em dois locais: `.env` e `index.html`.
3. **MinIO** ainda funciona para o vídeo do HeroSection via `VITE_MINIO_ENDPOINT`. Para migrar completamente, suba o vídeo no bucket `site-assets` e ajuste a URL.
4. O **Kanban** usa optimistic updates — a UI atualiza imediatamente e reverte se o Supabase falhar.
5. Todas as páginas admin usam **lazy loading** para não impactar o bundle da landing page.
