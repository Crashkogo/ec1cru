// Типы данных для приложения

export interface NewsItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
  isPinned?: boolean;
  pinnedUntil?: string;
}

export interface PromotionItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: boolean;
  isPublished: boolean;
  isPinned?: boolean;
  pinnedUntil?: string;
}

export interface Testimonial {
  id: number;
  companyName: string;
  content: string;
  slug: string;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  startDate: string;
  isPublished: boolean;
  ours: boolean;
  status: boolean;
  isPinned?: boolean;
  pinnedUntil?: string;
}

export interface UnifiedPost {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  date: string;
  type: 'news' | 'promotion' | 'event' | 'companylife';
  link: string;
  isPinned?: boolean;
  pinnedUntil?: string;
}

export interface Program {
  id: number;
  shortName: string;
}

export interface ReadySolutionItem {
  slug: string;
  title: string;
  shortDescription: string;
  type: string;
  price: number | null;
  freshSupport: boolean;
  programs: { program: Program }[];
}
