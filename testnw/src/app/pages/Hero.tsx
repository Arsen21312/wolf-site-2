import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { WolfGraphic } from '../components/WolfGraphic';
import { Brain } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Brand logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Brain className="w-8 h-8 text-primary" strokeWidth={1.5} />
              <span className="text-xl text-muted-foreground tracking-wider">
                НЕЙРОННЫЙ ВОЛК
              </span>
            </motion.div>

            {/* Main heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl tracking-tight"
                style={{ fontWeight: 700, lineHeight: 1.1 }}
              >
                Индекс<br />
                Внутреннего<br />
                <span className="text-primary">Волка</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-md"
              >
                Пройди тест из 24 вопросов и узнай свой психологический профиль
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Очищаем старые результаты перед началом нового теста
                localStorage.removeItem('wolfTestAnswers');
                navigate('/test');
              }}
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl overflow-hidden transition-all duration-300"
              style={{ fontWeight: 600, fontSize: '1.125rem' }}
            >
              <span className="relative z-10">Начать тест</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-muted-foreground/60"
            >
              Тест носит информационный характер и не является медицинской диагностикой
            </motion.p>
          </motion.div>

          {/* Right side - Wolf graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"
              />
              <WolfGraphic />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}