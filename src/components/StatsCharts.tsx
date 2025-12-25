import { BangumiStats, CollectionType, CollectionTypeLabels, CollectionTypeColors, UserCollection } from '@/types/bangumi';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMemo } from 'react';

interface StatsChartsProps {
  stats: BangumiStats;
  collections: UserCollection[];
}

export function StatsCharts({ stats, collections }: StatsChartsProps) {
  // Prepare data for collection type pie chart
  const typeData = Object.entries(stats.byType)
    .map(([type, count]) => ({
      name: CollectionTypeLabels[Number(type) as CollectionType],
      value: count,
      color: CollectionTypeColors[Number(type) as CollectionType],
    }))
    .filter(d => d.value > 0);

  // Prepare data for yearly bar chart - show ALL years
  const yearData = Object.entries(stats.byYear)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, count]) => ({
      year,
      count,
    }));

  // Calculate tag preferences from high-rated anime (7+)
  // Take top 6 tags from each anime, then aggregate
  const tagCloud = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    collections
      .filter(c => c.rate && c.rate >= 7)
      .forEach(c => {
        // Take only top 6 tags from each anime
        const topTags = c.subject.tags?.slice(0, 6) || [];
        topTags.forEach(tag => {
          tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
        });
      });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30) // Show up to 30 tags
      .map(([name, count]) => ({ name, count }));
  }, [collections]);

  // Calculate max count for sizing
  const maxTagCount = tagCloud.length > 0 ? tagCloud[0].count : 1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="col-span-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="总计番剧"
          value={stats.total}
          icon="📺"
          gradient="from-primary/20 to-primary/5"
        />
        <StatCard
          label="已看完"
          value={stats.byType[CollectionType.COLLECT]}
          icon="✅"
          gradient="from-anime-green/20 to-anime-green/5"
        />
        <StatCard
          label="在追"
          value={stats.byType[CollectionType.DOING]}
          icon="▶️"
          gradient="from-anime-blue/20 to-anime-blue/5"
        />
        <StatCard
          label="平均评分"
          value={stats.averageRating.toFixed(1)}
          icon="⭐"
          gradient="from-anime-gold/20 to-anime-gold/5"
        />
      </motion.div>

      {/* Collection Type Distribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass glass-border rounded-xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">收藏分布</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(230 20% 12%)',
                  border: '1px solid hsl(230 20% 18%)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {typeData.map(item => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Yearly Distribution - Full width with horizontal scroll */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="col-span-full glass glass-border rounded-xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">年份分布</h3>
        <div className="h-[200px] overflow-x-auto">
          <div style={{ minWidth: Math.max(yearData.length * 50, 400) + 'px', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215 20% 60%)', fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215 20% 60%)', fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(230 20% 12%)',
                    border: '1px solid hsl(230 20% 18%)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(210 40% 98%)' }}
                  formatter={(value: number) => [`${value} 部`, '数量']}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Tag Cloud - Preference Analysis */}
      {tagCloud.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="col-span-full glass glass-border rounded-xl p-6"
        >
          <h3 className="mb-2 text-lg font-semibold">喜好分析</h3>
          <p className="text-sm text-muted-foreground mb-6">基于评分 7 分及以上动画的热门标签</p>
          <div className="flex flex-wrap justify-center items-center gap-3 min-h-[150px]">
            {tagCloud.map((tag, index) => {
              // Calculate size based on count relative to max
              const ratio = tag.count / maxTagCount;
              const sizeClass = ratio > 0.8 ? 'text-3xl' : 
                               ratio > 0.6 ? 'text-2xl' :
                               ratio > 0.4 ? 'text-xl' :
                               ratio > 0.25 ? 'text-lg' :
                               ratio > 0.15 ? 'text-base' : 'text-sm';
              
              // Cycle through colors
              const colors = [
                'text-primary',
                'text-anime-cyan',
                'text-anime-purple',
                'text-anime-gold',
                'text-anime-green',
                'text-anime-blue',
              ];
              const colorClass = colors[index % colors.length];
              const opacity = Math.max(0.5, ratio);
              
              return (
                <motion.span
                  key={tag.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.02 * index }}
                  className={`
                    ${sizeClass} ${colorClass}
                    font-bold cursor-default transition-all duration-300
                    hover:scale-110
                  `}
                  style={{ opacity }}
                  title={`${tag.name}: 出现 ${tag.count} 次`}
                >
                  {tag.name}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  gradient: string;
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
  return (
    <div className={`glass glass-border rounded-xl bg-gradient-to-br ${gradient} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
