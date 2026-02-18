// ===== Portfolio Types =====
export interface PortfolioItemDTO {
  id?: string;
  titulo: string;
  slug: string;
  descricao?: string;
  categoria: string;
  cliente?: string;
  imagemCapa?: string;
  url?: string;
  resultado?: string;
  tags?: string[];
  destaque: boolean;
  ordem: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePortfolioItemDTO {
  titulo: string;
  slug: string;
  descricao?: string;
  categoria: string;
  cliente?: string;
  imagemCapa?: string;
  url?: string;
  resultado?: string;
  tags?: string[];
  destaque?: boolean;
  ordem?: number;
  ativo?: boolean;
}

export interface UpdatePortfolioItemDTO extends Partial<CreatePortfolioItemDTO> {
  id: string;
}

// ===== Lead Types =====
export type LeadStatus =
  | 'novo'
  | 'contato_realizado'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'convertido'
  | 'perdido';

export interface LeadDTO {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[];
  orcamentoMin?: number;
  orcamentoMax?: number;
  origem: string;
  landingPageId?: number;
  status?: LeadStatus;
  prioridade?: string;
  observacoes?: string;
  valorEstimado?: number;
  createdAt?: string;
}

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[];
  orcamentoMin?: number;
  orcamentoMax?: number;
  origem: string;
  landingPageId?: number;
  status?: string;
  prioridade?: string;
  observacoes?: string;
  valorEstimado?: number;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {
  id: string;
}

// ===== Agendamento Types =====
export type AgendamentoStatus = 'pendente' | 'confirmado' | 'cancelado' | 'realizado';

export interface AgendamentoDTO {
  id?: string;
  leadId?: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  servicos?: string[];
  orcamentoMin?: number;
  orcamentoMax?: number;
  dataAgendamento?: string;
  horario?: string;
  preferencia?: string;
  mensagem?: string;
  status: AgendamentoStatus;
  notificado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgendamentoRequestDTO {
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[];
  orcamentoMin?: number;
  orcamentoMax?: number;
  dataAgendamento: string;
  horario: string;
  preferencia?: 'whatsapp' | 'email' | 'telefone';
  leadId?: string;
}

export interface UpdateAgendamentoDTO extends Partial<AgendamentoRequestDTO> {
  id: string;
  status?: AgendamentoStatus;
  notificado?: boolean;
  leadId?: string;
}

// ===== Review Types =====
export interface ReviewDTO {
  id?: string;
  nome: string;
  cargo?: string;
  empresa?: string;
  texto: string;
  nota: number;
  avatarUrl?: string;
  ativo: boolean;
  ordem: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewDTO {
  nome: string;
  cargo?: string;
  empresa?: string;
  texto: string;
  nota?: number;
  avatarUrl?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface UpdateReviewDTO extends Partial<CreateReviewDTO> {
  id: string;
}

// ===== Dashboard Stats Types =====
export interface DashboardStats {
  totalAgendamentos: number;
  totalLeads: number;
  totalPortfolio: number;
  taxaConversao: number;
  agendamentosPendentes: number;
  leadsNovos: number;
}
