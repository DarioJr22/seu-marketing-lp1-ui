import { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemsSection } from './components/ProblemsSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { MediaGallerySection } from './components/MediaGallerySection';
import { CasesSection } from './components/CasesSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScheduleModal } from './components/ScheduleModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollProgress } from "@/components/ui/scroll-progress"


///
/* 
- [x] Verificar tsx no projeto
- Verificar magic ui no projeto
 shadcn - https://ui.shadcn.com/docs/installation/vite
 magic - https://magicui.design/docs/installation
- Fazer um hero section com video text (video dentro do texto) usando o componente VideoText



*/

export default function App() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [easterEggActivated, setEasterEggActivated] = useState(false);
  const [typedSequence, setTypedSequence] = useState('');
  const [url, setUrl] = useState(import.meta.env.VITE_MINIO_ENDPOINT );

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Easter egg detection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = typedSequence + e.key;
      setTypedSequence(newSequence);

      if (newSequence.toLowerCase().includes('spin')) {
        activateEasterEgg();
        setTypedSequence('');
      }

      // Clear sequence after 2 seconds of inactivity
      setTimeout(() => setTypedSequence(''), 2000);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [typedSequence]);

  const activateEasterEgg = () => {
    setEasterEggActivated(true);
    document.body.style.transition = 'transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    // Create confetti effect
    createConfetti();

    setTimeout(() => {
      document.body.style.transform = '';
      setEasterEggActivated(false);
    }, 2000);
  };

  const createConfetti = () => {
    const colors = ['#7c3aed', '#a78bfa', '#ec4899', '#f59e0b', '#10b981'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '10000';
      confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear`;

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Preloader />
      
      <Header onOpenScheduleModal={() => setIsScheduleModalOpen(true)} />
      
      <main>
        <HeroSection onOpenScheduleModal={() => setIsScheduleModalOpen(true)} urlStorage={url} />
        <ProblemsSection />
        <ServicesSection />
        <PortfolioSection />
        {/* <MediaGallerySection /> */}
        {/* <CasesSection /> */}
        <ProcessSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onOpenScheduleModal={() => setIsScheduleModalOpen(true)} />
        <ContactSection />
      </main>

      <Footer />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* WhatsApp Widget */}
      <WhatsAppWidget onOpenScheduleModal={() => setIsScheduleModalOpen(true)} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-all group"
            whileHover={{ y: -4 }}
          >
            <ArrowUp className="w-6 h-6 text-white group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Easter Egg Notification */}
      <AnimatePresence>
        {easterEggActivated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-[#7c3aed] text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20"
          >
            <div className="text-2xl mb-2">🎉 Você descobriu o segredo!</div>
            <div className="text-sm">🏆 Explorador de Sites</div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollProgress />

      

      {/* Confetti Animation CSS */}
      <style>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7c3aed;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a78bfa;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
