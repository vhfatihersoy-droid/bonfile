import React, { useState } from 'react';

interface MeatVisualProps {
  slug: string;
  name: string;
  category: string;
  className?: string;
  accentColor?: string;
  imageUrl?: string;
}

// Curated authentic food photography for real red meat, steak cuts, lamb, meatballs, and charcuterie
const curatedMeatPhotos: Record<string, string> = {
  // Steakhouse cuts
  'dana-bonfile-lokum': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
  'dallas-steak': 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&auto=format&fit=crop&q=80',
  't-bone-steak': 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
  'dana-antrikot': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80',

  // Lamb & Stew
  'kuzu-pirzola': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  'dana-kusbasi-marine': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
  'kuzu-incik-osso-buco': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',

  // Meatballs & Burgers
  'efecioglu-kasap-kofte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
  'bonfilet-kasap-kofte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
  'gurme-smash-burger-koftesi': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',

  // Charcuterie & Sucuk & Doner
  'kayseri-evlik-sucuk': 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=800&auto=format&fit=crop&q=80',
  'dana-antrikot-pastirma': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  'yaprak-et-doner-pismis': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
  'horeca-b2b-steakhouse-koli': 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&auto=format&fit=crop&q=80',
};

// Category-based fallback real meat photos
const categoryFallbacks: Record<string, string> = {
  steak: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&auto=format&fit=crop&q=80',
  beef: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80',
  lamb: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  meatball: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
  charcuterie: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=800&auto=format&fit=crop&q=80',
  doner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
  horeca: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
};

export const MeatVisual: React.FC<MeatVisualProps> = ({
  slug,
  name,
  category,
  className = 'w-full h-48',
  imageUrl,
}) => {
  const [useFallback, setUseFallback] = useState(false);

  // Target primary source
  const targetImage = (!useFallback && imageUrl) 
    ? imageUrl 
    : (curatedMeatPhotos[slug] || categoryFallbacks[category] || categoryFallbacks.default);

  return (
    <div className={`relative overflow-hidden bg-stone-100 group ${className}`}>
      <img
        src={targetImage}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          }
        }}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      {/* Subtle vignette gradient for appetizing depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
