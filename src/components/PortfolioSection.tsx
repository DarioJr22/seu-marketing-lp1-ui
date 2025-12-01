import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Play, Instagram, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { AuroraText } from './ui/aurora-text';
import { api } from '../services/api';
import { PortfolioItemDTO } from '../types/admin';

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories from portfolio items
  const categories = ['Todos', ...Array.from(new Set(portfolioItems.map(item => item.categoria)))];

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await api.getPortfolioItems();
      // Filter only active items and sort by destaque first
      const activeItems = items
        .filter(item => item.ativo)
        .sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
      setPortfolioItems(activeItems);
    } catch (err) {
      setError('Erro ao carregar portfolio. Por favor, tente novamente.');
      console.error('Erro ao carregar portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'Todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.categoria === activeCategory);

  return (
    <section id="portfolio" className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold md:text-5xl text-white mb-4">
            Nosso Portfolio em <AuroraText> Destaque</AuroraText>
          </h2>
          <p className="text-xl font-semibold text-gray-400 mb-8">
            Trabalhos reais que geraram resultados extraordinários
          </p>

          {/* Category Filter */}
          {!loading && !error && (
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all cursor-pointer ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#000000] to-[#ffffff] text-white shadow-[0_0_20px_rgba(255,250,250,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Carregando portfolio...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={loadPortfolioItems} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Portfolio Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <PortfolioCard key={item.id} item={item} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">Nenhum item encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white text-lg mb-6 font-semibold">
            Quer ver mais trabalhos e bastidores?
          </p>
          <Button
            onClick={() => window.open('https://www.instagram.com/seu_marketing01/', '_blank')}
            size="lg"
            className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] hover:shadow-[0_0_30px_rgba(240,148,51,0.5)]"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Ver Portfolio Completo no Instagram
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface PortfolioCardProps {
  item: PortfolioItemDTO;
  index: number;
}

function PortfolioCard({ item, index }: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Image/Video Background */}
      {item.imagemCapa ? (
        <img 
          src={item.imagemCapa} 
          alt={item.titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/30 via-[#ec4899]/20 to-[#f59e0b]/30">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(124,58,237,0.5) 2px, rgba(124,58,237,0.5) 3px),
                             repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(124,58,237,0.5) 2px, rgba(124,58,237,0.5) 3px)`
          }} />
          
          {/* Type Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {item.url ? (
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </motion.div>
            ) : (
              <div className="text-8xl opacity-20">📸</div>
            )}
          </div>
        </div>
      )}

      {/* Overlay Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end"
      >
        {/* Category Badge & Destaque */}
        <div className="mb-3 flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-[#fff]/80 backdrop-blur-sm text-black text-xs rounded-full">
            {item.categoria}
          </span>
          {item.destaque && (
            <span className="px-3 py-1 bg-yellow-500/80 backdrop-blur-sm text-black text-xs rounded-full font-semibold">
              ⭐ Destaque
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl text-white mb-2 font-bold">
          {item.titulo}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3">
          {item.descricao}
        </p>

        {/* Client & Results */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-400">
            Cliente: {item.cliente}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-[#fff] font-semibold">
            {item.resultado}
          </div>
          {item.url && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5 text-white hover:scale-110 transition-transform" />
            </a>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Border glow on hover */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
        isHovered ? 'border-[#fff] shadow-[0_0_30px_rgba(255,250,250,0.5)]' : 'border-transparent'
      }`} />
    </motion.div>
  );
}
