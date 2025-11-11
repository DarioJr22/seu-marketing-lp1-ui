import { motion } from 'motion/react';
import { useState } from 'react';
import { Play, Instagram, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { AuroraText } from './ui/aurora-text';

interface Portfolio {
  type: 'image' | 'video';
  category: string;
  title: string;
  description: string;
  client: string;
  results: string;
  url?: string;
}


const portfolioItems:Portfolio[] = [
  {
    type: 'image',
    category: 'Social Media',
    title: 'Gestão de Instagram - Beleza & Estilo',
    description: 'Feed harmonizado que aumentou engajamento em 350%',
    client: 'Beleza & Estilo',
    results: '+350% engajamento'
  },
  {
    type: 'video',
    category: 'Produção Audiovisual',
    title: 'Vídeo Comercial - TechStart Digital',
    description: 'Campanha institucional de lançamento de produto',
    client: 'TechStart Digital',
    results: '2M+ visualizações'
  },
  {
    type: 'image',
    category: 'Design',
    title: 'Identidade Visual - AutoPeças Premium',
    description: 'Redesign completo de marca e materiais',
    client: 'AutoPeças Premium',
    results: 'Reconhecimento +200%'
  },
  {
    type: 'image',
    category: 'Tráfego Pago',
    title: 'Campanha Google Ads - EcoLife Store',
    description: 'Anúncios que geraram ROI de 400%',
    client: 'EcoLife Store',
    results: 'ROI 400%'
  },
  {
    type: 'video',
    category: 'Produção Audiovisual',
    title: 'Reels Virais - Construtora Horizonte',
    description: 'Série de vídeos que viralizaram no Instagram',
    client: 'Construtora Horizonte',
    results: '500K+ alcance'
  },
  {
    type: 'image',
    category: 'Social Media',
    title: 'Stories Interativos - Inovare Soluções',
    description: 'Estratégia de stories que triplicou conversões',
    client: 'Inovare Soluções',
    results: '+300% conversões'
  }
];

const categories = ['Todos', 'Social Media', 'Design', 'Produção Audiovisual', 'Tráfego Pago'];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredItems = activeCategory === 'Todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a2e]">
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
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <PortfolioCard key={index} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white text-lg mb-6">
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
  item: {
    type: string;
    category: string;
    title: string;
    description: string;
    client: string;
    results: string;
  };
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
      {/* Placeholder Image/Video */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/30 via-[#ec4899]/20 to-[#f59e0b]/30">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(124,58,237,0.5) 2px, rgba(124,58,237,0.5) 3px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(124,58,237,0.5) 2px, rgba(124,58,237,0.5) 3px)`
        }} />
        
        {/* Type Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {item.type === 'video' ? (
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

      {/* Overlay Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end"
      >
        {/* Category Badge */}
        <div className="mb-3">
          <span className="px-3 py-1 bg-[#7c3aed]/80 backdrop-blur-sm text-white text-xs rounded-full">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl text-white mb-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3">
          {item.description}
        </p>

        {/* Results */}
        <div className="flex items-center justify-between">
          <div className="text-[#a78bfa]">
            {item.results}
          </div>
          <ExternalLink className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      {/* Border glow on hover */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
        isHovered ? 'border-[#7c3aed] shadow-[0_0_30px_rgba(124,58,237,0.5)]' : 'border-transparent'
      }`} />
    </motion.div>
  );
}
