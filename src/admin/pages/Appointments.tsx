import { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import type { AgendamentoDTO, AgendamentoStatus, AgendamentoRequestDTO } from '@/types/admin';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  CalendarDays,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  Trash2,
  Plus,
  Eye,
  MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_CONFIG: Record<AgendamentoStatus, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: 'Pendente', color: '#f59e0b', icon: Clock },
  confirmado: { label: 'Confirmado', color: '#22c55e', icon: CheckCircle2 },
  cancelado: { label: 'Cancelado', color: '#ef4444', icon: XCircle },
  realizado: { label: 'Realizado', color: '#3b82f6', icon: CheckCircle2 },
};

export default function Appointments() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [editItem, setEditItem] = useState<AgendamentoDTO | null>(null);
  const [detailItem, setDetailItem] = useState<AgendamentoDTO | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAg, setNewAg] = useState<AgendamentoRequestDTO>({
    nome: '', email: '', telefone: '', empresa: '', mensagem: '',
    servicos: [], orcamentoMin: 0, orcamentoMax: 0,
    dataAgendamento: '', horario: '', preferencia: 'whatsapp',
  });

  useEffect(() => {
    loadAgendamentos();
  }, []);

  async function loadAgendamentos() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAgendamentos();
      setAgendamentos(data);
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return agendamentos.filter((a) => {
      const matchesSearch =
        !search.trim() ||
        a.nome.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'todos' || a.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [agendamentos, search, filterStatus]);

  async function handleStatusChange(id: string, newStatus: AgendamentoStatus) {
    // Optimistic update
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    try {
      await api.updateAgendamento(id, { id, status: newStatus });
      toast.success(`Status atualizado para "${STATUS_CONFIG[newStatus].label}".`);
    } catch {
      toast.error('Erro ao atualizar status.');
      loadAgendamentos();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.deleteAgendamento(deleteId);
      setAgendamentos((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success('Agendamento removido.');
    } catch {
      toast.error('Erro ao remover agendamento.');
    } finally {
      setDeleteId(null);
    }
  }

  async function handleEditSave() {
    if (!editItem?.id) return;
    setSaving(true);
    try {
      await api.updateAgendamento(editItem.id, {
        id: editItem.id,
        nome: editItem.nome,
        email: editItem.email,
        telefone: editItem.telefone,
        empresa: editItem.empresa,
        dataAgendamento: editItem.dataAgendamento,
        horario: editItem.horario,
        status: editItem.status,
        mensagem: editItem.mensagem,
      });
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === editItem.id ? editItem : a))
      );
      toast.success('Agendamento atualizado.');
      setEditItem(null);
    } catch {
      toast.error('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAgendamento() {
    if (!newAg.nome || !newAg.email || !newAg.telefone) {
      toast.error('Nome, email e telefone são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const created = await api.createAgendamentoWithLead(newAg);
      setAgendamentos((prev) => [created, ...prev]);
      toast.success('Agendamento criado (lead também gerado).');
      setIsCreating(false);
      setNewAg({
        nome: '', email: '', telefone: '', empresa: '', mensagem: '',
        servicos: [], orcamentoMin: 0, orcamentoMax: 0,
        dataAgendamento: '', horario: '', preferencia: 'whatsapp',
      });
    } catch {
      toast.error('Erro ao criar agendamento.');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={loadAgendamentos} className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie todos os agendamentos de consultoria.{' '}
            <span className="text-purple-400">{agendamentos.length} total</span>
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-500 shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10">
            <SelectItem value="todos" className="text-white">Todos os Status</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key} className="text-white">
                {cfg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-16">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 font-medium">Contato</th>
                  <th className="text-left py-3 px-4 font-medium">Serviços</th>
                  <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-center py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pendente;
                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <p className="text-white font-medium">{item.nome}</p>
                        {item.empresa && <p className="text-gray-500 text-xs">{item.empresa}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-300 text-xs">{item.email}</p>
                        <p className="text-gray-500 text-xs">{item.telefone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(item.servicos ?? []).slice(0, 2).map((s) => (
                            <Badge key={s} variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-[10px]">
                              {s}
                            </Badge>
                          ))}
                          {(item.servicos ?? []).length > 2 && (
                            <Badge variant="secondary" className="bg-white/5 text-gray-500 text-[10px]">
                              +{item.servicos!.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                          {item.dataAgendamento
                            ? new Date(item.dataAgendamento + 'T00:00:00').toLocaleDateString('pt-BR')
                            : '—'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {item.horario || '—'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: `${cfg.color}20`,
                            color: cfg.color,
                            borderColor: `${cfg.color}40`,
                          }}
                        >
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                            <DropdownMenuItem className="text-white" onClick={() => setDetailItem(item)}>
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white" onClick={() => setEditItem(item)}>
                              Editar
                            </DropdownMenuItem>
                            {item.status === 'pendente' && (
                              <DropdownMenuItem className="text-green-400" onClick={() => item.id && handleStatusChange(item.id, 'confirmado')}>
                                Confirmar
                              </DropdownMenuItem>
                            )}
                            {(item.status === 'pendente' || item.status === 'confirmado') && (
                              <DropdownMenuItem className="text-red-400" onClick={() => item.id && handleStatusChange(item.id, 'cancelado')}>
                                Cancelar
                              </DropdownMenuItem>
                            )}
                            {item.status === 'confirmado' && (
                              <DropdownMenuItem className="text-blue-400" onClick={() => item.id && handleStatusChange(item.id, 'realizado')}>
                                Marcar como Realizado
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-400" onClick={() => item.id && setDeleteId(item.id)}>
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nome</label>
                  <Input value={editItem.nome} onChange={(e) => setEditItem({ ...editItem, nome: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Empresa</label>
                  <Input value={editItem.empresa || ''} onChange={(e) => setEditItem({ ...editItem, empresa: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <Input value={editItem.email} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Telefone</label>
                  <Input value={editItem.telefone} onChange={(e) => setEditItem({ ...editItem, telefone: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Data</label>
                  <Input type="date" value={editItem.dataAgendamento || ''} onChange={(e) => setEditItem({ ...editItem, dataAgendamento: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Horário</label>
                  <Input type="time" value={editItem.horario || ''} onChange={(e) => setEditItem({ ...editItem, horario: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <Select value={editItem.status} onValueChange={(v) => setEditItem({ ...editItem, status: v as AgendamentoStatus })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key} className="text-white">{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Mensagem</label>
                <Input value={editItem.mensagem || ''} onChange={(e) => setEditItem({ ...editItem, mensagem: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setEditItem(null)} className="text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleEditSave} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover agendamento?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta ação não pode ser desfeita. O agendamento será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Dialog (read-only) */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nome</p>
                  <p className="text-sm text-white">{detailItem.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="text-sm text-white">{detailItem.empresa || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white">{detailItem.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm text-white">{detailItem.telefone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="text-sm text-white">
                    {detailItem.dataAgendamento
                      ? new Date(detailItem.dataAgendamento + 'T00:00:00').toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Horário</p>
                  <p className="text-sm text-white">{detailItem.horario || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge
                  className="text-xs mt-1"
                  style={{
                    backgroundColor: `${STATUS_CONFIG[detailItem.status]?.color || '#6b7280'}20`,
                    color: STATUS_CONFIG[detailItem.status]?.color || '#6b7280',
                    borderColor: `${STATUS_CONFIG[detailItem.status]?.color || '#6b7280'}40`,
                  }}
                >
                  {STATUS_CONFIG[detailItem.status]?.label || detailItem.status}
                </Badge>
              </div>
              {detailItem.servicos && detailItem.servicos.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Serviços</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailItem.servicos.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {detailItem.mensagem && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Mensagem do Cliente
                  </p>
                  <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg whitespace-pre-wrap">{detailItem.mensagem}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Criado em</p>
                <p className="text-sm text-gray-400">
                  {detailItem.createdAt
                    ? new Date(detailItem.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-white">Fechar</Button>
            <Button onClick={() => { setEditItem(detailItem); setDetailItem(null); }} className="bg-purple-600 hover:bg-purple-500">Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nome *</Label>
                <Input value={newAg.nome} onChange={(e) => setNewAg({ ...newAg, nome: e.target.value })} placeholder="Nome completo" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Empresa</Label>
                <Input value={newAg.empresa || ''} onChange={(e) => setNewAg({ ...newAg, empresa: e.target.value })} placeholder="Empresa" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email *</Label>
                <Input type="email" value={newAg.email} onChange={(e) => setNewAg({ ...newAg, email: e.target.value })} placeholder="email@exemplo.com" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Telefone *</Label>
                <Input value={newAg.telefone} onChange={(e) => setNewAg({ ...newAg, telefone: e.target.value })} placeholder="(00) 00000-0000" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Data</Label>
                <Input type="date" value={newAg.dataAgendamento} onChange={(e) => setNewAg({ ...newAg, dataAgendamento: e.target.value })} min={new Date().toISOString().split('T')[0]} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Horário</Label>
                <Input type="time" value={newAg.horario} onChange={(e) => setNewAg({ ...newAg, horario: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Mensagem</Label>
              <Textarea value={newAg.mensagem || ''} onChange={(e) => setNewAg({ ...newAg, mensagem: e.target.value })} placeholder="Observações sobre o agendamento..." rows={3} className="bg-white/5 border-white/10 text-white resize-none" />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">Cancelar</Button>
            <Button onClick={handleCreateAgendamento} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
