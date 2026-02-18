import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { ReviewDTO, CreateReviewDTO } from '@/types/admin';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
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
  Star,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ReviewDTO | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newReview, setNewReview] = useState<CreateReviewDTO>({
    nome: '', cargo: '', empresa: '', texto: '', nota: 5, ativo: true, ordem: 0,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReviews();
      setReviews(data);
    } catch (err) {
      setError('Erro ao carregar reviews.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAtivo(review: ReviewDTO) {
    const newAtivo = !review.ativo;
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, ativo: newAtivo } : r)));
    try {
      await api.updateReview(review.id!, { ativo: newAtivo });
      toast.success(newAtivo ? 'Review ativado.' : 'Review desativado.');
    } catch {
      toast.error('Erro ao atualizar review.');
      loadReviews();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.deleteReview(deleteId);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success('Review removido.');
    } catch {
      toast.error('Erro ao remover review.');
    } finally {
      setDeleteId(null);
    }
  }

  async function handleEditSave() {
    if (!editItem?.id) return;
    setSaving(true);
    try {
      const updated = await api.updateReview(editItem.id, {
        nome: editItem.nome,
        cargo: editItem.cargo,
        empresa: editItem.empresa,
        texto: editItem.texto,
        nota: editItem.nota,
        ativo: editItem.ativo,
        ordem: editItem.ordem,
      });
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success('Review atualizado.');
      setEditItem(null);
    } catch {
      toast.error('Erro ao salvar review.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateReview() {
    if (!newReview.nome || !newReview.texto) {
      toast.error('Nome e texto são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const created = await api.createReview(newReview);
      setReviews((prev) => [...prev, created]);
      toast.success('Review criado.');
      setIsCreating(false);
      setNewReview({ nome: '', cargo: '', empresa: '', texto: '', nota: 5, ativo: true, ordem: 0 });
    } catch {
      toast.error('Erro ao criar review.');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={loadReviews} className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10">
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
          <h1 className="text-2xl font-bold text-white">Reviews / Depoimentos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie os depoimentos exibidos na landing page.{' '}
            <span className="text-purple-400">{reviews.length} total</span>
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-500 shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Novo Review
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/10 p-16 text-center">
          <p className="text-gray-500">Nenhum review encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className={`bg-white/[0.04] border-white/10 p-5 flex flex-col transition-all ${
                !review.ativo ? 'opacity-50' : ''
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-gray-300 flex-1 mb-4 line-clamp-4 italic">"{review.texto}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {review.nome.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{review.nome}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {[review.cargo, review.empresa].filter(Boolean).join(' — ')}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={review.ativo}
                    onCheckedChange={() => handleToggleAtivo(review)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <span className="text-xs text-gray-500">{review.ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5"
                    onClick={() => setEditItem(review)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => review.id && setDeleteId(review.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Review</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Nome *</Label>
                  <Input value={editItem.nome} onChange={(e) => setEditItem({ ...editItem, nome: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Empresa</Label>
                  <Input value={editItem.empresa || ''} onChange={(e) => setEditItem({ ...editItem, empresa: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Cargo</Label>
                  <Input value={editItem.cargo || ''} onChange={(e) => setEditItem({ ...editItem, cargo: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Nota (1-5)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setEditItem({ ...editItem, nota: n })}
                        className="p-1"
                      >
                        <Star className={`w-6 h-6 transition-colors ${n <= editItem.nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Depoimento *</Label>
                <Textarea value={editItem.texto} onChange={(e) => setEditItem({ ...editItem, texto: e.target.value })} rows={4} className="bg-white/5 border-white/10 text-white resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Ordem</Label>
                  <Input type="number" min={0} value={editItem.ordem} onChange={(e) => setEditItem({ ...editItem, ordem: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch
                    checked={editItem.ativo}
                    onCheckedChange={(v) => setEditItem({ ...editItem, ativo: v })}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label className="text-xs text-gray-400">{editItem.ativo ? 'Ativo' : 'Inativo'}</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setEditItem(null)} className="text-gray-400 hover:text-white">Cancelar</Button>
            <Button onClick={handleEditSave} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nome *</Label>
                <Input value={newReview.nome} onChange={(e) => setNewReview({ ...newReview, nome: e.target.value })} placeholder="Nome do cliente" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Empresa</Label>
                <Input value={newReview.empresa || ''} onChange={(e) => setNewReview({ ...newReview, empresa: e.target.value })} placeholder="Empresa" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Cargo</Label>
                <Input value={newReview.cargo || ''} onChange={(e) => setNewReview({ ...newReview, cargo: e.target.value })} placeholder="CEO, Diretor..." className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nota (1-5)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, nota: n })}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 transition-colors ${n <= (newReview.nota || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Depoimento *</Label>
              <Textarea value={newReview.texto} onChange={(e) => setNewReview({ ...newReview, texto: e.target.value })} placeholder="O que o cliente disse..." rows={4} className="bg-white/5 border-white/10 text-white resize-none" />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">Cancelar</Button>
            <Button onClick={handleCreateReview} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover review?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta ação não pode ser desfeita. O review será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
