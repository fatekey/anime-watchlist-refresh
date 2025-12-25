import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CollectionType, CollectionTypeLabels } from '@/types/bangumi';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: CollectionType | null;
  onFilterTypeChange: (type: CollectionType | null) => void;
  sortBy: 'date' | 'rating' | 'name';
  onSortChange: (sort: 'date' | 'rating' | 'name') => void;
  totalCount: number;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  sortBy,
  onSortChange,
  totalCount,
}: FilterBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filterOptions = [
    { value: null, label: '全部' },
    { value: CollectionType.DOING, label: CollectionTypeLabels[CollectionType.DOING] },
    { value: CollectionType.COLLECT, label: CollectionTypeLabels[CollectionType.COLLECT] },
    { value: CollectionType.WISH, label: CollectionTypeLabels[CollectionType.WISH] },
    { value: CollectionType.ON_HOLD, label: CollectionTypeLabels[CollectionType.ON_HOLD] },
    { value: CollectionType.DROPPED, label: CollectionTypeLabels[CollectionType.DROPPED] },
  ];

  const sortOptions = [
    { value: 'date' as const, label: '更新时间' },
    { value: 'rating' as const, label: '我的评分' },
    { value: 'name' as const, label: '名称' },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Search */}
      <div
        className={cn(
          'relative flex-1 transition-all duration-300',
          isSearchFocused ? 'flex-[2]' : 'min-w-[200px] max-w-[300px]'
        )}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索番剧..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <button
            key={option.value ?? 'all'}
            onClick={() => onFilterTypeChange(option.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              filterType === option.value
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            排序
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>排序方式</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(sortBy === option.value && 'bg-muted')}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Count */}
      <span className="text-sm text-muted-foreground">
        共 <span className="font-medium text-foreground">{totalCount}</span> 部
      </span>
    </div>
  );
}
