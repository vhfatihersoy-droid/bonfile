import { Product, Recipe, SiteConfig } from '../types';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type ViewMode = 'editor' | 'preview' | 'live';
export type SidebarTab = 'insert' | 'pages' | 'themes';

export type SectionType =
  | 'hero'
  | 'catalog'
  | 'about'
  | 'cooking-guide'
  | 'horeca'
  | 'testimonials'
  | 'contact'
  | 'text-block'
  | 'image-text'
  | 'features-grid'
  | 'cta-banner';

export interface SiteSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  content?: string;
  bgColor?: 'bg-neutral-950' | 'bg-neutral-900' | 'bg-black' | 'bg-red-950/30' | 'bg-amber-950/20';
  isVisible: boolean;
  customData?: Record<string, any>;
}

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  isHome: boolean;
  sections: SiteSection[];
}

export interface GoogleSitesTheme {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  bgDark: string;
  fontFamily: string;
}
