export function WolfGraphic() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00ff88', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#00cc6a', stopOpacity: 0.4 }} />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Neural network background */}
      <g opacity="0.3" stroke="#00ff88" strokeWidth="0.5" fill="none">
        <line x1="50" y1="50" x2="150" y2="80" />
        <line x1="150" y1="80" x2="250" y2="100" />
        <line x1="250" y1="100" x2="350" y2="120" />
        <line x1="50" y1="150" x2="120" y2="180" />
        <line x1="120" y1="180" x2="220" y2="200" />
        <line x1="220" y1="200" x2="320" y2="180" />
        <line x1="80" y1="250" x2="180" y2="280" />
        <line x1="180" y1="280" x2="280" y2="300" />
        <line x1="280" y1="300" x2="350" y2="320" />
        
        <circle cx="50" cy="50" r="3" fill="#00ff88" />
        <circle cx="150" cy="80" r="3" fill="#00ff88" />
        <circle cx="250" cy="100" r="3" fill="#00ff88" />
        <circle cx="350" cy="120" r="3" fill="#00ff88" />
        <circle cx="50" cy="150" r="3" fill="#00ff88" />
        <circle cx="120" cy="180" r="3" fill="#00ff88" />
        <circle cx="220" cy="200" r="3" fill="#00ff88" />
        <circle cx="320" cy="180" r="3" fill="#00ff88" />
        <circle cx="80" cy="250" r="3" fill="#00ff88" />
        <circle cx="180" cy="280" r="3" fill="#00ff88" />
        <circle cx="280" cy="300" r="3" fill="#00ff88" />
        <circle cx="350" cy="320" r="3" fill="#00ff88" />
      </g>

      {/* Wolf silhouette from geometric lines */}
      <g stroke="url(#neonGlow)" strokeWidth="2" fill="none" filter="url(#glow)">
        {/* Head */}
        <path d="M 200 120 L 180 100 L 170 90 L 160 85 L 150 85 L 140 90 L 135 100 L 135 115 L 140 125" />
        <path d="M 200 120 L 220 100 L 230 90 L 240 85 L 250 85 L 260 90 L 265 100 L 265 115 L 260 125" />
        
        {/* Ears */}
        <path d="M 150 85 L 145 65 L 155 75" />
        <path d="M 250 85 L 255 65 L 245 75" />
        
        {/* Snout */}
        <path d="M 140 125 L 145 140 L 155 150 L 170 155 L 200 155" />
        <path d="M 260 125 L 255 140 L 245 150 L 230 155 L 200 155" />
        <path d="M 200 155 L 200 165" />
        
        {/* Eyes */}
        <circle cx="165" cy="110" r="4" fill="#00ff88" />
        <circle cx="235" cy="110" r="4" fill="#00ff88" />
        
        {/* Body */}
        <path d="M 200 165 L 200 180 L 195 200 L 190 230 L 188 260 L 185 290" />
        <path d="M 200 180 L 170 185 L 150 195 L 135 210 L 125 230" />
        <path d="M 200 180 L 230 185 L 250 195 L 265 210 L 275 230" />
        
        {/* Front legs */}
        <path d="M 150 195 L 145 220 L 142 250 L 140 280 L 138 310" />
        <path d="M 250 195 L 255 220 L 258 250 L 260 280 L 262 310" />
        
        {/* Back legs */}
        <path d="M 125 230 L 122 260 L 120 290 L 118 320" />
        <path d="M 275 230 L 278 260 L 280 290 L 282 320" />
        
        {/* Tail */}
        <path d="M 188 260 L 180 270 L 165 285 L 145 305 L 125 330" strokeWidth="2.5" />
        
        {/* Geometric accents */}
        <circle cx="200" cy="180" r="3" fill="#00ff88" />
        <circle cx="150" cy="195" r="3" fill="#00ff88" />
        <circle cx="250" cy="195" r="3" fill="#00ff88" />
        <circle cx="188" cy="260" r="3" fill="#00ff88" />
      </g>
    </svg>
  );
}
