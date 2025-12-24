import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface UserIdInputProps {
  onSubmit: (userId: string) => void;
  isLoading?: boolean;
}

export function UserIdInput({ onSubmit, isLoading }: UserIdInputProps) {
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onSubmit(userId.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="输入 Bangumi 用户 ID 或用户名..."
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="h-12 bg-card/50 pl-12 text-base backdrop-blur-sm transition-all focus:bg-card focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!userId.trim() || isLoading}
          className="h-12 px-6 shadow-glow transition-all hover:shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            '获取数据'
          )}
        </Button>
      </form>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        在 <a href="https://bgm.tv" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bgm.tv</a> 找到你的用户 ID
      </p>
    </motion.div>
  );
}
