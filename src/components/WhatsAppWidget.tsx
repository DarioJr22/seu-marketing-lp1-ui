import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Calendar, FileText, DollarSign, Phone } from 'lucide-react';

interface WhatsAppWidgetProps {
  onOpenScheduleModal: () => void;
}

export function WhatsAppWidget({ onOpenScheduleModal }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const quickActions = [
    {
      icon: FileText,
      label: 'Conhecer Serviços',
      action: () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    },
    {
      icon: Calendar,
      label: 'Agendar Consultoria',
      action: () => {
        onOpenScheduleModal();
        setIsOpen(false);
      }
    },
    {
      icon: DollarSign,
      label: 'Solicitar Orçamento',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    },
    {
      icon: Phone,
      label: 'Falar no WhatsApp',
      action: () => {
        window.open('https://wa.me/5581991497521?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informações', '_blank');
        setIsOpen(false);
      }
    }
  ];

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setShowNotification(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Main Button */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && showNotification && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-20 bottom-4 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap border border-white/10"
            >
              💬 Precisa de ajuda?
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#1a1a1a]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs z-10"
          >
            1
          </motion.div>
        )}

        {/* Button */}
        <motion.button
          type="button"
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isOpen ? 'bg-red-500' : 'bg-[#25D366]'
          }`}
          style={{
            boxShadow: isOpen
              ? '0 4px 20px rgba(239, 68, 68, 0.4)'
              : '0 4px 20px rgba(37, 211, 102, 0.4)'
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Pulse animation */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#25D366] -z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-24 right-0 w-[360px] max-w-[calc(100vw-3rem)] bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">SEU MARKETING</div>
                <div className="text-white/80 text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online agora
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 bg-[#0a0a0a]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">SM</span>
                </div>
                <div className="flex-1">
                  <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-none p-4 text-white text-sm">
                    <p className="mb-2">Olá! 👋 Bem-vindo à SEU MARKETING!</p>
                    <p className="mb-2">Como podemos transformar seu marketing hoje?</p>
                    <p className="text-gray-400 text-xs">Escolha uma opção abaixo ou mande sua dúvida:</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Agora</div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => action.action()}
                    className="flex items-center gap-2 p-3 bg-[#1a1a1a] hover:bg-[#7c3aed]/20 border border-[#7c3aed]/30 hover:border-[#7c3aed] rounded-xl transition-all text-sm text-white cursor-pointer"
                  >
                    <action.icon className="w-4 h-4 text-[#7c3aed] flex-shrink-0" />
                    <span className="text-xs text-left">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
              <div className="text-center text-xs text-gray-500">
                Resposta em minutos ⚡
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
