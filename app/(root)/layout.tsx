'use client';
import { Button } from '@/components/ui/button';
import type React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/auth';
import { signOut } from '@/utils/auth';
import { FileIcon as FileUser, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [toggleMode, setToggleMode] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  useEffect(() => {
    if (toggleMode) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [toggleMode]);

  const handleToggle = () => {
    setToggleMode(!toggleMode);
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  const navigationItems = [
    {
      href: '/dashboard/resumes',
      icon: FileUser,
      label: 'CVs',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Paramètres',
    },
  ];

  return (
    <div className="h-screen w-full flex bg-background">
      {/* Sidebar */}
      <div className="w-64 h-full bg-black/100 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wider">SmartCV</h1>
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {toggleMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            {navigationItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700">
          {/* User Section */}
          <div className="p-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3 text-white hover:bg-slate-800"
                >
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-slate-800 border-slate-700" side="top">
                <div className="space-y-2">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </Link>
                  <div className="border-t border-slate-700 my-2" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    Déconnexion
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* License Info */}
          <div className="px-4 pb-4">
            <div className="text-xs text-slate-500 space-y-1">
              <p>Sous licence MIT</p>
              <p>Par la communauté, pour la communauté.</p>
              <p>
                Un projet passioné de <Link href="https://github.com/m3dev4">@Mouhamed Lo</Link>
              </p>
              <p className="font-medium">SmartCV v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;
