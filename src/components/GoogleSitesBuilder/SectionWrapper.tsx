import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { SiteSection, ViewMode } from '../../types/siteBuilder';

interface SectionWrapperProps {
  section: SiteSection;
  index: number;
  totalSections: number;
  viewMode: ViewMode;
  onUpdateSection: (updated: SiteSection) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  index,
  totalSections,
  viewMode,
  onUpdateSection,
  onDuplicateSection,
  onDeleteSection,
  onMoveSection,
  children,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);
  const [tempSubtitle, setTempSubtitle] = useState(section.subtitle || '');

  // In live or preview mode, render child directly without editor borders or floating toolbars
  if (viewMode === 'live' || viewMode === 'preview') {
    if (!section.isVisible) return null;
    return <div id={section.id}>{children}</div>;
  }

  const handleSaveTitle = () => {
    onUpdateSection({
      ...section,
      title: tempTitle,
      subtitle: tempSubtitle,
    });
    setIsEditingTitle(false);
  };

  const cycleBgColor = () => {
    const bgOptions: SiteSection['bgColor'][] = [
      'bg-neutral-950',
      'bg-neutral-900',
      'bg-black',
      'bg-red-950/30',
      'bg-amber-950/20',
    ];
    const currentIndex = bgOptions.indexOf(section.bgColor || 'bg-neutral-950');
    const nextIndex = (currentIndex + 1) % bgOptions.length;
    onUpdateSection({
      ...section,
      bgColor: bgOptions[nextIndex],
    });
  };

  return (
    <div
      className={`group relative transition-all duration-200 border-2 ${
        isEditingTitle
          ? 'border-blue-500 shadow-xl'
          : 'border-transparent hover:border-blue-500/50'
      } ${!section.isVisible ? 'opacity-40' : ''}`}
    >
      {/* Google Sites Iconic Floating Section Controls (Left Flank) */}
      <div className="absolute left-3 top-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-900/95 border border-neutral-700 rounded-lg p-1 shadow-2xl backdrop-blur-md">
        {/* Drag handle icon */}
        <div className="p-1 text-neutral-400 cursor-grab" title="Bölümü Sürükle / Sırala">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Change Background Tone */}
        <button
          onClick={cycleBgColor}
          title="Bölüm Arka Plan Rengini Değiştir"
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {/* Edit Title/Subtitle */}
        <button
          onClick={() => setIsEditingTitle(!isEditingTitle)}
          title="Başlık ve Metinleri Düzenle"
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => onDuplicateSection(section.id)}
          title="Bölümü Çoğalt"
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Move Up */}
        <button
          onClick={() => onMoveSection(index, 'up')}
          disabled={index === 0}
          title="Yukarı Taşı"
          className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent hover:bg-neutral-800 rounded cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        {/* Move Down */}
        <button
          onClick={() => onMoveSection(index, 'down')}
          disabled={index === totalSections - 1}
          title="Aşağı Taşı"
          className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent hover:bg-neutral-800 rounded cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Visibility */}
        <button
          onClick={() => onUpdateSection({ ...section, isVisible: !section.isVisible })}
          title={section.isVisible ? 'Bölümü Gizle' : 'Bölümü Göster'}
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded cursor-pointer"
        >
          {section.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
        </button>

        {/* Delete Section */}
        <button
          onClick={() => onDeleteSection(section.id)}
          title="Bölümü Sil"
          className="p-1.5 text-neutral-300 hover:text-red-400 hover:bg-neutral-800 rounded cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Section Header Editor Overlay */}
      {isEditingTitle && (
        <div className="bg-neutral-900 border-b border-blue-500 p-4 text-xs text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">
              Bölüm Başlığı ve Açıklamasını Düzenleyin
            </span>
            <button
              onClick={handleSaveTitle}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Kaydet</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1">Bölüm Başlığı</label>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Alt Açıklama</label>
              <input
                type="text"
                value={tempSubtitle}
                onChange={(e) => setTempSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-neutral-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Render the actual section component */}
      <div className={section.bgColor || 'bg-neutral-950'}>
        {children}
      </div>
    </div>
  );
};
