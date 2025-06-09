'use client';
import { Button } from '@/components/ui/button';
import type React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/auth';
import { signOut } from '@/utils/auth';
import { ChevronLeft, FileIcon as FileUser, Menu, Moon, Settings, Sun, User } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
            <div
        className={`h-full bg-black/100 text-white flex flex-col shadow-lg relative transition-all duration-300 ease-in-out ${ // Added relative for potential absolute positioned toggle
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div
          className={`border-b border-slate-700 transition-all duration-300 ease-in-out ${ 
            isSidebarOpen ? 'p-6' : 'py-6 px-4 flex justify-center items-center' 
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-wider">SmartCV</h1>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggle} // Theme toggle
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label={toggleMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {toggleMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Expand sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className={`space-y-1.5 ${isSidebarOpen ? 'px-4' : 'px-2.5'}`}> {/* Adjusted spacing and padding */}
            {navigationItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!isSidebarOpen ? item.label : undefined}
                  aria-label={item.label}
                  className={`flex items-center gap-x-3 h-[42px] rounded-md transition-colors duration-150 group ${
                    isSidebarOpen ? 'px-3' : 'justify-center px-2.5' // Adjusted padding
                  } ${
                    isActive
                      ? `bg-slate-700/70 text-blue-400 border-l-4 border-blue-500 ${isSidebarOpen ? 'pl-2' : 'pl-[calc(0.625rem-4px)]'}` // Adjusted padding for border
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {isSidebarOpen && <span className="font-medium text-sm truncate pt-px">{item.label}</span>} {/* Added pt-px for alignment */}
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
                  title={!isSidebarOpen && user ? `${user.firstName} ${user.lastName}` : undefined}
                  className={`h-auto text-white hover:bg-slate-800/80 transition-all duration-150 ease-in-out rounded-md flex items-center ${
                    isSidebarOpen ? 'w-full justify-start gap-x-3 p-3' : 'w-auto justify-center p-2.5 mx-auto'
                  }`}
                >
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex flex-col items-start truncate">
                      <span className="font-medium text-sm text-slate-200 truncate">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                  )}
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
          {isSidebarOpen && (
            <div className="px-4 pb-4 mt-2 transition-opacity duration-300 ease-in-out">
              <div className="text-xs text-slate-500 space-y-1">
                <p>Sous licence MIT</p>
                <p>Par la communauté, pour la communauté.</p>
                <p>
                  Un projet passioné de{' '}
                  <Link href="https://github.com/m3dev4" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 underline">
                    @Mouhamed Lo
                  </Link>
                </p>
                <p className="font-medium">SmartCV v1.0.0</p>
              </div>
            </div>
          )}
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
