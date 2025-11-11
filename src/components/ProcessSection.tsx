import { motion } from 'motion/react';
import { Search, Target, Rocket, BarChart } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: Search,
    title: "DIAGNÓSTICO",
    description: "Analisamos profundamente seu negócio, concorrência e oportunidades",
    deliverables: [
      "Auditoria completa",
      "Identificação de gaps",
      "Mapeamento de personas"
    ],
    color: "#7c3aed"
  },
  {
    number: "02",
    icon: Target,
    title: "ESTRATÉGIA",
    description: "Criamos um plano personalizado com objetivos claros e mensuráveis",
    deliverables: [
      "Plano de ação 90 dias",
      "Definição de KPIs",
      "Cronograma detalhado"
    ],
    color: "#ec4899"
  },
  {
    number: "03",
    icon: Rocket,
    title: "EXECUÇÃO",
    description: "Colocamos tudo em prática com uma equipe especializada dedicada",
    deliverables: [
      "Criação de conteúdos",
      "Gestão de campanhas",
      "Produção audiovisual"
    ],
    color: "#f59e0b"
  },
  {
    number: "04",
    icon: BarChart,
    title: "OTIMIZAÇÃO",
    description: "Monitoramos resultados e otimizamos continuamente para máximo ROI",
    deliverables: [
      "Relatórios semanais",
      "Ajustes de estratégia",
      "Escalabilidade garantida"
    ],
    color: "#10b981"
  }
];

export function ProcessSection() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7c3aed]/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold md:text-5xl text-white mb-4">
            Como Trabalhamos: Processos Transparente e Eficaz
          </h2>
          <p className="text-xl font-semibold text-gray-400">
            4 etapas simples para transformar seu marketing
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}


          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>

          {/* Mobile Connection Line */}
        </div>
      </div>
    </section>
  );
}

interface ProcessStepProps {
  step: {
    number: string;
    icon: any;
    title: string;
    description: string;
    deliverables: string[];
    color: string;
  };
  index: number;
}

function ProcessStep({ step, index }: ProcessStepProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative"
    >
      {/* Card */}
      <div className="relative p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#7c3aed]/50 transition-all group">
        {/* Number */}
        <div
          className="absolute -top-6 left-6 w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] text-2xl z-10"
          style={{ backgroundColor: step.color }}
        >
          <span className="text-white">{step.number}</span>
        </div>

        {/* Icon */}
        <motion.div
          className="mt-6 mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: `${step.color}20` }}
          >
            <Icon className="w-8 h-8 relative z-10" style={{ color: step.color }} />
            <div
              className="absolute inset-0 rounded-xl blur-xl opacity-50"
              style={{ backgroundColor: step.color }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <h3
          className="text-2xl mb-3 group-hover:scale-105 transition-transform"
          style={{ color: step.color }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-6 leading-relaxed">
          {step.description}
        </p>

        {/* Deliverables */}
        <div className="space-y-2">
          <div className="text-white text-sm mb-2">Entregáveis:</div>
          {step.deliverables.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index * 0.2) + (idx * 0.1) }}
              className="flex items-center gap-2 text-gray-300 text-sm"
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: step.color }}
              />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
          style={{ backgroundColor: `${step.color}10` }}
        />
      </div>


    </motion.div>
  );
}
