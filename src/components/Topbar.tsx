// src/components/Topbar.tsx

import React from 'react';
import { Menu, User, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {LanguageCurrencySelector} from './LanguageCurrencySelector';

const Topbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-4 py-3 border-b flex items-center justify-between bg-background text-foreground">
      {/* Left: App name or logo */}
      <div className="text-lg font-bold"></div>

      {/* Right: Desktop actions */}
      <div className="hidden md:flex items-center gap-4">
        <LanguageCurrencySelector />
        <ThemeToggle />
        <Button variant="ghost" onClick={() => navigate('/profile')}>
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile dropdown menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ThemeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
