import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { VideoText } from "@/components/ui/video-text";
import {MarqueeImpl } from '@/components/marqueeImpl';
import { Particles } from './ui/particles';

interface HeroSectionProps {
  onOpenScheduleModal: () => void,
  urlStorage?: string;
}

const rotatingPhrases = [
  "perde vendas pra concorrência?",
  "investe sem ver resultados?",
  "precisa dominar o digital?",
  "quer crescer de forma segura?",
  "merece uma presença forte?"
];

export function HeroSection({ onOpenScheduleModal, urlStorage }: HeroSectionProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);


  // Typewriter effect
  useEffect(() => {
    const phrase = rotatingPhrases[currentPhrase];
    const typingSpeed = isDeleting ? 10 : 20;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < phrase.length) {
          setDisplayedText(phrase.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(phrase.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhrase((prev) => (prev + 1) % rotatingPhrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhrase]);

  // Cursor blink
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
      <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      
     
      {/* <source src="https://minio.bombatech.com.br/api/v1/buckets/seumarketing/objects/download?prefix=video/video_herosec.mp4" type="video/mp4" /> */}
      <div className="absolute inset-0 z-10 bg-black/50"></div>

      {/* Fallback background caso o vídeo não carregue */}
      {!isVideoLoaded }

      {/* Content Container - Z-INDEX ALTO */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 text-center "
        style={
          {
            display:'flex'
          }
        }>
        {/* Container com gradiente radial sutil */}
        <div className="relative w-screen  rounded-3xl p-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="mb-8">
            <div className="relative h-[150px] w-full overflow-hidden">
              <VideoText src={`${urlStorage}objects/download?prefix=video/video_herosec.webm`}>
                SEU MARKETING
              </VideoText>
            </div>
          </motion.div>

          {/* Main Headline with TypeWriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold md:text-5xl text-white mb-4 drop-shadow-[0_0_15px_rgba(255,250,250,0.3)] filter brightness-110 ">
              Sua empresa{' '}
              <span className="inline-block min-w-[300px] md:min-w-[600px] text-left">
                <span className="text-[#fff] drop-shadow-[0_0_15px_rgba(255,250,250,0.5)]">{displayedText}</span>
                <span className={`inline-block w-1 h-8 md:h-12 bg-[#FFF] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} drop-shadow-[0_0_10px_rgba(255,250,255,0.8)]`} />
              </span>
            </h2>
            <p className="text-lg font-semibold md:text-xl text-gray-300 max-w-3xl mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] filter brightness-105">
              Transforme seu marketing em uma máquina de geração de resultados com estratégias que realmente funcionam
            </p>
          </motion.div>

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
            className="hover:shadow-[0_0_40px_rgba(255,250,250,0.6)] transition-all duration-300 hover:scale-105 text-lg px-8 py-6 animate-pulse"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Agendar Horário Gratuito
          </Button>
          

          <Button
            type="button"
            size="lg"
            onClick={() => window.open('https://wa.me/5581991497521?text=Olá!%20Gostaria%20de%20agendar%20uma%20consultoria', '_blank')}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:shadow-[0_0_40px_rgba(0,128,0,0.6)] hover:text-white px-8 py-6 h-12 w-64 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 animate-pulse"
          >
            Prefiro WhatsApp Direto
          </Button>
        </motion.div>
 
        </div>
      </div>
        
      {/* Scroll indicator - Z-INDEX MAIS ALTO */}
 <Particles
        className="absolute inset-0 z-0"
        quantity={230}
        ease={80}
        color={'#fff'}
        refresh
      />    
    </section>
     <MarqueeImpl />
   
     </>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
      <div className="text-4xl text-[#a78bfa] mb-2">{number}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}


