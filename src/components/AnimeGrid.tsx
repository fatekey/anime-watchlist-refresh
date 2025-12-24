import { UserCollection } from '@/types/bangumi';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  collections: UserCollection[];
  onCardClick?: (collection: UserCollection) => void;
}

export function AnimeGrid({ collections, onCardClick }: AnimeGridProps) {
  if (collections.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">📺</div>
        <p className="text-lg text-muted-foreground">暂无番剧数据</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          请输入你的 Bangumi 用户 ID 开始追踪
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {collections.map((collection, index) => (
        <AnimeCard
          key={collection.subject_id}
          collection={collection}
          index={index}
          onClick={() => onCardClick?.(collection)}
        />
      ))}
    </div>
  );
}
