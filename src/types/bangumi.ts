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
  air_date?: string;
  eps_count?: number;
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
  };
}

export const themes: Theme[] = [
  {
    id: 'sakura',
    name: '樱花',
    colors: {
      primary: '340 70% 55%',
      accent: '185 80% 50%',
      background: '230 25% 7%',
    },
  },
  {
    id: 'ocean',
    name: '海洋',
    colors: {
      primary: '210 80% 55%',
      accent: '185 80% 50%',
      background: '220 30% 8%',
    },
  },
  {
    id: 'sunset',
    name: '落日',
    colors: {
      primary: '25 90% 55%',
      accent: '45 90% 55%',
      background: '15 20% 8%',
    },
  },
  {
    id: 'forest',
    name: '森林',
    colors: {
      primary: '150 60% 45%',
      accent: '120 50% 40%',
      background: '160 20% 7%',
    },
  },
];
