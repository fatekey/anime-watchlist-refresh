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
import { TagCloud } from 'react-tagcloud';

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

  // Calculate rating distribution
  const ratingData = useMemo(() => {
    const ratingCounts: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      ratingCounts[i] = 0;
    }
    collections.forEach(c => {
      if (c.rate && c.rate >= 1 && c.rate <= 10) {
        ratingCounts[c.rate]++;
      }
    });
    return Object.entries(ratingCounts)
      .map(([rating, count]) => ({
        rating: `${rating}分`,
        count,
        fill: Number(rating) >= 8 ? 'hsl(142 70% 55%)' : 
              Number(rating) >= 6 ? 'hsl(45 93% 58%)' : 
              'hsl(0 75% 55%)',
      }));
  }, [collections]);

  // Calculate tag preferences from high-rated anime (7+)
  // Take top 6 tags from each anime, then aggregate
  const tagCloudData = useMemo(() => {
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
      .slice(0, 50)
      .map(([value, count]) => ({ value, count }));
  }, [collections]);

  const tagColors = [
    'hsl(262 83% 70%)',  // primary purple
    'hsl(187 80% 60%)',  // cyan
    'hsl(280 70% 65%)',  // purple
    'hsl(45 93% 58%)',   // gold
    'hsl(142 70% 55%)',  // green
    'hsl(217 91% 65%)',  // blue
  ];

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
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
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
                  color: 'hsl(210 40% 98%)',
                }}
                itemStyle={{ color: 'hsl(210 40% 98%)' }}
                formatter={(value: number, name: string) => [`${value} 部`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {typeData.map(item => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass glass-border rounded-xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">评分分布</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="rating"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 60%)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 60%)', fontSize: 11 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(230 20% 12%)',
                  border: '1px solid hsl(230 20% 18%)',
                  borderRadius: '8px',
                  color: 'hsl(210 40% 98%)',
                }}
                itemStyle={{ color: 'hsl(210 40% 98%)' }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
                formatter={(value: number) => [`${value} 部`, '数量']}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex justify-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-anime-green" />
            <span className="text-muted-foreground">8-10分</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-anime-gold" />
            <span className="text-muted-foreground">6-7分</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-anime-red" />
            <span className="text-muted-foreground">1-5分</span>
          </div>
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
        <div className="h-[200px] overflow-x-auto" style={{ direction: 'rtl' }}>
          <div style={{ direction: 'ltr', minWidth: Math.max(yearData.length * 50, 400) + 'px', height: '100%' }}>
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
      {tagCloudData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="col-span-full glass glass-border rounded-xl p-6 overflow-hidden"
        >
          <h3 className="mb-2 text-lg font-semibold">喜好分析</h3>
          <p className="text-sm text-muted-foreground mb-4">基于评分 7 分及以上动画的热门标签</p>
          <div className="h-[180px]">
            <TagCloud
              minSize={12}
              maxSize={28}
              tags={tagCloudData}
              colorOptions={{
                luminosity: 'light',
                hue: 'purple',
              }}
              renderer={(tag, size, color) => (
                <span
                  key={tag.value}
                  style={{
                    fontSize: size,
                    color: tagColors[Math.floor(Math.random() * tagColors.length)],
                    margin: '3px',
                    padding: '2px 4px',
                    display: 'inline-block',
                    cursor: 'default',
                  }}
                  title={`${tag.value}: 出现 ${tag.count} 次`}
                >
                  {tag.value}
                </span>
              )}
            />
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
