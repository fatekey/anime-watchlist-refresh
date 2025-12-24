import { BangumiStats, CollectionType, CollectionTypeLabels, CollectionTypeColors } from '@/types/bangumi';
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

interface StatsChartsProps {
  stats: BangumiStats;
}

export function StatsCharts({ stats }: StatsChartsProps) {
  // Prepare data for collection type pie chart
  const typeData = Object.entries(stats.byType)
    .map(([type, count]) => ({
      name: CollectionTypeLabels[Number(type) as CollectionType],
      value: count,
      color: CollectionTypeColors[Number(type) as CollectionType],
    }))
    .filter(d => d.value > 0);

  // Prepare data for yearly bar chart
  const yearData = Object.entries(stats.byYear)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-10) // Last 10 years
    .map(([year, count]) => ({
      year,
      count,
    }));

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

      {/* Yearly Distribution */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass glass-border rounded-xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">年份分布</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearData}>
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 60%)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 60%)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(230 20% 12%)',
                  border: '1px solid hsl(230 20% 18%)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
              />
              <Bar
                dataKey="count"
                fill="hsl(340 70% 55%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
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
