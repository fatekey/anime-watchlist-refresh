import { UserCollection } from '@/types/bangumi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Hash, ExternalLink, Play } from 'lucide-react';
import { CollectionTypeLabels, CollectionType } from '@/types/bangumi';
import { Button } from '@/components/ui/button';

interface AnimeDetailModalProps {
  collection: UserCollection | null;
  open: boolean;
  onClose: () => void;
}

export function AnimeDetailModal({ collection, open, onClose }: AnimeDetailModalProps) {
  if (!collection) return null;

  const { subject, rate, type, updated_at, comment, tags } = collection;
  const displayName = subject.name_cn || subject.name;
  const imageUrl = subject.images?.large || subject.images?.common;

  const statusColors: Record<CollectionType, string> = {
    [CollectionType.WISH]: 'bg-anime-purple/20 text-anime-purple border-anime-purple/30',
    [CollectionType.COLLECT]: 'bg-anime-green/20 text-anime-green border-anime-green/30',
    [CollectionType.DOING]: 'bg-primary/20 text-primary border-primary/30',
    [CollectionType.ON_HOLD]: 'bg-anime-gold/20 text-anime-gold border-anime-gold/30',
    [CollectionType.DROPPED]: 'bg-muted text-muted-foreground border-muted',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass glass-border max-w-2xl overflow-hidden p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Side */}
          <div className="relative aspect-[3/4] w-full md:w-1/3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Play className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card md:block hidden" />
          </div>

          {/* Content Side */}
          <div className="flex-1 p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl leading-tight">{displayName}</DialogTitle>
              {subject.name !== subject.name_cn && (
                <p className="text-sm text-muted-foreground">{subject.name}</p>
              )}
            </DialogHeader>

            <div className="space-y-4">
              {/* Status & Rating */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={statusColors[type]}>
                  {CollectionTypeLabels[type]}
                </Badge>
                {rate > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-current text-anime-gold" />
                    我的评分: {rate}
                  </Badge>
                )}
                {subject.rating?.score && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-current text-anime-gold" />
                    BGM: {subject.rating.score.toFixed(1)}
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {subject.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {subject.date}
                  </div>
                )}
                {subject.eps_count && (
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {subject.eps_count} 集
                  </div>
                )}
                {subject.rank && (
                  <div className="flex items-center gap-1">
                    排名: #{subject.rank}
                  </div>
                )}
              </div>

              {/* Summary */}
              {subject.summary && (
                <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {subject.summary}
                </p>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Comment */}
              {comment && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm italic text-muted-foreground">"{comment}"</p>
                </div>
              )}

              {/* Updated At */}
              <p className="text-xs text-muted-foreground">
                更新于 {new Date(updated_at).toLocaleDateString('zh-CN')}
              </p>

              {/* Link to Bangumi */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`https://bgm.tv/subject/${subject.id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                在 Bangumi 查看
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
