import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ResultScreenProps {
  onCTA: () => void;
}

export function ResultScreen({ onCTA }: ResultScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background with mystical glow */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600748338443-f7ea1054ed6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBuZW9uJTIwY3liZXIlMjBkYXJrfGVufDF8fHx8MTc2ODQ5MDAyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mystical background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/40 to-black" />
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/30 blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Floating symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-violet-400/20 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 max-w-lg text-center">
        {/* Icon */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative">
            <Sparkles className="w-20 h-20 text-violet-400" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500 blur-2xl opacity-60"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.7, 0.4],
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
          className="text-3xl md:text-4xl mb-8 text-white leading-tight tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          You're not stupid.{' '}
          <span className="text-violet-400">You just can't see the whole picture.</span>
        </motion.h1>

        {/* Text */}
        <motion.div
          className="mb-12 space-y-3 text-lg md:text-xl text-violet-200/90 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <p>She speaks in hints.</p>
          <p>You live straight.</p>
          <p className="text-violet-300 italic">Truth is not free.</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={onCTA}
            className="relative px-14 py-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white text-xl tracking-wider overflow-hidden group rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ opacity: 0.3 }}
            />
            <span className="relative z-10">Enter the Witch's Hut</span>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl bg-violet-500 opacity-60"
              animate={{
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.button>

          {/* Small text under button */}
          <motion.p
            className="text-sm text-violet-300/60 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
          >
            Be ready for an honest answer.
          </motion.p>
        </motion.div>

        {/* Mystical divider */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-3 text-violet-400/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-violet-400/40" />
          <span className="text-2xl">✦</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-violet-400/40" />
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
