import { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import type { LeadDTO, LeadStatus, CreateLeadDTO } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  Search,
  Loader2,
  AlertCircle,
  GripVertical,
  Mail,
  Building2,
  Phone,
  Calendar,
  Trash2,
  DollarSign,
  Plus,
  Save,
  StickyNote,
} from 'lucide-react';

// ===== Configuração das Colunas =====

interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  bgColor: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: 'novo', title: 'Novo', color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.1)' },
  { id: 'contato_realizado', title: 'Contato Realizado', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.1)' },
  { id: 'qualificado', title: 'Qualificado', color: '#10b981', bgColor: 'rgba(16,185,129,0.1)' },
  { id: 'proposta_enviada', title: 'Proposta Enviada', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
  { id: 'negociacao', title: 'Negociação', color: '#f97316', bgColor: 'rgba(249,115,22,0.1)' },
  { id: 'convertido', title: 'Convertido', color: '#22c55e', bgColor: 'rgba(34,197,94,0.1)' },
  { id: 'perdido', title: 'Perdido', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
];

// ===== Página Principal =====

export default function LeadsKanban() {
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editObs, setEditObs] = useState('');
  const [editValor, setEditValor] = useState(0);
  const [newLead, setNewLead] = useState<CreateLeadDTO>({
    nome: '', email: '', telefone: '', empresa: '', mensagem: '',
    servicos: [], orcamentoMin: 0, orcamentoMax: 0, origem: 'admin',
    status: 'novo', prioridade: 'media', observacoes: '', valorEstimado: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      setError('Erro ao carregar leads.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filtro de busca
  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.empresa && l.empresa.toLowerCase().includes(q))
    );
  }, [leads, search]);

  // Lead ativo (para DragOverlay)
  const activeLead = useMemo(
    () => leads.find((l) => l.id === activeId) ?? null,
    [leads, activeId]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Verificar se o lead realmente mudou de coluna
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      toast.success(`Lead movido para "${COLUMNS.find((c) => c.id === newStatus)?.title}"`);
    } catch {
      // Rollback on error
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l))
      );
      toast.error('Erro ao atualizar status do lead.');
    }
  }

  async function handleDeleteLead(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    try {
      await api.deleteLead(id);
      toast.success('Lead removido com sucesso.');
    } catch {
      toast.error('Erro ao remover lead.');
      loadLeads();
    }
  }

  function openLeadDetails(lead: LeadDTO) {
    setSelectedLead(lead);
    setEditObs(lead.observacoes || '');
    setEditValor(lead.valorEstimado || 0);
  }

  async function handleSaveLeadDetails() {
    if (!selectedLead?.id) return;
    setSaving(true);
    try {
      const updated = await api.updateLead(selectedLead.id, {
        id: selectedLead.id,
        observacoes: editObs,
        valorEstimado: editValor,
      });
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLead(updated);
      toast.success('Detalhes do lead salvos.');
    } catch {
      toast.error('Erro ao salvar detalhes.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateLead() {
    if (!newLead.nome || !newLead.email) {
      toast.error('Nome e email são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const created = await api.createLead(newLead);
      setLeads((prev) => [created, ...prev]);
      toast.success('Lead criado com sucesso.');
      setIsCreating(false);
      setNewLead({
        nome: '', email: '', telefone: '', empresa: '', mensagem: '',
        servicos: [], orcamentoMin: 0, orcamentoMax: 0, origem: 'admin',
        status: 'novo', prioridade: 'media', observacoes: '', valorEstimado: 0,
      });
    } catch {
      toast.error('Erro ao criar lead.');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={loadLeads} className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10">
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
          <h1 className="text-2xl font-bold text-white">Leads — Kanban</h1>
          <p className="text-gray-400 text-sm mt-1">
            Arraste os cards entre colunas para atualizar o status.{' '}
            <span className="text-purple-400">{leads.length} leads</span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
            <Input
              placeholder="Buscar por nome, email, empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-500 shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex-shrink-0 w-72">
              <Skeleton className="h-10 bg-white/5 mb-3 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-28 bg-white/5 rounded-lg" />
                <Skeleton className="h-28 bg-white/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
            {COLUMNS.map((column) => {
              const columnLeads = filteredLeads.filter(
                (l) => (l.status || 'novo') === column.id
              );
              return (
                <KanbanColumnDrop
                  key={column.id}
                  column={column}
                  leads={columnLeads}
                  onCardClick={openLeadDetails}
                />
              );
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeLead ? <LeadCardOverlay lead={activeLead} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <SheetContent className="bg-[#0f0f0f] border-white/10 text-white w-full sm:max-w-lg overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader className="px-1">
                <SheetTitle className="text-white text-lg">{selectedLead.nome}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 px-1">
                <DetailRow icon={Mail} label="Email" value={selectedLead.email} />
                <DetailRow icon={Phone} label="Telefone" value={selectedLead.telefone || '—'} />
                <DetailRow icon={Building2} label="Empresa" value={selectedLead.empresa || '—'} />
                <DetailRow
                  icon={DollarSign}
                  label="Orçamento"
                  value={
                    selectedLead.orcamentoMin || selectedLead.orcamentoMax
                      ? `R$ ${selectedLead.orcamentoMin?.toLocaleString('pt-BR')} - R$ ${selectedLead.orcamentoMax?.toLocaleString('pt-BR')}`
                      : '—'
                  }
                />
                <DetailRow
                  icon={Calendar}
                  label="Criado em"
                  value={
                    selectedLead.createdAt
                      ? new Date(selectedLead.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'
                  }
                />

                {selectedLead.servicos && selectedLead.servicos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Serviços</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead.servicos.map((s) => (
                        <Badge key={s} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLead.mensagem && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Mensagem</p>
                    <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{selectedLead.mensagem}</p>
                  </div>
                )}

                {/* Observações (editável) */}
                <div className="pt-4 border-t border-white/10">
                  <Label className="text-xs text-gray-400 mb-1.5 flex items-center gap-2">
                    <StickyNote className="w-3.5 h-3.5" />
                    Observações
                  </Label>
                  <Textarea
                    value={editObs}
                    onChange={(e) => setEditObs(e.target.value)}
                    placeholder="Anotações internas sobre este lead..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-white resize-none placeholder:text-gray-600"
                  />
                </div>

                {/* Valor Estimado (editável) */}
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    Valor Estimado (R$)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    value={editValor}
                    onChange={(e) => setEditValor(Number(e.target.value))}
                    placeholder="0,00"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Ações */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveLeadDetails}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => selectedLead.id && handleDeleteLead(selectedLead.id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Lead Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nome *</Label>
                <Input value={newLead.nome} onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })} placeholder="Nome completo" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email *</Label>
                <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} placeholder="email@exemplo.com" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Telefone</Label>
                <Input value={newLead.telefone || ''} onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })} placeholder="(00) 00000-0000" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Empresa</Label>
                <Input value={newLead.empresa || ''} onChange={(e) => setNewLead({ ...newLead, empresa: e.target.value })} placeholder="Nome da empresa" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Valor Estimado (R$)</Label>
                <Input type="number" min={0} value={newLead.valorEstimado || 0} onChange={(e) => setNewLead({ ...newLead, valorEstimado: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Origem</Label>
                <Input value={newLead.origem} onChange={(e) => setNewLead({ ...newLead, origem: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Mensagem</Label>
              <Textarea value={newLead.mensagem || ''} onChange={(e) => setNewLead({ ...newLead, mensagem: e.target.value })} placeholder="Mensagem do lead..." rows={2} className="bg-white/5 border-white/10 text-white resize-none" />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Observações</Label>
              <Textarea value={newLead.observacoes || ''} onChange={(e) => setNewLead({ ...newLead, observacoes: e.target.value })} placeholder="Anotações internas..." rows={2} className="bg-white/5 border-white/10 text-white resize-none" />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">Cancelar</Button>
            <Button onClick={handleCreateLead} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Droppable Column =====

function KanbanColumnDrop({
  column,
  leads,
  onCardClick,
}: {
  column: KanbanColumn;
  leads: LeadDTO[];
  onCardClick: (lead: LeadDTO) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-72 flex flex-col"
      style={{ minHeight: 200 }}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg mb-3"
        style={{ backgroundColor: column.bgColor, borderLeft: `3px solid ${column.color}` }}
      >
        <span className="text-sm font-medium" style={{ color: column.color }}>
          {column.title}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${column.color}30`, color: column.color }}
        >
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className={`flex-1 space-y-2 p-1 rounded-lg transition-colors ${
          isOver ? 'bg-white/[0.03] ring-1 ring-white/10' : ''
        }`}
      >
        {leads.length === 0 ? (
          <p className="text-center text-gray-600 text-xs py-8">Nenhum lead</p>
        ) : (
          leads.map((lead) => (
            <DraggableLeadCard key={lead.id} lead={lead} onClick={() => onCardClick(lead)} />
          ))
        )}
      </div>
    </div>
  );
}

// ===== Draggable Lead Card =====

function DraggableLeadCard({ lead, onClick }: { lead: LeadDTO; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id!,
    data: { lead },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : ''}`}
    >
      <Card
        className="bg-white/[0.04] border-white/10 p-3 hover:bg-white/[0.06] transition-all"
        onClick={onClick}
      >
        <div className="flex items-start gap-2">
          <div {...attributes} {...listeners} className="pt-0.5 text-gray-600 hover:text-gray-400">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{lead.nome}</p>
            {lead.empresa && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{lead.empresa}</p>
            )}
            <p className="text-xs text-gray-500 truncate mt-0.5">{lead.email}</p>
            {lead.createdAt && (
              <p className="text-[10px] text-gray-600 mt-1.5">
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===== Drag Overlay Card =====

function LeadCardOverlay({ lead }: { lead: LeadDTO }) {
  return (
    <Card className="bg-purple-600/20 border-purple-500/40 p-3 w-72 shadow-2xl shadow-purple-500/20 rotate-2">
      <p className="text-sm font-medium text-white">{lead.nome}</p>
      {lead.empresa && <p className="text-xs text-gray-300 mt-0.5">{lead.empresa}</p>}
      <p className="text-xs text-gray-400 mt-0.5">{lead.email}</p>
    </Card>
  );
}

// ===== Detail Row =====

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-300">{value}</p>
      </div>
    </div>
  );
}
