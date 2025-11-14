import { motion } from 'motion/react';
import { Calendar, MessageCircle, Instagram } from 'lucide-react';
import { Button } from './ui/button';

interface CTASectionProps {
  onOpenScheduleModal: () => void;
}

export function CTASection({ onOpenScheduleModal }: CTASectionProps) {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-[#0d0d0d] via-[#3c3c3c] to-[#000]">
      {/* Animated particles background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <div className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm">
            🔥 OFERTA ESPECIAL
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl text-white mb-6 font-bold leading-tight" 
        >
          Chega de Perder Clientes Para a Concorrência
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/90 mb-4 font-semibold leading-relaxed"
        >
          Comece Hoje Mesmo a Dominar o Marketing Digital do Seu Mercado
        </motion.p>

        {/* Offer */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-white/80 mb-12"
        >
          Primeira Consultoria <span className="text-yellow-400">100% Gratuita</span> e Sem Compromisso
        </motion.p>

        {/* CTAs */}
         {/* CTAs */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
          <Button
            onClick={onOpenScheduleModal}
            size="lg"
            className="hover:shadow-[0_0_40px_rgba(255,250,250,0.6)] transition-all duration-300 hover:scale-105 text-lg px-8 py-6 "
          >
            <Calendar className="mr-2 h-5 w-5" />
            Agendar Horário Gratuito
          </Button>
          

          <Button
            type="button"
            size="lg"
            onClick={() => window.open('https://wa.me/5581991497521?text=Olá!%20Gostaria%20de%20agendar%20uma%20consultoria', '_blank')}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:shadow-[0_0_40px_rgba(0,128,0,0.6)] hover:text-white px-8 py-6 h-12 w-64 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 a"
          >
            Prefiro WhatsApp Direto
          </Button>
        </motion.div>

        {/* Link to Instagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <a
            href="https://www.instagram.com/seu_marketing01/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
          >
            <Instagram className="w-5 h-5" />
            Ver Portfolio no Instagram
          </a>
        </motion.div>

        {/* Urgency elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/70 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>127 pessoas visualizaram hoje</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
          <div className="flex items-center gap-2">
            <span>✨ Apenas 3 vagas disponíveis esta semana</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
