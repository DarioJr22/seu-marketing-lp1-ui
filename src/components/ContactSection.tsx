import { motion } from 'motion/react';
import { useState } from 'react';
import { Phone, Mail, Instagram, MapPin, Send, Clock, Shield, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

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

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    company: '',
    services: [] as string[],
    message: '',
    budget: 5000
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Redirect to Instagram after 3 seconds
    setTimeout(() => {
      window.open('https://www.instagram.com/seu_marketing01/', '_blank');
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#0a0a0a]">
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
            Pronto para Transformar Seu Marketing?
          </h2>
          <p className="text-xl text-gray-400">
            Escolha a melhor forma de entrar em contato
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* WhatsApp */}
            <ContactCard
              icon={Phone}
              title="WhatsApp"
              subtitle="Fale Conosco Agora"
              content="+55 (81) 99149-7521"
              badge="🟢 Online Agora"
              action={() => window.open('https://wa.me/5581991497521?text=Olá!%20Vim%20pelo%20site%20e%20quero%20saber%20mais%20sobre%20os%20serviços', '_blank')}
              buttonText="Iniciar Conversa"
              color="#25D366"
            />

            {/* Instagram */}
            <ContactCard
              icon={Instagram}
              title="Instagram"
              subtitle="Siga e Envie DM"
              content="@seu_marketing01"
              action={() => window.open('https://www.instagram.com/seu_marketing01/', '_blank')}
              buttonText="Seguir & Enviar DM"
              color="#E4405F"
            />

            {/* Location */}
            <ContactCard
              icon={MapPin}
              title="Localização"
              subtitle="Onde Estamos"
              content="Cabo de Santo Agostinho, PE"
              details={[
                { icon: Clock, text: "Seg-Sex: 09h às 18h | Sáb: 09h às 12h" },
                { icon: Phone, text: "Atendimento 24h pelo WhatsApp" }
              ]}
              color="#7c3aed"
            />
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {!isSubmitted ? (
              <div className="p-8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl">
                <h3 className="text-2xl text-white mb-2">
                  Ou Preencha e Receba uma Proposta Personalizada
                </h3>
                <p className="text-gray-400 mb-6">
                  Responderemos em até 2 horas úteis
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label htmlFor="contact-name" className="text-white mb-2">
                      Nome Completo *
                    </Label>
                    <Input
                      id="contact-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                      className="bg-[#0a0a0a] border-white/10 focus:border-[#7c3aed] text-white"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label htmlFor="contact-whatsapp" className="text-white mb-2">
                      WhatsApp *
                    </Label>
                    <Input
                      id="contact-whatsapp"
                      required
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="bg-[#0a0a0a] border-white/10 focus:border-[#7c3aed] text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="contact-email" className="text-white mb-2">
                      E-mail *
                    </Label>
                    <Input
                      id="contact-email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="bg-[#0a0a0a] border-white/10 focus:border-[#7c3aed] text-white"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="contact-company" className="text-white mb-2">
                      Empresa
                    </Label>
                    <Input
                      id="contact-company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nome da sua empresa"
                      className="bg-[#0a0a0a] border-white/10 focus:border-[#7c3aed] text-white"
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <Label className="text-white mb-3">
                      Serviços de Interesse
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleServiceToggle(service)}
                          className={`text-left text-xs p-2 rounded-lg border transition-all ${
                            formData.services.includes(service)
                              ? 'bg-[#7c3aed]/20 border-[#7c3aed] text-white'
                              : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-[#7c3aed]/50'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="contact-message" className="text-white mb-2">
                      Mensagem
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Conte-nos um pouco sobre seu projeto e objetivos..."
                      rows={3}
                      className="bg-[#0a0a0a] border-white/10 focus:border-[#7c3aed] text-white resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.message.length}/500
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div>
                    <Label className="text-white mb-2">
                      Orçamento Estimado: R$ {formData.budget.toLocaleString('pt-BR')}
                    </Label>
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="500"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>R$ 500</span>
                      <span>R$ 50.000+</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] h-14 text-lg"
                  >
                    {isSubmitting ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Receber Proposta Grátis
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-500 pt-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>LGPD Compliant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#7c3aed]" />
                      <span>Resposta em até 2h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Sem compromisso</span>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <SuccessMessage />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, title, subtitle, content, badge, action, buttonText, color, details }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#7c3aed]/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-lg mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-2">{subtitle}</p>
          <p className="text-white mb-2">{content}</p>
          {badge && (
            <span className="inline-block text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full mb-3">
              {badge}
            </span>
          )}
          {details && (
            <div className="space-y-2 mb-3">
              {details.map((detail: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                  <detail.icon className="w-4 h-4" />
                  <span>{detail.text}</span>
                </div>
              ))}
            </div>
          )}
          {buttonText && (
            <Button
              onClick={action}
              className="w-full mt-2"
              style={{ backgroundColor: color }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-12 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-green-500" />
      </motion.div>
      <h3 className="text-3xl text-white mb-4">🎉 Proposta a Caminho!</h3>
      <p className="text-gray-400 mb-2">
        Recebemos sua solicitação. Nossa equipe entrará em contato em até 2 horas úteis.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Enquanto isso, siga-nos no Instagram para ver nossos últimos trabalhos!
      </p>
      <Button
        onClick={() => window.open('https://www.instagram.com/seu_marketing01/', '_blank')}
        className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888]"
      >
        Seguir @seu_marketing01
      </Button>
    </motion.div>
  );
}
