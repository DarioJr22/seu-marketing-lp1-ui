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
  DashboardStats
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request Body:', options.body);
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Success:', data);
      return data;
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // ===== Portfolio Methods =====
  async getPortfolioItems(): Promise<PortfolioItemDTO[]> {
    return this.request<PortfolioItemDTO[]>('/portfolio');
  }

  async getPortfolioItem(id: number): Promise<PortfolioItemDTO> {
    return this.request<PortfolioItemDTO>(`/portfolio/${id}`);
  }

  async createPortfolioItem(data: CreatePortfolioItemDTO): Promise<PortfolioItemDTO> {
    return this.request<PortfolioItemDTO>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioItem(id: number, data: UpdatePortfolioItemDTO): Promise<PortfolioItemDTO> {
    return this.request<PortfolioItemDTO>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioItem(id: number): Promise<void> {
    return this.request<void>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== Lead Methods =====
  async getLeads(): Promise<LeadDTO[]> {
    return this.request<LeadDTO[]>('/leads');
  }

  async getLead(id: number): Promise<LeadDTO> {
    return this.request<LeadDTO>(`/leads/${id}`);
  }

  async createLead(data: CreateLeadDTO): Promise<LeadDTO> {
    return this.request<LeadDTO>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: number, data: UpdateLeadDTO): Promise<LeadDTO> {
    return this.request<LeadDTO>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: number): Promise<void> {
    return this.request<void>(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== Agendamento Methods =====
  async getAgendamentos(): Promise<AgendamentoDTO[]> {
    return this.request<AgendamentoDTO[]>('/agendamentos');
  }

  async getAgendamento(id: number): Promise<AgendamentoDTO> {
    return this.request<AgendamentoDTO>(`/agendamentos/${id}`);
  }

  async createAgendamento(data: AgendamentoRequestDTO): Promise<AgendamentoDTO> {
    return this.request<AgendamentoDTO>('/agendamentos/agendar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgendamento(id: number, data: UpdateAgendamentoDTO): Promise<AgendamentoDTO> {
    return this.request<AgendamentoDTO>(`/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgendamento(id: number): Promise<void> {
    return this.request<void>(`/agendamentos/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== Dashboard Stats =====
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats');
  }
}

export const api = new ApiService();
