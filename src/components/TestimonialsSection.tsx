import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Maria Silva",
    role: "CEO",
    company: "TechStart Digital",
    text: "A SEU MARKETING transformou nossa presença digital. Em 3 meses triplicamos nosso faturamento online!",
    rating: 5,
    image: "MS"
  },
  {
    name: "João Santos",
    role: "Diretor de Marketing",
    company: "Inovare Soluções",
    text: "Finalmente encontramos uma agência que entende de resultados, não só de likes.",
    rating: 5,
    image: "JS"
  },
  {
    name: "Ana Costa",
    role: "Proprietária",
    company: "Beleza & Estilo",
    text: "O ROI das campanhas superou todas as expectativas. Melhor investimento que fizemos!",
    rating: 5,
    image: "AC"
  },
  {
    name: "Pedro Oliveira",
    role: "Gerente Comercial",
    company: "AutoPeças Premium",
    text: "Profissionais sérios e comprometidos com resultados. Aumentamos 250% em leads qualificados.",
    rating: 5,
    image: "PO"
  },
  {
    name: "Juliana Ferreira",
    role: "Fundadora",
    company: "EcoLife Store",
    text: "Atendimento humanizado e estratégias que realmente funcionam. Nosso Instagram cresceu 400%!",
    rating: 5,
    image: "JF"
  },
  {
    name: "Carlos Mendes",
    role: "CEO",
    company: "Construtora Horizonte",
    text: "Transparência total nos relatórios e resultados acima do prometido. Equipe excepcional!",
    rating: 5,
    image: "CM"
  }
];

const stats = [
  { number: "500+", label: "Empresas Atendidas", icon: "🏆" },
  { number: "+200%", label: "ROI Médio dos Clientes", icon: "📈" },
  { number: "98%", label: "Taxa de Satisfação", icon: "⭐" },
  { number: "5 Anos", label: "Experiência no Mercado", icon: "🎯" }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a2e]">
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
            Empresas Reais. Resultados Reais. Crescimento Real.
          </h2>
          <p className="text-xl text-gray-400">
            Veja como transformamos desafios em sucessos mensuráveis
          </p>
        </motion.div>

        {/* Stats 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl text-[#a78bfa] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>*/}

        {/* Testimonials Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl text-white text-center mb-12"
        >
          O Que Nossos Clientes Dizem
        </motion.h3>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: {
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
    image: string;
  };
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="relative p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#7c3aed]/50 transition-all group"
    >
      {/* Quote Icon */}
      <Quote className="absolute top-6 right-6 w-12 h-12 text-[#7c3aed] opacity-20 group-hover:opacity-30 transition-opacity" />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (index * 0.1) + (i * 0.05) }}
          >
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Text */}
      <p className="text-white mb-6 leading-relaxed relative z-10 italic">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white">
          {testimonial.image}
        </div>
        <div>
          <div className="text-white">{testimonial.name}</div>
          <div className="text-gray-400 text-sm">
            {testimonial.role} - {testimonial.company}
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c3aed]/0 to-[#7c3aed]/0 group-hover:from-[#7c3aed]/5 group-hover:to-transparent transition-all duration-500 -z-10" />
    </motion.div>
  );
}
