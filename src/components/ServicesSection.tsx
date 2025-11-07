import { motion } from 'motion/react';
import { 
  Share2, 
  Palette, 
  TrendingUp, 
  FileText, 
  Award, 
  Compass, 
  Video, 
  Mail,
  Rocket
} from 'lucide-react';

const services = [
  {
    icon: Rocket,
    title: "Agência de Marketing Completa",
    description: "Soluções 360° para dominar o ambiente digital",
    features: [
      "Gestão estratégica de redes sociais",
      "Criação de identidade visual profissional",
      "Tráfego pago com ROI comprovado",
      "Produção de conteúdo de alta performance"
    ],
    color: "#7c3aed"
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Transforme suas redes em máquinas de vendas",
    features: [
      "Posts, Stories e Reels virais",
      "Planejamento editorial estratégico",
      "Monitoramento e análise avançada",
      "Crescimento orgânico garantido"
    ],
    color: "#ec4899"
  },
  {
    icon: Palette,
    title: "Design e Criação",
    description: "Identidade visual inesquecível",
    features: [
      "Logotipos únicos e memoráveis",
      "Feed harmonizado no Instagram",
      "Materiais gráficos diversos",
      "Manual de marca completo"
    ],
    color: "#f59e0b"
  },
  {
    icon: TrendingUp,
    title: "Tráfego Pago",
    description: "Invista em anúncios que trazem retorno",
    features: [
      "Google Ads otimizado",
      "Facebook & Instagram Ads",
      "Até 300% de ROI",
      "Otimização de conversão"
    ],
    color: "#10b981"
  },
  {
    icon: FileText,
    title: "Produção de Conteúdo",
    description: "Conteúdo que atrai, engaja e converte",
    features: [
      "Artigos para blogs (SEO)",
      "E-books e materiais ricos",
      "Landing pages de alta conversão",
      "Roteiros audiovisuais"
    ],
    color: "#06b6d4"
  },
  {
    icon: Award,
    title: "Branding e Posicionamento",
    description: "Construa uma marca que domina seu mercado",
    features: [
      "Estratégias de diferenciação",
      "Definição de tom de voz",
      "Pesquisa de mercado profunda",
      "Gestão de reputação online"
    ],
    color: "#8b5cf6"
  },
  {
    icon: Compass,
    title: "Assessoria e Estratégia",
    description: "Consultoria para resultados previsíveis",
    features: [
      "Planejamento de campanhas 360°",
      "Auditoria de presença digital",
      "Definição de KPIs e metas",
      "Mentoria de equipes"
    ],
    color: "#f97316"
  },
  {
    icon: Video,
    title: "Produção Audiovisual",
    description: "Conteúdo visual cinematográfico",
    features: [
      "Fotografia profissional",
      "Vídeos comerciais e publicitários",
      "Motion graphics e animações",
      "Cobertura de eventos"
    ],
    color: "#ef4444"
  },
  {
    icon: Mail,
    title: "Relacionamento e CRM",
    description: "Automatize vendas e fidelize clientes",
    features: [
      "E-mail marketing estratégico",
      "Chatbots inteligentes",
      "Automação de follow-up",
      "Gestão completa de leads"
    ],
    color: "#14b8a6"
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            A Solução Completa que Você Precisa Está Aqui
          </h2>
          <p className="text-xl text-gray-400">
            9 serviços integrados para transformar seu negócio digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: {
    icon: any;
    title: string;
    description: string;
    features: string[];
    color: string;
  };
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -10, rotateY: 2, rotateX: 2 }}
      className="group relative h-full"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card */}
      <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 hover:border-[#7c3aed]/50 transition-all duration-500 relative overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
          style={{ backgroundColor: `${service.color}15` }}
        />
        
        {/* Animated icon */}
        <motion.div
          className="mb-6 relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{ backgroundColor: `${service.color}20` }}
          >
            <Icon className="w-10 h-10 relative z-10" style={{ color: service.color }} />
            <div 
              className="absolute inset-0 rounded-2xl blur-xl opacity-60"
              style={{ backgroundColor: service.color }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl text-white mb-3 group-hover:text-[#a78bfa] transition-colors">
          {service.title}
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features list */}
        <ul className="space-y-3">
          {service.features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index * 0.05) + (idx * 0.1) }}
              className="flex items-start gap-2 text-gray-300 text-sm"
            >
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: service.color }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#7c3aed]/30 transition-all duration-500" />
      </div>
    </motion.div>
  );
}
