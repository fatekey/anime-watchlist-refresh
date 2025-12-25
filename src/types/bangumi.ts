// Bangumi 相关类型定义

export interface BangumiSubject {
  id: number;
  name: string;
  name_cn: string;
  type: number;
  images?: {
    large?: string;
    common?: string;
    medium?: string;
    small?: string;
    grid?: string;
  };
  summary?: string;
  short_summary?: string;
  date?: string;  // API returns 'date' not 'air_date'
  eps?: number;
  eps_count?: number;
  score?: number;
  rating?: {
    score: number;
    total: number;
  };
  rank?: number;
  collection?: {
    wish: number;
    collect: number;
    doing: number;
    on_hold: number;
    dropped: number;
  };
  collection_total?: number;
  tags?: Array<{
    name: string;
    count: number;
  }>;
}

export interface UserCollection {
  subject_id: number;
  subject: BangumiSubject;
  rate: number;
  type: CollectionType;
  updated_at: string;
  comment?: string;
  tags?: string[];
  ep_status?: number;
  vol_status?: number;
  private?: boolean;
}

export enum CollectionType {
  WISH = 1,      // 想看
  COLLECT = 2,   // 看过
  DOING = 3,     // 在看
  ON_HOLD = 4,   // 搁置
  DROPPED = 5,   // 抛弃
}

export const CollectionTypeLabels: Record<CollectionType, string> = {
  [CollectionType.WISH]: '想看',
  [CollectionType.COLLECT]: '看过',
  [CollectionType.DOING]: '在看',
  [CollectionType.ON_HOLD]: '搁置',
  [CollectionType.DROPPED]: '抛弃',
};

export const CollectionTypeColors: Record<CollectionType, string> = {
  [CollectionType.WISH]: 'hsl(var(--anime-purple))',
  [CollectionType.COLLECT]: 'hsl(var(--anime-green))',
  [CollectionType.DOING]: 'hsl(var(--primary))',
  [CollectionType.ON_HOLD]: 'hsl(var(--anime-gold))',
  [CollectionType.DROPPED]: 'hsl(var(--muted-foreground))',
};

export interface BangumiStats {
  total: number;
  byType: Record<CollectionType, number>;
  byYear: Record<string, number>;
  averageRating: number;
  topRated: UserCollection[];
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    backgroundAlt: string;  // 第二背景色，用于渐变
    card: string;
    muted: string;
    border: string;
    ring: string;
  };
  gradientAngle: number;  // 背景渐变角度
  pattern?: 'none' | 'dots' | 'grid' | 'waves' | 'radial';  // 背景纹理
}

export const themes: Theme[] = [
  {
    id: 'sakura',
    name: '樱花',
    colors: {
      primary: '340 70% 55%',
      accent: '185 80% 50%',
      background: '320 25% 6%',
      backgroundAlt: '280 30% 12%',
      card: '310 20% 12%',
      muted: '300 15% 18%',
      border: '320 20% 22%',
      ring: '340 70% 55%',
    },
    gradientAngle: 135,
    pattern: 'radial',
  },
  {
    id: 'ocean',
    name: '海洋',
    colors: {
      primary: '200 90% 50%',
      accent: '170 80% 45%',
      background: '210 50% 4%',
      backgroundAlt: '195 45% 10%',
      card: '205 40% 10%',
      muted: '200 35% 16%',
      border: '200 30% 20%',
      ring: '200 90% 50%',
    },
    gradientAngle: 180,
    pattern: 'waves',
  },
  {
    id: 'sunset',
    name: '落日',
    colors: {
      primary: '20 95% 55%',
      accent: '45 100% 50%',
      background: '5 35% 5%',
      backgroundAlt: '25 40% 12%',
      card: '15 30% 10%',
      muted: '20 25% 16%',
      border: '25 25% 22%',
      ring: '20 95% 55%',
    },
    gradientAngle: 45,
    pattern: 'dots',
  },
  {
    id: 'forest',
    name: '森林',
    colors: {
      primary: '140 70% 40%',
      accent: '80 60% 45%',
      background: '160 35% 4%',
      backgroundAlt: '130 30% 10%',
      card: '150 25% 9%',
      muted: '145 20% 15%',
      border: '140 20% 18%',
      ring: '140 70% 40%',
    },
    gradientAngle: 160,
    pattern: 'grid',
  },
  {
    id: 'midnight',
    name: '午夜',
    colors: {
      primary: '260 85% 65%',
      accent: '290 70% 55%',
      background: '250 40% 4%',
      backgroundAlt: '270 35% 10%',
      card: '255 30% 10%',
      muted: '260 25% 16%',
      border: '265 25% 20%',
      ring: '260 85% 65%',
    },
    gradientAngle: 225,
    pattern: 'none',
  },
];
