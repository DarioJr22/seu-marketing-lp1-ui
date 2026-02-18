import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { DashboardStats, LeadDTO } from '@/types/admin';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  CalendarDays,
  Briefcase,
  TrendingUp,
  UserPlus,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  novo: '#8b5cf6',
  contato_realizado: '#3b82f6',
  qualificado: '#10b981',
  proposta_enviada: '#f59e0b',
  negociacao: '#f97316',
  convertido: '#22c55e',
  perdido: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contato_realizado: 'Contatado',
  qualificado: 'Qualificado',
  proposta_enviada: 'Proposta',
  negociacao: 'Negociação',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [statsData, leadsData] = await Promise.all([
        api.getDashboardStats(),
        api.getLeads(),
      ]);
      setStats(statsData);
      setLeads(leadsData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Dados para gráfico de leads por status
  const leadsByStatus = Object.entries(
    leads.reduce<Record<string, number>>((acc, lead) => {
      const status = lead.status || 'novo';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#6b7280',
  }));

  // Dados para gráfico de leads por dia (últimos 14 dias)
  const leadsOverTime = (() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }
    leads.forEach((lead) => {
      if (lead.createdAt) {
        const key = new Date(lead.createdAt).toISOString().split('T')[0];
        if (days[key] !== undefined) days[key]++;
      }
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      leads: count,
    }));
  })();

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Visão geral do seu negócio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard icon={Users} label="Total Leads" value={stats?.totalLeads} loading={loading} color="purple" />
        <KPICard icon={UserPlus} label="Leads Novos" value={stats?.leadsNovos} loading={loading} color="blue" />
        <KPICard icon={CalendarDays} label="Agendamentos" value={stats?.totalAgendamentos} loading={loading} color="green" />
        <KPICard icon={Clock} label="Pendentes" value={stats?.agendamentosPendentes} loading={loading} color="yellow" />
        <KPICard icon={Briefcase} label="Portfólio" value={stats?.totalPortfolio} loading={loading} color="pink" />
        <KPICard icon={TrendingUp} label="Conversão" value={stats ? `${stats.taxaConversao}%` : undefined} loading={loading} color="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads over time */}
        <Card className="bg-white/[0.03] border-white/10 p-6">
          <h3 className="text-white font-medium mb-4">Leads nos últimos 14 dias</h3>
          {loading ? (
            <Skeleton className="h-[250px] bg-white/5" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Leads by status */}
        <Card className="bg-white/[0.03] border-white/10 p-6">
          <h3 className="text-white font-medium mb-4">Leads por Status</h3>
          {loading ? (
            <Skeleton className="h-[250px] bg-white/5" />
          ) : leadsByStatus.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie data={leadsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {leadsByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {leadsByStatus.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-400">{entry.name}</span>
                    <span className="text-white font-medium ml-auto">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-16">Nenhum lead encontrado</p>
          )}
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="bg-white/[0.03] border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Leads Recentes</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-2 pr-4 font-medium">Nome</th>
                  <th className="text-left py-2 pr-4 font-medium">Email</th>
                  <th className="text-left py-2 pr-4 font-medium">Empresa</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 text-white">{lead.nome}</td>
                    <td className="py-2.5 pr-4 text-gray-400">{lead.email}</td>
                    <td className="py-2.5 pr-4 text-gray-400">{lead.empresa || '—'}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[lead.status || 'novo']}20`,
                          color: STATUS_COLORS[lead.status || 'novo'],
                        }}
                      >
                        {STATUS_LABELS[lead.status || 'novo'] || lead.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ===== KPI Card Component =====

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value?: string | number;
  loading?: boolean;
  color: string;
}

const colorMap: Record<string, string> = {
  purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  green: 'from-green-600/20 to-green-600/5 border-green-500/30 text-green-400',
  yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400',
  pink: 'from-pink-600/20 to-pink-600/5 border-pink-500/30 text-pink-400',
  emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
};

function KPICard({ icon: Icon, label, value, loading, color }: KPICardProps) {
  return (
    <Card className={`bg-gradient-to-br ${colorMap[color]} border p-4`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400 truncate">{label}</p>
          {loading ? (
            <Skeleton className="h-6 w-12 bg-white/10 mt-1" />
          ) : (
            <p className="text-xl font-bold text-white">{value ?? 0}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
