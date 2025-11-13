import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Mail, Phone, Building2, Target, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const services = [
  'Gestão de Redes Sociais',
  'Design e Criação',
  'Tráfego Pago',
  'Produção de Conteúdo',
  'Branding e Posicionamento',
  'Assessoria e Estratégia',
  'Produção Audiovisual',
  'Relacionamento e CRM',
  'Pacote Completo'
];

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    company: '',
    selectedServices: [] as string[],
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with backend/Google Calendar API
    console.log('Agendamento:', formData);
    setStep('success');
    setTimeout(() => {
      window.open(`https://wa.me/5581991497521?text=Olá!%20Acabei%20de%20agendar%20uma%20consultoria%20pelo%20site.`, '_blank');
    }, 2000);
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service]
    }));
  };

  const resetAndClose = () => {
    setStep('form');
    setFormData({
      name: '',
      whatsapp: '',
      email: '',
      company: '',
      selectedServices: [],
      date: '',
      time: '',
      message: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#535353ff]/30 rounded-3xl max-w-2xl w-full p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={resetAndClose}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {step === 'form' ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-8">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-[#535353ff]" />
                      <h2 className="text-3xl text-white mb-2">
                        Agende uma Consultoria Gratuita
                      </h2>
                      <p className="text-gray-400">
                        Escolha o melhor dia e horário para conversarmos sobre seu projeto
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <Label htmlFor="name" className="text-white mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#535353ff]" />
                          Nome Completo *
                        </Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Como podemos te chamar?"
                          className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <Label htmlFor="whatsapp" className="text-white mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#535353ff]" />
                          WhatsApp *
                        </Label>
                        <Input
                          id="whatsapp"
                          required
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="(00) 00000-0000"
                          className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-white mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#535353ff]" />
                          E-mail *
                        </Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white"
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <Label htmlFor="company" className="text-white mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#535353ff]" />
                          Empresa
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nome da sua empresa"
                          className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white"
                        />
                      </div>

                      {/* Services */}
                      <div>
                        <Label className="text-white mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#535353ff]" />
                          Área de Interesse
                        </Label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {services.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => handleServiceToggle(service)}
                              className={`text-left text-sm p-3 rounded-lg border transition-all ${
                                formData.selectedServices.includes(service)
                                  ? 'bg-[#535353ff]/20 border-[#535353ff] text-white'
                                  : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-[#535353ff]/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {formData.selectedServices.includes(service) && (
                                  <Check className="w-4 h-4 text-[#535353ff]" />
                                )}
                                <span>{service}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date" className="text-white mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#535353ff]" />
                            Data *
                          </Label>
                          <Input
                            id="date"
                            required
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time" className="text-white mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#535353ff]" />
                            Horário *
                          </Label>
                          <select
                            id="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-white/10 focus:border-[#535353ff] text-white outline-none"
                          >
                            <option value="">Selecione</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <Label htmlFor="message" className="text-white mb-2">
                          Mensagem (opcional)
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Conte-nos um pouco sobre seu projeto e objetivos..."
                          rows={3}
                          className="bg-[#0a0a0a] border-white/10 focus:border-[#535353ff] text-white resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#535353ff] to-[#0d0d0d] hover:shadow-[0_0_30px_rgba(255,250,250,0.3)] h-12"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Confirmar Agendamento
                        </Button>
                        <Button
                          type="button"
                          onClick={() => window.open('https://wa.me/5581991497521?text=Olá!%20Gostaria%20de%20agendar%20uma%20consultoria', '_blank')}
                          variant="outline"
                          className="flex-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white h-12"
                        >
                          Prefiro WhatsApp Direto
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <SuccessState onClose={resetAndClose} />
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-green-500" />
      </motion.div>

      <h2 className="text-3xl text-white mb-4">🎉 Agendamento Confirmado!</h2>
      <p className="text-gray-400 mb-2">
        Recebemos sua solicitação. Nossa equipe entrará em contato em até 2 horas úteis.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        Enquanto isso, que tal nos seguir no Instagram?
      </p>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => window.open('https://www.instagram.com/seu_marketing01/', '_blank')}
          className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] hover:shadow-lg"
        >
          Seguir @seu_marketing01
        </Button>
        <Button onClick={onClose} variant="outline" className="border-white/20 text-white">
          Fechar
        </Button>
      </div>
    </motion.div>
  );
}
