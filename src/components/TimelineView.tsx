import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star } from 'lucide-react';
import { UserCollection, CollectionTypeLabels, CollectionTypeColors } from '@/types/bangumi';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface TimelineViewProps {
  collections: UserCollection[];
  onCardClick?: (collection: UserCollection) => void;
}

interface TimelineGroup {
  year: string;
  month: string;
  items: UserCollection[];
}

export const TimelineView = ({ collections, onCardClick }: TimelineViewProps) => {
  // 按时间分组
  const timelineGroups = useMemo(() => {
    const groups: Record<string, TimelineGroup> = {};

    // 按更新时间排序（最新的在前）
    const sortedCollections = [...collections].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    sortedCollections.forEach((collection) => {
      const date = parseISO(collection.updated_at);
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');
      const key = `${year}-${month}`;

      if (!groups[key]) {
        groups[key] = {
          year,
          month,
          items: [],
        };
      }

      groups[key].items.push(collection);
    });

    return Object.values(groups).sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}`);
      const dateB = new Date(`${b.year}-${b.month}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [collections]);

  const getMonthName = (month: string) => {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return monthNames[parseInt(month) - 1];
  };

  if (collections.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>暂无时间线数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 时间线主轴 */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

      <div className="space-y-12">
        {timelineGroups.map((group, groupIndex) => (
          <motion.div
            key={`${group.year}-${group.month}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="relative"
          >
            {/* 时间标签 */}
            <div className="sticky top-20 z-10 mb-6 flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
                <Calendar className="relative h-6 w-6 text-primary" />
              </div>
              <div className="glass glass-border rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">{group.year} 年</p>
                <p className="text-lg font-bold">{getMonthName(group.month)}</p>
              </div>
            </div>

            {/* 该月的番剧列表 */}
            <div className="ml-24 space-y-4">
              {group.items.map((collection, itemIndex) => (
                <motion.div
                  key={collection.subject_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 + itemIndex * 0.05 }}
                >
                  <Card
                    className="group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
                    onClick={() => onCardClick?.(collection)}
                  >
                    <div className="flex gap-4 p-4">
                      {/* 封面图 */}
                      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={collection.subject.images?.medium || collection.subject.images?.common}
                          alt={collection.subject.name_cn || collection.subject.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* 状态角标 */}
                        <div
                          className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                          style={{
                            backgroundColor: CollectionTypeColors[collection.type],
                          }}
                        >
                          {CollectionTypeLabels[collection.type]}
                        </div>
                      </div>

                      {/* 信息区 */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="mb-1 line-clamp-2 font-bold">
                            {collection.subject.name_cn || collection.subject.name}
                          </h3>
                          {collection.subject.name_cn && (
                            <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
                              {collection.subject.name}
                            </p>
                          )}
                          {collection.comment && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {collection.comment}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          {/* 评分 */}
                          {collection.rate > 0 && (
                            <div className="flex items-center gap-1 text-primary">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-medium">{collection.rate}</span>
                            </div>
                          )}

                          {/* 更新时间 */}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(parseISO(collection.updated_at), 'MM-dd HH:mm', {
                                locale: zhCN,
                              })}
                            </span>
                          </div>

                          {/* 标签 */}
                          {collection.tags && collection.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {collection.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>共 {collections.length} 条记录</p>
      </div>
    </div>
  );
};
