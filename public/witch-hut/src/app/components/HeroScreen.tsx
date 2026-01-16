import { motion } from 'motion/react';
import { Eye } from 'lucide-react';

interface HeroScreenProps {
  onStart: () => void;
}

export function HeroScreen({ onStart }: HeroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1669669530583-f64e801e94ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZm9yZXN0JTIwbWlzdCUyMG5pZ2h0fGVufDF8fHx8MTc2ODQ5MDAyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Dark forest"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        <div className="absolute inset-0 bg-violet-950 mix-blend-multiply opacity-40" />
      </div>

      {/* Glowing Eyes in Shadows */}
      <motion.div
        className="absolute top-1/4 left-8 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_20px_8px_rgba(167,139,250,0.6)]"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-14 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_20px_8px_rgba(167,139,250,0.6)]"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1,
        }}
      />

      <motion.div
        className="absolute top-1/3 right-12 w-3 h-3 rounded-full bg-violet-300 shadow-[0_0_20px_8px_rgba(196,181,253,0.5)]"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-[4.5rem] w-3 h-3 rounded-full bg-violet-300 shadow-[0_0_20px_8px_rgba(196,181,253,0.5)]"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.1,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 max-w-lg text-center">
        {/* Wolf Symbol */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative">
            <Eye className="w-16 h-16 text-violet-400" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500 blur-xl opacity-40"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-3xl md:text-5xl mb-6 text-white leading-tight tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          You spend money. You give attention.{' '}
          <span className="text-violet-400">But you still don't know what she wants.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl text-violet-200 mb-12 tracking-wide"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Three questions. Ten seconds. One truth.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onStart}
          className="relative px-12 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg tracking-wider overflow-hidden group rounded-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Start the ritual</span>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full blur-xl bg-violet-500 opacity-50 group-hover:opacity-80 transition-opacity" />
        </motion.button>

        {/* Mystical line */}
        <motion.div
          className="mt-16 text-sm text-violet-300/50 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Enter at your own risk
        </motion.div>
      </div>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>
    </motion.div>
  );
}
