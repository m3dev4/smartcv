'use client';
import EditorCanva from '@/components/editor/editor-canva';
import { EditorPropertiesPanel } from '@/components/editor/editor-panel';
import EditorSidebar from '@/components/editor/editor-sidebar';
import EditorToolbar from '@/components/editor/editor-toolbar';
import { ResumeProvider } from '@/context/resume-context';
import { Loader2 } from 'lucide-react';
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
      <div className="flex h-screen w-full">
        {/* sidebar */}
        <EditorSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />
        {/* Main Content */}
        <div className="flex flex-col flex-1 mx-80">
          <EditorToolbar
            onTogglePropertiesPanel={() => setPropertiesPanelOpen(!propertiesPanelOpen)}
            proprietiesPanelOpen={propertiesPanelOpen}
          />
          {/* Canva Area */}
          <div className="flex flex-1 overflow-hidden">
            <EditorCanva selectedSection={selectedSection} onselectedSection={setSelectedSection} />

            {propertiesPanelOpen && (
              <EditorPropertiesPanel
                selectedSection={selectedSection}
                onClose={() => setPropertiesPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default EditorPage;
