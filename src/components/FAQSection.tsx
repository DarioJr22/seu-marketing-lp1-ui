import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Quanto custa investir em marketing digital?",
    answer: "O investimento varia de acordo com as necessidades e objetivos do seu negócio. Trabalhamos com planos personalizados que se adaptam ao seu orçamento, garantindo sempre o melhor ROI. Agende uma consultoria gratuita para receber uma proposta sob medida para sua empresa."
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer: "Os primeiros resultados geralmente aparecem entre 30-60 dias, dependendo do serviço. Gestão de redes sociais e tráfego pago mostram resultados mais rápidos (30-45 dias), enquanto SEO e branding podem levar 60-90 dias para resultados significativos. Trabalhamos com metas progressivas e relatórios semanais para você acompanhar a evolução."
  },
  {
    question: "Vocês atendem empresas de qual porte?",
    answer: "Atendemos empresas de todos os portes: pequenas, médias e grandes. Temos soluções escaláveis que se adaptam desde negócios locais até empresas com presença nacional. O importante é ter vontade de crescer no digital!"
  },
  {
    question: "Como funciona o contrato?",
    answer: "Trabalhamos com contratos flexíveis e transparentes. Não praticamos fidelidade abusiva - você pode cancelar com 30 dias de aviso. Oferecemos planos mensais, trimestrais e anuais (com desconto). Nosso foco é entregar tanto valor que você vai querer continuar por vontade própria."
  },
  {
    question: "Vocês garantem resultados?",
    answer: "Sim! Oferecemos garantia de satisfação nos primeiros 30 dias. Se você não estiver satisfeito, devolvemos 100% do investimento. Além disso, trabalhamos com KPIs claros e mensuráveis, mostrando exatamente o que está sendo feito e os resultados alcançados através de relatórios detalhados."
  },
  {
    question: "Qual a diferença da SEU MARKETING para outras agências?",
    answer: "Nossa diferença está em 5 pilares: (1) Transparência total com relatórios semanais, (2) Foco em ROI e resultados mensuráveis, não apenas em métricas de vaidade, (3) Atendimento humanizado com resposta em até 2 horas, (4) Consultoria dedicada sem terceirização, e (5) Garantia de satisfação. Somos obcecados por resultados reais para nossos clientes."
  },
  {
    question: "Vocês trabalham com que tipo de empresas?",
    answer: "Atendemos empresas de diversos segmentos: e-commerce, serviços, indústria, educação, saúde, beleza, tecnologia e muito mais. Nossa metodologia é adaptável a qualquer nicho de mercado. O que importa é ter um produto/serviço de qualidade e vontade de crescer."
  },
  {
    question: "Preciso ter redes sociais ativas para começar?",
    answer: "Não! Podemos começar do zero, criando suas redes sociais do início, ou otimizar perfis já existentes. Fazemos toda a configuração, criação de identidade visual e estratégia de conteúdo. Se você já tem presença digital, fazemos uma auditoria completa e otimizamos tudo."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a2e]">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-400">
            Tudo o que você precisa saber sobre nossos serviços
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  faq: {
    question: string;
    answer: string;
  };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#7c3aed]/50 transition-all"
      >
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg text-white group-hover:text-[#a78bfa] transition-colors pr-4">
            {faq.question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-6 h-6 text-[#7c3aed]" />
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? 16 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-gray-400 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      </button>
    </motion.div>
  );
}
