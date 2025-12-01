// ===== Portfolio Types =====
export interface PortfolioItemDTO {
  id?: number;
  titulo: string;
  slug: string;
  descricao?: string;
  categoria: string;
  cliente?: string;
  imagemCapa?: string;
  url?: string; // video_url no backend
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
  id: number;
}

// ===== Lead Types =====
export interface LeadDTO {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[]; // Obrigatório
  orcamentoMin?: number;
  orcamentoMax?: number;
  origem: string;
  landingPageId?: number;
  status?: string;
  prioridade?: string;
  createdAt?: string;
}

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[]; // Obrigatório - pelo menos um serviço
  orcamentoMin?: number;
  orcamentoMax?: number;
  origem: string;
  landingPageId?: number;
  status?: string;
  prioridade?: string;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {
  id: number;
}

// ===== Agendamento Types =====
export interface AgendamentoDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  servico: string;
  dataHora: string;
  duracao: number;
  mensagem?: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'realizado';
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
  dataAgendamento: string; // formato: "2024-11-25"
  horario: string; // formato: "14:00"
  preferencia?: 'whatsapp' | 'email' | 'telefone';
}

export interface UpdateAgendamentoDTO extends Partial<AgendamentoRequestDTO> {
  id: number;
  status?: 'pendente' | 'confirmado' | 'cancelado' | 'realizado';
  notificado?: boolean;
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
