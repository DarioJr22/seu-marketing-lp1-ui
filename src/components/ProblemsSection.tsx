import { motion } from 'motion/react';
import { TrendingDown, DollarSign, UserCircle, Target, Users, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

const problems = [
  {
    icon: TrendingDown,
    title: "Redes Sociais Invisíveis",
    description: "Suas redes sociais existem, mas ninguém engaja, comenta ou compartilha?",
    color: "#ef4444"
  },
  {
    icon: DollarSign,
    title: "Dinheiro Queimado em Anúncios",
    description: "Investe em Facebook Ads e Google Ads mas os cliques não viram vendas?",
    color: "#f59e0b"
  },
  {
    icon: UserCircle,
    title: "Marca sem Identidade",
    description: "Sua empresa não tem uma identidade visual forte e memorável?",
    color: "#8b5cf6"
  },
  {
    icon: Target,
    title: "Leads que Não Convertem",
    description: "Atrai visitantes mas eles não viram clientes pagantes?",
    color: "#ec4899"
  },
  {
    icon: Users,
    title: "Concorrência Dominando",
    description: "Seus concorrentes aparecem no Google e você fica invisível?",
    color: "#06b6d4"
  },
  {
    icon: BarChart3,
    title: "Resultados Imprevisíveis",
    description: "Não consegue prever quantos clientes virão no próximo mês?",
    color: "#10b981"
  }
];

export function ProblemsSection() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            Reconhece algum desses desafios no seu negócio?
          </h2>
          <p className="text-xl text-gray-400">
            Você não está sozinho. Esses são os problemas mais comuns que impedindo seu crescimento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => (
            <ProblemCard key={index} problem={problem} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-2xl text-white mb-6">
            Podemos resolver <span className="text-[#7c3aed]">TODOS</span> esses problemas. Veja como ↓
          </p>
          <Button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
          >
            Ver Soluções Completas
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface ProblemCardProps {
  problem: {
    icon: any;
    title: string;
    description: string;
    color: string;
  };
  index: number;
}

function ProblemCard({ problem, index }: ProblemCardProps) {
  const Icon = problem.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-[#7c3aed]/50 transition-all duration-300">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c3aed]/0 to-[#7c3aed]/0 group-hover:from-[#7c3aed]/10 group-hover:to-transparent transition-all duration-300 -z-10" />
        
        {/* Icon */}
        <div className="mb-6 relative">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${problem.color}20` }}
          >
            <Icon className="w-8 h-8" style={{ color: problem.color }} />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: problem.color }} />
        </div>

        {/* Content */}
        <h3 className="text-xl text-white mb-3 group-hover:text-[#a78bfa] transition-colors">
          {problem.title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {problem.description}
        </p>
      </div>
    </motion.div>
  );
}
