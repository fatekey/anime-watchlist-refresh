import { UserCollection } from '@/types/bangumi';
import { motion } from 'framer-motion';
import { Star, Calendar, Play } from 'lucide-react';

interface AnimeCardProps {
  collection: UserCollection;
  index: number;
  onClick?: () => void;
}

export function AnimeCard({ collection, index, onClick }: AnimeCardProps) {
  const { subject, rate } = collection;
  const displayName = subject.name_cn || subject.name;
  const imageUrl = subject.images?.large || subject.images?.common || subject.images?.medium;
  const score = subject.rating?.score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

          {/* Rating Badge */}
          {rate > 0 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
              <Star className="h-3 w-3 fill-current" />
              {rate}
            </div>
          )}

          {/* BGM Score */}
          {score && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              <span className="text-anime-gold">★</span>
              {score.toFixed(1)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
            {displayName}
          </h3>
          {subject.air_date && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {subject.air_date}
            </div>
          )}
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-lg border border-transparent transition-colors duration-300 group-hover:border-primary/50" />
      </div>
    </motion.div>
  );
}
