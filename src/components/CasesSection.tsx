import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Users, DollarSign, Heart } from 'lucide-react';
import { Button } from './ui/button';

const cases = [
  {
    client: 'Beleza & Estilo',
    industry: 'Salão de Beleza',
    challenge: 'Instagram parado, sem engajamento e vendas estagnadas',
    solution: 'Gestão completa de redes sociais + tráfego pago',
    period: '3 meses',
    results: [
      { icon: Users, label: 'Seguidores', before: '800', after: '3.2K', growth: '+300%' },
      { icon: Heart, label: 'Engajamento', before: '2%', after: '8.5%', growth: '+325%' },
      { icon: DollarSign, label: 'Faturamento', before: 'R$ 15K', after: 'R$ 45K', growth: '+200%' }
    ],
    testimonial: '"A SEU MARKETING transformou completamente nosso negócio. Hoje não conseguimos atender toda a demanda!"',
    color: '#ec4899'
  },
  {
    client: 'TechStart Digital',
    industry: 'Software & Tecnologia',
    challenge: 'Lançamento de produto sem visibilidade no mercado',
    solution: 'Branding + produção audiovisual + campanhas estratégicas',
    period: '4 meses',
    results: [
      { icon: TrendingUp, label: 'Leads Qualificados', before: '0', after: '520', growth: 'Novo' },
      { icon: Users, label: 'Alcance', before: '5K', after: '2M', growth: '+40.000%' },
      { icon: DollarSign, label: 'MRR', before: 'R$ 0', after: 'R$ 180K', growth: 'Novo' }
    ],
    testimonial: '"Profissionais excepcionais. Sem eles não teríamos conseguido o lançamento com tanto sucesso."',
    color: '#7c3aed'
  },
  {
    client: 'AutoPeças Premium',
    industry: 'E-commerce',
    challenge: 'Tráfego caro e conversão baixa nas campanhas',
    solution: 'Otimização de anúncios + criação de conteúdo + CRO',
    period: '6 meses',
    results: [
      { icon: DollarSign, label: 'ROI', before: '120%', after: '480%', growth: '+300%' },
      { icon: TrendingUp, label: 'Taxa de Conversão', before: '1.2%', after: '4.8%', growth: '+300%' },
      { icon: Users, label: 'Clientes Novos', before: '45/mês', after: '210/mês', growth: '+367%' }
    ],
    testimonial: '"Reduzimos o custo por aquisição em 60% e aumentamos as vendas em 300%. Simplesmente incrível!"',
    color: '#f59e0b'
  }
];

export function CasesSection() {
  return (
    <section id="cases" className="py-24 px-6 bg-[#0a0a0a]">
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
            Cases de Sucesso Reais
          </h2>
          <p className="text-xl text-gray-400">
            Resultados comprovados que transformaram negócios
          </p>
        </motion.div>

        {/* Cases */}
        <div className="space-y-12">
          {cases.map((caseStudy, index) => (
            <CaseCard key={index} caseStudy={caseStudy} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10">
            <h3 className="text-3xl text-white mb-4">
              Seu Negócio Pode Ser o Próximo Case de Sucesso
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Agende uma consultoria gratuita e descubra como podemos multiplicar seus resultados
            </p>
            <Button
              onClick={() => window.open('https://wa.me/5581991497521?text=Quero%20criar%20um%20case%20de%20sucesso!', '_blank')}
              size="lg"
              className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
            >
              Quero Resultados Como Esses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface CaseCardProps {
  caseStudy: any;
  index: number;
}

function CaseCard({ caseStudy, index }: CaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 hover:border-[#7c3aed]/50 transition-all group"
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
        style={{ backgroundColor: `${caseStudy.color}15` }}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="text-3xl text-white">{caseStudy.client}</h3>
          <span 
            className="px-4 py-1 rounded-full text-sm"
            style={{ backgroundColor: `${caseStudy.color}20`, color: caseStudy.color }}
          >
            {caseStudy.industry}
          </span>
        </div>

        {/* Challenge & Solution */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-gray-400 text-sm mb-2">Desafio</div>
            <div className="text-white">{caseStudy.challenge}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Solução</div>
            <div className="text-white">{caseStudy.solution}</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-[#a78bfa] text-sm">
          <div className="w-2 h-2 bg-[#a78bfa] rounded-full animate-pulse" />
          Período: {caseStudy.period}
        </div>
      </div>

      {/* Results - Before/After */}
      <div className="mb-8">
        <h4 className="text-xl text-white mb-6">Resultados Conquistados</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudy.results.map((result: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index * 0.2) + (idx * 0.1) }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <result.icon className="w-8 h-8 mb-4" style={{ color: caseStudy.color }} />
              <div className="text-gray-400 text-sm mb-3">{result.label}</div>
              
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Antes</div>
                  <div className="text-white">{result.before}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#a78bfa]" />
                <div>
                  <div className="text-xs text-gray-500 mb-1">Depois</div>
                  <div className="text-white">{result.after}</div>
                </div>
              </div>

              <div 
                className="text-lg"
                style={{ color: caseStudy.color }}
              >
                {result.growth}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="p-6 rounded-2xl bg-white/5 border-l-4" style={{ borderLeftColor: caseStudy.color }}>
        <div className="flex items-start gap-4">
          <div className="text-4xl opacity-30">"</div>
          <div>
            <p className="text-white italic mb-2">{caseStudy.testimonial}</p>
            <p className="text-gray-400 text-sm">— Cliente {caseStudy.client}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
