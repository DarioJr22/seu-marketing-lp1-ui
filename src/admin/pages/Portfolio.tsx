import { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import type { PortfolioItemDTO, CreatePortfolioItemDTO } from '@/types/admin';
import { uploadFile, deleteFile, getStorageUrl } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
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
  Plus,
  Search,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Star,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Tráfego Pago',
  'Social Media',
  'Branding',
  'Design e Criação',
  'Produção de Conteúdo',
  'Produção Audiovisual',
  'Consultoria',
  'Geral',
];

const emptyForm: CreatePortfolioItemDTO = {
  titulo: '',
  slug: '',
  descricao: '',
  categoria: 'Geral',
  cliente: '',
  imagemCapa: '',
  url: '',
  resultado: '',
  tags: [],
  destaque: false,
  ordem: 0,
  ativo: true,
};

export default function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePortfolioItemDTO>({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPortfolioItems();
      setItems(data);
    } catch {
      setError('Erro ao carregar portfólio.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (item.cliente && item.cliente.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = filterCategory === 'todas' || item.categoria === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, filterCategory]);

  function openCreateDialog() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview(null);
    setTagsInput('');
    setDialogOpen(true);
  }

  function openEditDialog(item: PortfolioItemDTO) {
    setEditingId(item.id || null);
    setForm({
      titulo: item.titulo,
      slug: item.slug,
      descricao: item.descricao || '',
      categoria: item.categoria,
      cliente: item.cliente || '',
      imagemCapa: item.imagemCapa || '',
      url: item.url || '',
      resultado: item.resultado || '',
      tags: item.tags || [],
      destaque: item.destaque,
      ordem: item.ordem,
      ativo: item.ativo,
    });
    setImageFile(null);
    setImagePreview(item.imagemCapa || null);
    setTagsInput((item.tags || []).join(', '));
    setDialogOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo: 10MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    if (!form.titulo.trim()) {
      toast.error('O título é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      let imagemCapa = form.imagemCapa;

      // Upload de imagem
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `covers/${generateSlug(form.titulo)}-${Date.now()}.${ext}`;
        imagemCapa = await uploadFile('portfolio-images', fileName, imageFile);
      }

      const slug = form.slug || generateSlug(form.titulo);
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: CreatePortfolioItemDTO = {
        ...form,
        slug,
        tags,
        imagemCapa,
      };

      if (editingId) {
        const updated = await api.updatePortfolioItem(editingId, { ...payload, id: editingId });
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        toast.success('Projeto atualizado!');
      } else {
        const created = await api.createPortfolioItem(payload);
        setItems((prev) => [...prev, created]);
        toast.success('Projeto criado!');
      }

      setDialogOpen(false);
    } catch (err) {
      toast.error('Erro ao salvar projeto.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      // Tentar deletar imagem do storage
      const item = items.find((i) => i.id === deleteId);
      if (item?.imagemCapa && item.imagemCapa.includes('portfolio-images')) {
        try {
          const path = item.imagemCapa.split('portfolio-images/')[1];
          if (path) await deleteFile('portfolio-images', path);
        } catch { /* ignore storage errors */ }
      }

      await api.deletePortfolioItem(deleteId);
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      toast.success('Projeto removido.');
    } catch {
      toast.error('Erro ao remover projeto.');
    } finally {
      setDeleteId(null);
    }
  }

  async function handleToggleActive(item: PortfolioItemDTO) {
    if (!item.id) return;
    const newValue = !item.ativo;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ativo: newValue } : i)));
    try {
      await api.updatePortfolioItem(item.id, { id: item.id, ativo: newValue });
      toast.success(newValue ? 'Projeto ativado.' : 'Projeto desativado.');
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ativo: !newValue } : i)));
      toast.error('Erro ao atualizar.');
    }
  }

  async function handleToggleFeatured(item: PortfolioItemDTO) {
    if (!item.id) return;
    const newValue = !item.destaque;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, destaque: newValue } : i)));
    try {
      await api.updatePortfolioItem(item.id, { id: item.id, destaque: newValue });
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, destaque: !newValue } : i)));
      toast.error('Erro ao atualizar.');
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={loadItems} className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10">
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
          <h1 className="text-2xl font-bold text-white">Portfólio</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie os projetos do portfólio.{' '}
            <span className="text-purple-400">{items.length} projetos</span>
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-500">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar por título ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10">
            <SelectItem value="todas" className="text-white">Todas Categorias</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-16">Nenhum projeto encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium w-16">Img</th>
                  <th className="text-left py-3 px-4 font-medium">Título</th>
                  <th className="text-left py-3 px-4 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium">Cliente</th>
                  <th className="text-center py-3 px-4 font-medium">Destaque</th>
                  <th className="text-center py-3 px-4 font-medium">Ativo</th>
                  <th className="text-center py-3 px-4 font-medium">Ordem</th>
                  <th className="text-center py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2 px-4">
                      {item.imagemCapa ? (
                        <img
                          src={item.imagemCapa}
                          alt={item.titulo}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-white font-medium">{item.titulo}</p>
                      {item.resultado && (
                        <p className="text-green-400 text-xs mt-0.5">{item.resultado}</p>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-xs">
                        {item.categoria}
                      </Badge>
                    </td>
                    <td className="py-2 px-4 text-gray-400">{item.cliente || '—'}</td>
                    <td className="py-2 px-4 text-center">
                      <button onClick={() => handleToggleFeatured(item)} className="cursor-pointer">
                        <Star
                          className={`w-4 h-4 mx-auto ${
                            item.destaque ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Switch
                        checked={item.ativo}
                        onCheckedChange={() => handleToggleActive(item)}
                        className="mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 text-center text-gray-400">{item.ordem}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {item.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => item.id && setDeleteId(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Image Upload */}
            <div>
              <Label className="text-gray-300 text-xs">Imagem de Capa</Label>
              <div className="mt-2 flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-32 h-24 rounded-lg object-cover border border-white/10" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); setForm({ ...form, imagemCapa: '' }); }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-24 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/40 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-[10px] text-gray-500">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP. Máx 10MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">Título *</Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value, slug: generateSlug(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="Nome do projeto"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="nome-do-projeto"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-xs">Descrição</Label>
              <Textarea
                value={form.descricao || ''}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
                rows={3}
                placeholder="Descreva o projeto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Cliente</Label>
                <Input
                  value={form.cliente || ''}
                  onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="Nome do cliente"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">URL do Projeto</Label>
                <Input
                  value={form.url || ''}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Resultado</Label>
                <Input
                  value={form.resultado || ''}
                  onChange={(e) => setForm({ ...form, resultado: e.target.value })}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="+340% ROI em 30 dias"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-xs">Tags (separadas por vírgula)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1"
                placeholder="ads, meta, google"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.destaque || false}
                  onCheckedChange={(v) => setForm({ ...form, destaque: v })}
                />
                <Label className="text-gray-300 text-xs">Destaque</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.ativo !== false}
                  onCheckedChange={(v) => setForm({ ...form, ativo: v })}
                />
                <Label className="text-gray-300 text-xs">Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-gray-300 text-xs">Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem || 0}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white w-20"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-500">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editingId ? 'Salvar Alterações' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover projeto?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta ação não pode ser desfeita. O projeto e sua imagem serão removidos permanentemente.
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
    </div>
  );
}
