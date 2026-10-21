import React, { useState } from 'react';

interface MeatVisualProps {
  slug: string;
  name: string;
  category: string;
  className?: string;
  accentColor?: string;
  imageUrl?: string;
}

export const MeatVisual: React.FC<MeatVisualProps> = ({
  slug,
  name,
  category,
  className = 'w-full h-48',
  accentColor = '#B91C1C',
  imageUrl,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  // Return tailored SVG artwork representing each meat cut with high fidelity
  const renderVisual = () => {
    switch (slug) {
      case 'dana-bonfile-lokum':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="meatGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7F1D1D" />
                <stop offset="50%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#581212" />
              </linearGradient>
              <linearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FEE2E2" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="400" height="250" fill="#18181B" />
            <circle cx="200" cy="125" r="95" fill="#27272A" />
            {/* Wooden cutting board texture lines */}
            <path d="M50 30 Q200 20 350 30" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 8" fill="none" />
            <path d="M50 220 Q200 230 350 220" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 8" fill="none" />
            {/* Tenderloin medallions */}
            <g transform="translate(110, 65)">
              <ellipse cx="45" cy="55" rx="42" ry="36" fill="url(#meatGrad1)" />
              <ellipse cx="45" cy="55" rx="38" ry="32" stroke="#EF4444" strokeWidth="1.5" fill="none" />
              {/* Marbling veins */}
              <path d="M25 45 Q40 50 55 42 Q65 48 70 60" stroke="#FECACA" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
              <path d="M30 65 Q45 60 60 70" stroke="#FECACA" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <circle cx="50" cy="40" r="1.5" fill="#FFFFFF" />
              <circle cx="35" cy="60" r="1.5" fill="#FFFFFF" />
              {/* Rosemary sprig */}
              <path d="M45 25 Q50 15 65 10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M48 20 L55 18" stroke="#16A34A" strokeWidth="2" />
              <path d="M52 15 L60 12" stroke="#16A34A" strokeWidth="2" />
            </g>
            <g transform="translate(200, 75)">
              <ellipse cx="45" cy="55" rx="44" ry="38" fill="url(#meatGrad1)" />
              <ellipse cx="45" cy="55" rx="40" ry="34" stroke="#DC2626" strokeWidth="1.5" fill="none" />
              <path d="M22 48 Q38 52 52 46 Q64 52 72 62" stroke="#FECACA" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M28 68 Q48 64 65 72" stroke="#FECACA" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              {/* Sea salt crystal specks */}
              <rect x="35" y="45" width="3" height="3" fill="#FFFFFF" transform="rotate(25 35 45)" />
              <rect x="55" y="60" width="3" height="3" fill="#FFFFFF" transform="rotate(40 55 60)" />
              <rect x="42" y="70" width="2.5" height="2.5" fill="#FFFFFF" transform="rotate(10 42 70)" />
              {/* Black pepper corns */}
              <circle cx="48" cy="48" r="2" fill="#09090B" />
              <circle cx="62" cy="55" r="1.8" fill="#09090B" />
            </g>
            {/* Stamp label */}
            <rect x="18" y="18" width="96" height="24" rx="4" fill="#09090B" fillOpacity="0.8" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">LOKUM DİLİM</text>
          </svg>
        );

      case 'dallas-steak':
      case 't-bone-steak':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="steakGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="50%" stopColor="#9F1239" />
                <stop offset="100%" stopColor="#4C0519" />
              </linearGradient>
              <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="400" height="250" fill="#111827" />
            {/* Grill iron marks */}
            <path d="M80 30 L320 220" stroke="#1F2937" strokeWidth="12" opacity="0.5" />
            <path d="M140 20 L360 190" stroke="#1F2937" strokeWidth="12" opacity="0.5" />
            <path d="M30 70 L260 250" stroke="#1F2937" strokeWidth="12" opacity="0.5" />
            {/* Steak silhouette with bone */}
            <g transform="translate(100, 35)">
              <path
                d="M40 30 C70 10, 160 15, 180 50 C195 80, 190 130, 160 160 C120 190, 60 180, 30 150 C10 120, 15 60, 40 30 Z"
                fill="url(#steakGrad)"
                stroke="#BE123C"
                strokeWidth="2"
              />
              {/* T or Curved Bone */}
              <path
                d="M60 40 C65 80, 70 110, 75 145 M50 70 L95 75"
                stroke="url(#boneGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <circle cx="75" cy="145" r="9" fill="#FDE68A" />
              {/* Intricate marbling streaks */}
              <path d="M90 40 Q110 55 130 45 Q150 50 165 70" stroke="#FEE2E2" strokeWidth="2.5" fill="none" opacity="0.75" />
              <path d="M95 70 Q120 85 140 75 Q160 85 170 105" stroke="#FEE2E2" strokeWidth="3" fill="none" opacity="0.8" />
              <path d="M85 105 Q115 115 135 110 Q150 125 155 145" stroke="#FEE2E2" strokeWidth="2.5" fill="none" opacity="0.75" />
              <path d="M80 135 Q100 145 125 140" stroke="#FEE2E2" strokeWidth="2" fill="none" opacity="0.65" />
              {/* Grill char overlay marks */}
              <line x1="85" y1="35" x2="165" y2="145" stroke="#374151" strokeWidth="3.5" strokeDasharray="14 12" opacity="0.7" />
              <line x1="120" y1="30" x2="185" y2="120" stroke="#374151" strokeWidth="3.5" strokeDasharray="14 12" opacity="0.7" />
            </g>
            <rect x="18" y="18" width="115" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              {slug === 'dallas-steak' ? 'DRY-AGED 28 GÜN' : 'T-BONE STEAK'}
            </text>
          </svg>
        );

      case 'dana-antrikot':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="ribeyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#991B1B" />
                <stop offset="60%" stopColor="#B91C1C" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            <rect width="400" height="250" fill="#18181B" />
            <ellipse cx="200" cy="125" rx="150" ry="85" fill="#27272A" />
            {/* Ribeye Cut */}
            <g transform="translate(70, 45)">
              <path
                d="M40 50 C70 15, 180 20, 220 50 C250 80, 245 125, 205 145 C150 165, 70 160, 30 130 C5 100, 15 70, 40 50 Z"
                fill="url(#ribeyeGrad)"
                stroke="#EF4444"
                strokeWidth="2"
              />
              {/* Fat cap on top border */}
              <path
                d="M40 50 C70 15, 180 20, 220 50"
                stroke="#FEF3C7"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              {/* Eye of ribeye fat ring */}
              <ellipse cx="120" cy="90" rx="30" ry="22" stroke="#FEF3C7" strokeWidth="4" fill="none" opacity="0.8" />
              {/* Marbled striations */}
              <path d="M60 85 Q90 95 105 85" stroke="#FEE2E2" strokeWidth="2.5" fill="none" opacity="0.75" />
              <path d="M150 85 Q175 95 200 80" stroke="#FEE2E2" strokeWidth="3" fill="none" opacity="0.75" />
              <path d="M140 115 Q170 125 195 110" stroke="#FEE2E2" strokeWidth="2" fill="none" opacity="0.7" />
              <path d="M70 120 Q105 130 130 120" stroke="#FEE2E2" strokeWidth="2" fill="none" opacity="0.7" />
              {/* Sea salt flake sparkles */}
              <circle cx="85" cy="70" r="2.5" fill="#FFFFFF" />
              <circle cx="165" cy="65" r="2.5" fill="#FFFFFF" />
              <circle cx="135" cy="125" r="2" fill="#FFFFFF" />
            </g>
            <rect x="18" y="18" width="95" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">DANA ANTRİKOT</text>
          </svg>
        );

      case 'kuzu-pirzola':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <rect width="400" height="250" fill="#1C1917" />
            {/* Plate border */}
            <circle cx="200" cy="125" r="100" stroke="#292524" strokeWidth="3" fill="#262626" />
            {/* 3 French trimmed lamb chops */}
            {[
              { x: 120, y: 70, rot: -20 },
              { x: 180, y: 80, rot: 5 },
              { x: 240, y: 85, rot: 30 },
            ].map((chop, i) => (
              <g key={i} transform={`translate(${chop.x}, ${chop.y}) rotate(${chop.rot})`}>
                {/* Bone stem */}
                <line x1="0" y1="-45" x2="0" y2="20" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
                {/* Meat lollipop eye */}
                <ellipse cx="0" cy="30" rx="26" ry="20" fill="#991B1B" stroke="#B91C1C" strokeWidth="1.5" />
                <ellipse cx="0" cy="30" rx="18" ry="13" fill="#B91C1C" />
                <path d="M-10 28 Q0 34 10 26" stroke="#FEF3C7" strokeWidth="2" fill="none" opacity="0.7" />
              </g>
            ))}
            {/* Thyme & Garlic garnish */}
            <path d="M160 170 Q200 150 240 165" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="170" cy="180" r="8" fill="#F3F4F6" />
            <circle cx="230" cy="180" r="7" fill="#F3F4F6" />
            <rect x="18" y="18" width="110" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">KUZU PİRZOLA</text>
          </svg>
        );

      case 'efecioglu-kasap-kofte':
      case 'bonfilet-kasap-kofte':
      case 'gurme-smash-burger-koftesi':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <rect width="400" height="250" fill="#18181B" />
            {/* Cast iron skillet ring */}
            <circle cx="200" cy="125" r="95" stroke="#3F3F46" strokeWidth="8" fill="#27272A" />
            {slug.includes('kofte') ? (
              // 4 Traditional elongated meatballs
              <g>
                {[
                  { cx: 160, cy: 95, rot: 15 },
                  { cx: 235, cy: 90, rot: -25 },
                  { cx: 160, cy: 155, rot: -30 },
                  { cx: 235, cy: 155, rot: 20 },
                ].map((k, idx) => (
                  <g key={idx} transform={`translate(${k.cx}, ${k.cy}) rotate(${k.rot})`}>
                    <rect x="-35" y="-14" width="70" height="28" rx="14" fill="#9A3412" stroke="#C2410C" strokeWidth="1.5" />
                    {/* Grill strip lines */}
                    <line x1="-20" y1="-12" x2="-20" y2="12" stroke="#431407" strokeWidth="3" opacity="0.8" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#431407" strokeWidth="3" opacity="0.8" />
                    <line x1="20" y1="-12" x2="20" y2="12" stroke="#431407" strokeWidth="3" opacity="0.8" />
                  </g>
                ))}
              </g>
            ) : (
              // Smash burger patty
              <g transform="translate(200, 125)">
                <circle cx="0" cy="0" r="62" fill="#7C2D12" stroke="#9A3412" strokeWidth="3" />
                <circle cx="0" cy="0" r="54" fill="#9A3412" />
                {/* Craggy lace edges */}
                <path
                  d="M-55 -25 Q-65 0 -58 25 Q-45 58 -15 62 Q25 65 52 35 Q65 5 58 -30 Q40 -60 0 -62 Q-35 -60 -55 -25 Z"
                  stroke="#431407"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Melted cheese drip indication */}
                <path d="M-30 -15 Q0 -5 30 -20 Q20 30 -10 35 Z" fill="#FBBF24" opacity="0.8" />
              </g>
            )}
            <rect x="18" y="18" width="105" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              {slug.includes('kofte') ? 'KASAP KÖFTE' : 'SMASH BURGER'}
            </text>
          </svg>
        );

      case 'kayseri-evlik-sucuk':
      case 'dana-antrikot-pastirma':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <rect width="400" height="250" fill="#1C1917" />
            <g transform="translate(200, 125)">
              {slug === 'kayseri-evlik-sucuk' ? (
                // Horseshoe traditional Turkish sucuk coil
                <g>
                  <path
                    d="M-60 60 C-90 -30, 90 -30, 60 60"
                    stroke="#991B1B"
                    strokeWidth="32"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M-60 60 C-90 -30, 90 -30, 60 60"
                    stroke="#7F1D1D"
                    strokeWidth="24"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Tie twine string */}
                  <path d="M-60 68 L-60 76 M60 68 L60 76 M-60 76 C-20 85, 20 85, 60 76" stroke="#D97706" strokeWidth="2.5" fill="none" />
                  {/* Garlic clove & bay leaves */}
                  <circle cx="0" cy="15" r="12" fill="#FEF3C7" />
                </g>
              ) : (
                // Thin pastirma slices with fenugreek çemen border
                <g>
                  {[
                    { y: -35, rot: -8 },
                    { y: -5, rot: 4 },
                    { y: 25, rot: -4 },
                  ].map((p, idx) => (
                    <g key={idx} transform={`translate(0, ${p.y}) rotate(${p.rot})`}>
                      <rect x="-90" y="-18" width="180" height="36" rx="6" fill="#7F1D1D" />
                      {/* Çemen spicy crust border */}
                      <path d="M-90 -18 H90" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
                      <line x1="-60" y1="0" x2="60" y2="0" stroke="#FECACA" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                    </g>
                  ))}
                </g>
              )}
            </g>
            <rect x="18" y="18" width="105" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              {slug === 'kayseri-evlik-sucuk' ? 'FERMENTE SUCUK' : 'ÇEMENLİ PASTIRMA'}
            </text>
          </svg>
        );

      case 'yaprak-et-doner-pismis':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <rect width="400" height="250" fill="#18181B" />
            {/* Copper serving platter */}
            <ellipse cx="200" cy="125" rx="140" ry="75" fill="#78350F" stroke="#B45309" strokeWidth="3" />
            <ellipse cx="200" cy="125" rx="125" ry="65" fill="#292524" />
            {/* Layered leaf doner shavings */}
            <g transform="translate(110, 85)">
              {[
                { x: 10, y: 15, w: 90, h: 22, rot: 5 },
                { x: 60, y: 5, w: 105, h: 24, rot: -8 },
                { x: 25, y: 40, w: 110, h: 26, rot: 12 },
                { x: 75, y: 35, w: 95, h: 23, rot: -4 },
                { x: 45, y: 58, w: 100, h: 22, rot: 3 },
              ].map((leaf, idx) => (
                <rect
                  key={idx}
                  x={leaf.x}
                  y={leaf.y}
                  width={leaf.w}
                  height={leaf.h}
                  rx="6"
                  transform={`rotate(${leaf.rot} ${leaf.x + leaf.w / 2} ${leaf.y + leaf.h / 2})`}
                  fill="#9A3412"
                  stroke="#7C2D12"
                  strokeWidth="1.5"
                />
              ))}
              {/* Grilled tomato & green pepper garnish */}
              <circle cx="15" cy="55" r="16" fill="#DC2626" />
              <path d="M165 40 Q180 60 170 85" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            <rect x="18" y="18" width="105" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="sans-serif">YAPRAK DÖNER</text>
          </svg>
        );

      case 'horeca-b2b-steakhouse-koli':
      default:
        return (
          <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
            <rect width="400" height="250" fill="#0F172A" />
            {/* Heavy-duty insulated shipping box & seal */}
            <g transform="translate(125, 45)">
              <polygon points="75,10 145,45 75,80 5,45" fill="#334155" stroke="#475569" strokeWidth="2" />
              <polygon points="5,45 75,80 75,155 5,120" fill="#1E293B" stroke="#475569" strokeWidth="2" />
              <polygon points="145,45 75,80 75,155 145,120" fill="#0F172A" stroke="#475569" strokeWidth="2" />
              {/* Cold chain icon badge */}
              <circle cx="75" cy="80" r="24" fill="#0284C7" />
              <path d="M75 66 V94 M61 80 H89 M65 70 L85 90 M65 90 L85 70" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <rect x="18" y="18" width="120" height="24" rx="4" fill="#09090B" fillOpacity="0.85" />
            <text x="26" y="34" fill="#38BDF8" fontSize="11" fontWeight="700" fontFamily="sans-serif">HORECA / EDT</text>
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden bg-neutral-900 group ${className}`}>
      {imageUrl && !imgFailed ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgFailed(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        renderVisual()
      )}
      {/* Subtle vignette gloss */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
