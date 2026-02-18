import { supabase } from '../lib/supabase';
import { 
  PortfolioItemDTO, 
  CreatePortfolioItemDTO, 
  UpdatePortfolioItemDTO,
  LeadDTO,
  CreateLeadDTO,
  UpdateLeadDTO,
  AgendamentoDTO,
  AgendamentoRequestDTO,
  UpdateAgendamentoDTO,
  DashboardStats,
  ReviewDTO,
  CreateReviewDTO
} from '../types/admin';

// ===== Mappers: DB (snake_case) <-> DTO (camelCase) =====

function portfolioFromDb(row: Record<string, unknown>): PortfolioItemDTO {
  return {
    id: row.id as string,
    titulo: row.titulo as string,
    slug: row.slug as string,
    descricao: row.descricao as string | undefined,
    categoria: row.categoria as string,
    cliente: row.cliente as string | undefined,
    imagemCapa: row.imagem_capa as string | undefined,
    url: row.url as string | undefined,
    resultado: row.resultado as string | undefined,
    tags: row.tags as string[] | undefined,
    destaque: row.destaque as boolean,
    ordem: row.ordem as number,
    ativo: row.ativo as boolean,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function portfolioToDb(dto: CreatePortfolioItemDTO) {
  return {
    titulo: dto.titulo,
    slug: dto.slug,
    descricao: dto.descricao ?? null,
    categoria: dto.categoria,
    cliente: dto.cliente ?? null,
    imagem_capa: dto.imagemCapa ?? null,
    url: dto.url ?? null,
    resultado: dto.resultado ?? null,
    tags: dto.tags ?? [],
    destaque: dto.destaque ?? false,
    ordem: dto.ordem ?? 0,
    ativo: dto.ativo ?? true,
  };
}

function leadFromDb(row: Record<string, unknown>): LeadDTO {
  return {
    id: row.id as string,
    nome: row.nome as string,
    email: row.email as string,
    telefone: row.telefone as string | undefined,
    empresa: row.empresa as string | undefined,
    mensagem: row.mensagem as string | undefined,
    servicos: (row.servicos as string[]) ?? [],
    orcamentoMin: row.orcamento_min as number | undefined,
    orcamentoMax: row.orcamento_max as number | undefined,
    origem: row.origem as string,
    landingPageId: row.landing_page_id as number | undefined,
    status: row.status as string | undefined,
    prioridade: row.prioridade as string | undefined,
    observacoes: row.observacoes as string | undefined,
    valorEstimado: row.valor_estimado as number | undefined,
    createdAt: row.created_at as string | undefined,
  };
}

function leadToDb(dto: CreateLeadDTO) {
  return {
    nome: dto.nome,
    email: dto.email,
    telefone: dto.telefone ?? null,
    empresa: dto.empresa ?? null,
    mensagem: dto.mensagem ?? null,
    servicos: dto.servicos ?? [],
    orcamento_min: dto.orcamentoMin ?? 0,
    orcamento_max: dto.orcamentoMax ?? 0,
    origem: dto.origem,
    landing_page_id: dto.landingPageId ?? null,
    status: dto.status ?? 'novo',
    prioridade: dto.prioridade ?? 'media',
    observacoes: dto.observacoes ?? null,
    valor_estimado: dto.valorEstimado ?? 0,
  };
}

function agendamentoFromDb(row: Record<string, unknown>): AgendamentoDTO {
  return {
    id: row.id as string,
    leadId: row.lead_id as string | undefined,
    nome: row.nome as string,
    email: row.email as string,
    telefone: row.telefone as string,
    empresa: row.empresa as string | undefined,
    servicos: (row.servicos as string[]) ?? [],
    orcamentoMin: row.orcamento_min as number | undefined,
    orcamentoMax: row.orcamento_max as number | undefined,
    dataAgendamento: row.data_agendamento as string | undefined,
    horario: row.horario as string | undefined,
    preferencia: row.preferencia as string | undefined,
    mensagem: row.mensagem as string | undefined,
    status: (row.status as AgendamentoDTO['status']) ?? 'pendente',
    notificado: (row.notificado as boolean) ?? false,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function agendamentoToDb(dto: AgendamentoRequestDTO) {
  return {
    nome: dto.nome,
    email: dto.email,
    telefone: dto.telefone,
    empresa: dto.empresa ?? null,
    mensagem: dto.mensagem ?? null,
    servicos: dto.servicos ?? [],
    orcamento_min: dto.orcamentoMin ?? 0,
    orcamento_max: dto.orcamentoMax ?? 0,
    data_agendamento: dto.dataAgendamento,
    horario: dto.horario,
    preferencia: dto.preferencia ?? 'whatsapp',
    lead_id: dto.leadId ?? null,
  };
}

// ===== API Service usando Supabase =====

class ApiService {

  // ===== Portfolio Methods =====

  async getPortfolioItems(): Promise<PortfolioItemDTO[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(portfolioFromDb);
  }

  async getPortfolioItem(id: string): Promise<PortfolioItemDTO> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return portfolioFromDb(data);
  }

  async createPortfolioItem(dto: CreatePortfolioItemDTO): Promise<PortfolioItemDTO> {
    const { data, error } = await supabase
      .from('portfolio')
      .insert(portfolioToDb(dto))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return portfolioFromDb(data);
  }

  async updatePortfolioItem(id: string, dto: UpdatePortfolioItemDTO): Promise<PortfolioItemDTO> {
    const updateData: Record<string, unknown> = {};
    if (dto.titulo !== undefined) updateData.titulo = dto.titulo;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.descricao !== undefined) updateData.descricao = dto.descricao;
    if (dto.categoria !== undefined) updateData.categoria = dto.categoria;
    if (dto.cliente !== undefined) updateData.cliente = dto.cliente;
    if (dto.imagemCapa !== undefined) updateData.imagem_capa = dto.imagemCapa;
    if (dto.url !== undefined) updateData.url = dto.url;
    if (dto.resultado !== undefined) updateData.resultado = dto.resultado;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.destaque !== undefined) updateData.destaque = dto.destaque;
    if (dto.ordem !== undefined) updateData.ordem = dto.ordem;
    if (dto.ativo !== undefined) updateData.ativo = dto.ativo;

    const { data, error } = await supabase
      .from('portfolio')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return portfolioFromDb(data);
  }

  async deletePortfolioItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // ===== Lead Methods =====

  async getLeads(): Promise<LeadDTO[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(leadFromDb);
  }

  async getLead(id: string): Promise<LeadDTO> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return leadFromDb(data);
  }

  async createLead(dto: CreateLeadDTO): Promise<LeadDTO> {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadToDb(dto))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return leadFromDb(data);
  }

  async updateLead(id: string, dto: UpdateLeadDTO): Promise<LeadDTO> {
    const updateData: Record<string, unknown> = {};
    if (dto.nome !== undefined) updateData.nome = dto.nome;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.telefone !== undefined) updateData.telefone = dto.telefone;
    if (dto.empresa !== undefined) updateData.empresa = dto.empresa;
    if (dto.mensagem !== undefined) updateData.mensagem = dto.mensagem;
    if (dto.servicos !== undefined) updateData.servicos = dto.servicos;
    if (dto.orcamentoMin !== undefined) updateData.orcamento_min = dto.orcamentoMin;
    if (dto.orcamentoMax !== undefined) updateData.orcamento_max = dto.orcamentoMax;
    if (dto.origem !== undefined) updateData.origem = dto.origem;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.prioridade !== undefined) updateData.prioridade = dto.prioridade;
    if (dto.observacoes !== undefined) updateData.observacoes = dto.observacoes;
    if (dto.valorEstimado !== undefined) updateData.valor_estimado = dto.valorEstimado;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return leadFromDb(data);
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // ===== Agendamento Methods =====

  async getAgendamentos(): Promise<AgendamentoDTO[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(agendamentoFromDb);
  }

  async getAgendamento(id: string): Promise<AgendamentoDTO> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return agendamentoFromDb(data);
  }

  async createAgendamento(dto: AgendamentoRequestDTO): Promise<AgendamentoDTO> {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert(agendamentoToDb(dto))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return agendamentoFromDb(data);
  }

  async updateAgendamento(id: string, dto: UpdateAgendamentoDTO): Promise<AgendamentoDTO> {
    const updateData: Record<string, unknown> = {};
    if (dto.nome !== undefined) updateData.nome = dto.nome;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.telefone !== undefined) updateData.telefone = dto.telefone;
    if (dto.empresa !== undefined) updateData.empresa = dto.empresa;
    if (dto.mensagem !== undefined) updateData.mensagem = dto.mensagem;
    if (dto.servicos !== undefined) updateData.servicos = dto.servicos;
    if (dto.orcamentoMin !== undefined) updateData.orcamento_min = dto.orcamentoMin;
    if (dto.orcamentoMax !== undefined) updateData.orcamento_max = dto.orcamentoMax;
    if (dto.dataAgendamento !== undefined) updateData.data_agendamento = dto.dataAgendamento;
    if (dto.horario !== undefined) updateData.horario = dto.horario;
    if (dto.preferencia !== undefined) updateData.preferencia = dto.preferencia;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.notificado !== undefined) updateData.notificado = dto.notificado;
    if (dto.leadId !== undefined) updateData.lead_id = dto.leadId;

    const { data, error } = await supabase
      .from('agendamentos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return agendamentoFromDb(data);
  }

  async deleteAgendamento(id: string): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // ===== Dashboard Stats =====

  async getDashboardStats(): Promise<DashboardStats> {
    const [leadsRes, agendRes, portfolioRes] = await Promise.all([
      supabase.from('leads').select('id, status, created_at'),
      supabase.from('agendamentos').select('id, status'),
      supabase.from('portfolio').select('id'),
    ]);

    const leads = leadsRes.data ?? [];
    const agendamentos = agendRes.data ?? [];
    const portfolio = portfolioRes.data ?? [];

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const leadsNovos = leads.filter(
      (l) => l.status === 'novo' || new Date(l.created_at) >= sevenDaysAgo
    ).length;

    const convertidos = leads.filter((l) => l.status === 'convertido').length;
    const taxaConversao = leads.length > 0 ? (convertidos / leads.length) * 100 : 0;
    const agendamentosPendentes = agendamentos.filter((a) => a.status === 'pendente').length;

    return {
      totalLeads: leads.length,
      totalAgendamentos: agendamentos.length,
      totalPortfolio: portfolio.length,
      taxaConversao: Math.round(taxaConversao * 10) / 10,
      agendamentosPendentes,
      leadsNovos,
    };
  }

  // ===== Agendamento + Lead combo =====

  async createAgendamentoWithLead(dto: AgendamentoRequestDTO): Promise<AgendamentoDTO> {
    // Create a lead first
    const leadData = {
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone ?? null,
      empresa: dto.empresa ?? null,
      mensagem: dto.mensagem ?? null,
      servicos: dto.servicos ?? [],
      orcamento_min: dto.orcamentoMin ?? 0,
      orcamento_max: dto.orcamentoMax ?? 0,
      origem: 'agendamento',
      status: 'novo',
      prioridade: 'alta',
    };

    const { data: leadRow, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (leadError) throw new Error(leadError.message);

    // Then create appointment linked to lead
    const agendData = {
      ...agendamentoToDb(dto),
      lead_id: leadRow.id,
    };

    const { data, error } = await supabase
      .from('agendamentos')
      .insert(agendData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return agendamentoFromDb(data);
  }

  // ===== Review Methods =====

  async getReviews(): Promise<ReviewDTO[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(reviewFromDb);
  }

  async getActiveReviews(): Promise<ReviewDTO[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(reviewFromDb);
  }

  async createReview(dto: CreateReviewDTO): Promise<ReviewDTO> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewToDb(dto))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return reviewFromDb(data);
  }

  async updateReview(id: string, dto: Partial<CreateReviewDTO>): Promise<ReviewDTO> {
    const updateData: Record<string, unknown> = {};
    if (dto.nome !== undefined) updateData.nome = dto.nome;
    if (dto.cargo !== undefined) updateData.cargo = dto.cargo;
    if (dto.empresa !== undefined) updateData.empresa = dto.empresa;
    if (dto.texto !== undefined) updateData.texto = dto.texto;
    if (dto.nota !== undefined) updateData.nota = dto.nota;
    if (dto.avatarUrl !== undefined) updateData.avatar_url = dto.avatarUrl;
    if (dto.ativo !== undefined) updateData.ativo = dto.ativo;
    if (dto.ordem !== undefined) updateData.ordem = dto.ordem;

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return reviewFromDb(data);
  }

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

// ===== Review Mappers =====

function reviewFromDb(row: Record<string, unknown>): ReviewDTO {
  return {
    id: row.id as string,
    nome: row.nome as string,
    cargo: row.cargo as string | undefined,
    empresa: row.empresa as string | undefined,
    texto: row.texto as string,
    nota: row.nota as number,
    avatarUrl: row.avatar_url as string | undefined,
    ativo: (row.ativo as boolean) ?? true,
    ordem: (row.ordem as number) ?? 0,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function reviewToDb(dto: CreateReviewDTO) {
  return {
    nome: dto.nome,
    cargo: dto.cargo ?? null,
    empresa: dto.empresa ?? null,
    texto: dto.texto,
    nota: dto.nota ?? 5,
    avatar_url: dto.avatarUrl ?? null,
    ativo: dto.ativo ?? true,
    ordem: dto.ordem ?? 0,
  };
}

export const api = new ApiService();
