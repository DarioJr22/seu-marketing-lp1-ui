import { motion } from 'motion/react';
import { Play, Instagram } from 'lucide-react';
import { Button } from './ui/button';

const mediaItems = [
  { type: 'video', size: 'large', title: 'Bastidores - Produção Comercial' },
  { type: 'image', size: 'small', title: 'Feed Instagram - Cliente A' },
  { type: 'image', size: 'small', title: 'Design de Logo' },
  { type: 'video', size: 'medium', title: 'Reels Viral - 500K views' },
  { type: 'image', size: 'medium', title: 'Campanha Google Ads' },
  { type: 'image', size: 'large', title: 'Fotografia Produto' },
  { type: 'video', size: 'small', title: 'Stories Interativos' },
  { type: 'image', size: 'small', title: 'Identidade Visual' },
  { type: 'video', size: 'medium', title: 'Vídeo Institucional' },
  { type: 'image', size: 'medium', title: 'Banners Promocionais' },
  { type: 'image', size: 'small', title: 'Posts Carrossel' },
  { type: 'video', size: 'small', title: 'Depoimento Cliente' }
];

export function MediaGallerySection() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            Galeria de Trabalhos
          </h2>
          <p className="text-xl text-gray-400">
            Cada projeto conta uma história de sucesso
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaItems.map((item, index) => (
            <MediaItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-[#f09433]/10 via-[#e6683c]/10 to-[#bc1888]/10 border border-[#f09433]/20">
            <Instagram className="w-12 h-12 text-[#E4405F]" />
            <p className="text-white text-lg">
              Veja muito mais no nosso Instagram
            </p>
            <p className="text-gray-400">
              +200 posts | Stories diários | Dicas exclusivas
            </p>
            <Button
              onClick={() => window.open('https://www.instagram.com/seu_marketing01/', '_blank')}
              className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] hover:shadow-[0_0_30px_rgba(240,148,51,0.5)]"
            >
              <Instagram className="w-5 h-5 mr-2" />
              @seu_marketing01
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface MediaItemProps {
  item: {
    type: string;
    size: string;
    title: string;
  };
  index: number;
}

function MediaItem({ item, index }: MediaItemProps) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-2 row-span-2'
  };

  const gradients = [
    'from-[#7c3aed]/40 to-[#ec4899]/40',
    'from-[#ec4899]/40 to-[#f59e0b]/40',
    'from-[#f59e0b]/40 to-[#10b981]/40',
    'from-[#10b981]/40 to-[#06b6d4]/40',
    'from-[#06b6d4]/40 to-[#7c3aed]/40',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className={`${sizeClasses[item.size as keyof typeof sizeClasses]} relative group cursor-pointer rounded-2xl overflow-hidden aspect-square`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`
        }} />
      </div>

      {/* Type indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        {item.type === 'video' ? (
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        ) : (
          <div className="text-6xl opacity-30">📸</div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="text-white text-sm">{item.title}</div>
      </div>

      {/* Border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300" />
    </motion.div>
  );
}
