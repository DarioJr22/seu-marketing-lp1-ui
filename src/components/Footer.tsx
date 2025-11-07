import { motion } from 'motion/react';
import { Instagram, Facebook, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

const serviceLinks = [
  'Gestão de Redes Sociais',
  'Design e Criação',
  'Tráfego Pago',
  'Produção de Conteúdo',
  'Branding e Posicionamento',
  'Assessoria e Estratégia',
  'Produção Audiovisual',
  'Relacionamento e CRM'
];

const companyLinks = [
  { label: 'Sobre Nós', href: '#about' },
  { label: 'Cases de Sucesso', href: '#cases' },
  { label: 'Depoimentos', href: '#testimonials' },
  { label: 'Contato', href: '#contact' }
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#5b21b6] bg-clip-text text-transparent">
                SEU MARKETING
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Agência de marketing digital especializada em resultados reais e mensuráveis. 
              Transformamos negócios através de estratégias inteligentes.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <SocialIcon
                icon={Instagram}
                href="https://www.instagram.com/seu_marketing01/"
                color="#E4405F"
                label="Instagram"
              />
              <SocialIcon
                icon={Facebook}
                href="#"
                color="#1877F2"
                label="Facebook"
              />
              <SocialIcon
                icon={Linkedin}
                href="#"
                color="#0A66C2"
                label="LinkedIn"
              />
              <SocialIcon
                icon={Mail}
                href="mailto:contato@seumarketing.com.br"
                color="#7c3aed"
                label="Email"
              />
            </div>
          </motion.div>

          {/* Column 2: Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 className="text-white mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-[#7c3aed] transition-colors text-sm inline-block relative group"
                  >
                    {service}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7c3aed] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#services"
                  className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors text-sm inline-block"
                >
                  Ver Todos os Serviços →
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 className="text-white mb-6">A Empresa</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#7c3aed] transition-colors text-sm inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7c3aed] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors text-sm inline-block"
                >
                  Agendar Consultoria →
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-white mb-6">Fique por Dentro</h4>
            <p className="text-gray-400 text-sm mb-4">
              Receba dicas exclusivas de marketing no seu e-mail
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-[#1a1a1a] border-white/10 focus:border-[#7c3aed] text-white"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  Inscrever
                </Button>
              </form>
            ) : (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                ✅ Inscrito com sucesso!
              </div>
            )}
            
            <p className="text-gray-500 text-xs mt-3 flex items-center gap-1">
              🔒 Sem spam. Apenas conteúdo de valor.
            </p>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              © 2025 SEU MARKETING. Todos os direitos reservados.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
                Política de Cookies
              </a>
              <a href="#" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
                LGPD
              </a>
            </div>
          </div>

          {/* Made in Pernambuco */}
          <div className="text-center mt-6 text-gray-500 text-xs">
            Desenvolvido com ❤️ em Pernambuco 🌴
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon, href, color, label }: any) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
      aria-label={label}
    >
      <Icon
        className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
        style={{ color: 'inherit' }}
      />
      <style jsx>{`
        a:hover {
          border-color: ${color};
          box-shadow: 0 0 20px ${color}40;
        }
      `}</style>
    </motion.a>
  );
}
