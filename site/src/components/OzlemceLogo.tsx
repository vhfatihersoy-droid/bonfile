import React from 'react';

interface OzlemceLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const OzlemceLogo: React.FC<OzlemceLogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Height sizing for image
  const imgHeightClass =
    size === 'sm' ? 'h-9' : size === 'lg' ? 'h-16' : 'h-11 sm:h-12';

  // If on dark background, we can either render the image in a clean white rounded badge
  // or render the SVG/typographic equivalent styled for dark themes.
  if (variant === 'dark') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-stone-200/20 inline-flex items-center">
          <img
            src={`/ozlemce-logo.png`}
            alt="Özlemce Et Entegre Tesisi"
            className={`${imgHeightClass} w-auto object-contain max-w-[220px]`}
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!imageError ? (
        <img
          src={`/ozlemce-logo.png`}
          alt="Özlemce Et Entegre Tesisi"
          className={`${imgHeightClass} w-auto object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex flex-col select-none">
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            <span className="text-red-700">özlem</span>
            <span className="text-stone-950">ce</span>
          </div>
          {showSubtitle && (
            <div className="text-[11px] sm:text-xs font-bold italic tracking-wide text-stone-700 leading-tight mt-0.5">
              “Et Entegre Tesisi”
            </div>
          )}
        </div>
      )}
    </div>
  );
};
