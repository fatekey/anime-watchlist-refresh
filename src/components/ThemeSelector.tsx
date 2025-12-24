import { Theme } from '@/types/bangumi';
import { Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  currentTheme: Theme;
  themes: Theme[];
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ currentTheme, themes, onThemeChange }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <div
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
            style={{ backgroundColor: `hsl(${currentTheme.colors.primary})` }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>选择主题</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(theme => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onThemeChange(theme)}
            className={cn('gap-3', currentTheme.id === theme.id && 'bg-muted')}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
              />
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
              />
            </div>
            <span>{theme.name}</span>
            {currentTheme.id === theme.id && (
              <Check className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
