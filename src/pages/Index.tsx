import { useState, useEffect } from 'react';
import { Tv2, BarChart3, RefreshCw, Github, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBangumi, useTheme, useCollectionFilter } from '@/hooks/useBangumi';
import { UserIdInput } from '@/components/UserIdInput';
import { AnimeGrid } from '@/components/AnimeGrid';
import { StatsCharts } from '@/components/StatsCharts';
import { FilterBar } from '@/components/FilterBar';
import { ThemeSelector } from '@/components/ThemeSelector';
import { AnimeDetailModal } from '@/components/AnimeDetailModal';
import { UserCollection } from '@/types/bangumi';
import defaultAvatar from '@/assets/default-avatar.png';

const DEFAULT_USER_ID = '605976';

const Index = () => {
  const [userId, setUserId] = useState<string | null>(DEFAULT_USER_ID);
  const [selectedCollection, setSelectedCollection] = useState<UserCollection | null>(null);

  const { collections, stats, userInfo, isLoading, error, refetch } = useBangumi(userId);
  const { currentTheme, themes, applyTheme } = useTheme();
  const {
    filteredCollections,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useCollectionFilter(collections);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Glow Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-glow">
              <Tv2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Bangumi <span className="text-gradient">Tracker</span>
              </h1>
              <p className="text-xs text-muted-foreground">追踪你的番剧世界</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <ThemeSelector
              currentTheme={currentTheme}
              themes={themes}
              onThemeChange={applyTheme}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative z-10 py-8">
        <AnimatePresence mode="wait">
          {!userId ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12 text-center"
              >
                <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  展示你的 <span className="text-gradient">追番记录</span>
                </h2>
                <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                  输入你的 Bangumi 用户 ID，即刻生成精美的番剧统计图表和收藏展示
                </p>
              </motion.div>

              <UserIdInput onSubmit={setUserId} isLoading={isLoading} />

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 grid gap-6 sm:grid-cols-3"
              >
                {[
                  { icon: '📊', title: '数据可视化', desc: '精美的统计图表' },
                  { icon: '🎨', title: '多主题支持', desc: '自定义你的风格' },
                  { icon: '🔍', title: '智能筛选', desc: '快速找到你的番' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="glass glass-border rounded-xl p-6 text-center transition-transform hover:scale-105"
                  >
                    <span className="mb-3 block text-4xl">{feature.icon}</span>
                    <h3 className="mb-1 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* User Info Bar */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={defaultAvatar} 
                    alt="用户头像" 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{userInfo?.nickname || userInfo?.username || userId}</p>
                    <p className="text-sm text-muted-foreground">
                      {collections.length} 部番剧
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserId(null)}
                >
                  切换用户
                </Button>
              </div>

              {/* Error State */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    获取数据失败，请检查用户 ID 是否正确
                  </AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-5xl animate-pulse-slow">📺</div>
                    <p className="text-muted-foreground">正在加载番剧数据...</p>
                  </div>
                </div>
              )}

              {/* Content Tabs */}
              {!isLoading && !error && (
                <Tabs defaultValue="collection" className="space-y-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50">
                    <TabsTrigger value="collection" className="gap-2">
                      <Tv2 className="h-4 w-4" />
                      收藏列表
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      数据统计
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="collection" className="space-y-6">
                    <FilterBar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      filterType={filterType}
                      onFilterTypeChange={setFilterType}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      totalCount={filteredCollections.length}
                    />
                    <AnimeGrid
                      collections={filteredCollections}
                      onCardClick={setSelectedCollection}
                    />
                  </TabsContent>

                  <TabsContent value="stats">
                    {stats && <StatsCharts stats={stats} />}
                  </TabsContent>
                </Tabs>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimeDetailModal
        collection={selectedCollection}
        open={!!selectedCollection}
        onClose={() => setSelectedCollection(null)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/50 py-6 backdrop-blur-xl">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href="https://bgm.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Bangumi API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
