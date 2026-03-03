import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h1 className="text-6xl text-primary" style={{ fontWeight: 700 }}>404</h1>
        <p className="text-xl text-muted-foreground">Страница не найдена</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl flex items-center gap-2 mx-auto"
          style={{ fontWeight: 600 }}
        >
          <Home className="w-5 h-5" />
          На главную
        </motion.button>
      </motion.div>
    </div>
  );
}
