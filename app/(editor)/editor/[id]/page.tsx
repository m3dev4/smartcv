'use client';
import EditorCanva from '@/components/editor/editor-canva';
import { EditorPropertiesPanel } from '@/components/editor/editor-panel';
import EditorSidebar from '@/components/editor/editor-sidebar';
import EditorToolbar from '@/components/editor/editor-toolbar';
import { ResumeProvider } from '@/context/resume-context';
import { Loader2, PanelLeftClose, PanelRightClose, Menu as MenuIcon } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditorPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const templateType = searchParams.get('template') ?? undefined;
  const resumeId = params?.id as string | undefined;
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    //Faire un etat de chargmement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-forground">Chargement de votre CV...</p>
        </div>
      </div>
    );
  }

  return (
    <ResumeProvider resumeId={resumeId} templateType={templateType}>
      <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900">
        {/* Sidebar for Desktop - controlled by sidebarCollapsed */}
        <div className={`hidden lg:flex ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
          <EditorSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedSection={selectedSection}
            onSelectSection={(section) => {
              setSelectedSection(section);
              // Optionally close mobile sidebar if an item is clicked, though it's hidden on desktop
            }}
          />
        </div>

        {/* Sidebar for Mobile - controlled by isMobileSidebarOpen */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setIsMobileSidebarOpen(false)}></div>
        )}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <EditorSidebar
            collapsed={false} // Mobile sidebar is never in 'icon-only' collapsed state
            onToggleCollapse={() => setIsMobileSidebarOpen(false)} // This button (e.g. ChevronLeft) will close the mobile sidebar
            selectedSection={selectedSection}
            onSelectSection={(section) => {
              setSelectedSection(section);
              setIsMobileSidebarOpen(false); // Close mobile sidebar on section selection
            }}
            isMobileView={true} // Pass a prop to indicate mobile view for potential internal adjustments
          />
        </div>
        {/* Main Content */}
        <div className="flex flex-col flex-1 lg:mx-0 xl:mx-auto xl:max-w-screen-xl w-full overflow-hidden"> {/* Adjusted margins and max-width */}
                    <EditorToolbar
            onTogglePropertiesPanel={() => setPropertiesPanelOpen(!propertiesPanelOpen)}
            proprietiesPanelOpen={propertiesPanelOpen}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} // For mobile sidebar toggle
            // We might need another prop for mobile properties panel if its behavior differs significantly
          />
          {/* Canva Area & Properties Panel Container */}
          <div className="flex flex-1 overflow-hidden relative"> {/* Added relative for potential absolute positioning of mobile properties panel */}
            <div className={`flex-1 overflow-auto p-2 sm:p-4 md:p-6 bg-slate-200 dark:bg-slate-950`}>
              <EditorCanva selectedSection={selectedSection} onselectedSection={setSelectedSection} />
            </div>

            {/* Properties Panel - Desktop and Mobile (visibility controlled by propertiesPanelOpen) */}
            {/* On mobile, it might need to be absolutely positioned or have different styling handled internally or via props */}
            <div
              className={`transition-all duration-300 ease-in-out fixed lg:static inset-y-0 right-0 z-30 lg:z-auto 
                          bg-white dark:bg-slate-800 shadow-lg lg:shadow-none 
                          w-full max-w-xs sm:w-80 md:w-96 lg:w-[280px] xl:w-[320px] 
                          transform ${propertiesPanelOpen ? 'translate-x-0' : 'translate-x-full'} 
                          lg:transform-none ${propertiesPanelOpen ? 'lg:flex lg:flex-col' : 'lg:hidden'}` // Manages visibility and slide-in/out for mobile
            }>
              {propertiesPanelOpen && (
                 <EditorPropertiesPanel
                    selectedSection={selectedSection}
                    onClose={() => setPropertiesPanelOpen(false)}
                    isMobileView={typeof window !== 'undefined' && window.innerWidth < 1024} // Basic check, ideally use a context or resize listener
                 />
              )}
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default EditorPage;
