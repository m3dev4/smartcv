'use client';
import TemplateSelector from '@/components/templateSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { templates } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import { FileText, Import, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const router = useRouter();

  const handleCreateNewCv = () => {
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSelect = (templateType: ResumeTemplateType) => {
    setSelectedTemplate(templateType);
    setIsLoading(true);

    //Générer un id unique pour le nouveau cv
    const newResumeId = crypto.randomUUID().replace(/-/g, '');

    //Progress bar du chargement
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          //Redirect vers la page d'éditeur avec le template selectionné
          router.push(`/editor/${newResumeId}?template=${templateType}`);

          setIsTemplateModalOpen(false);
          setIsLoading(false);
          setLoadingProgress(0);
          setSelectedTemplate(null);
        });
      }
      setLoadingProgress(progress);
    }, 200);
  };

  return (
    <section className="flex items-center justify-center h-full w-full">
      <div className="container relative overflow-hidden">
        <h1 className="text-3xl font-bold">CV</h1>
        {/* import and export resume card */}
        <div className="flex items-center justify-center gap-7 my-11 py-auto">
          <Card
            className="w-64 h-80 bg-accent border-accent/100 hover:scale-110  transition-transform cursor-pointer group"
            onClick={handleCreateNewCv}
          >
            <CardContent className="flex items-center flex-col justify-center h-full p-6 relative">
              <div className="flex items-center justify-center">
                <Plus
                  className="w-24 h-24 group hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col items-start absolute bottom-0  left-0 px-4">
                <h3 className="text-base font-medium">Créer un nouveau CV</h3>
                <p className="text-sm">Commencez à partir de zéro</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-64 h-80 bg-accent border-accent/100 hover:scale-110  transition-transform cursor-pointer group">
            <CardContent className="flex items-center flex-col justify-center h-full p-6 relative">
              <div className="flex items-center justify-center">
                <Upload
                  className="w-24 h-24 group hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col items-start absolute bottom-0  left-0 px-4">
                <h3 className="text-base font-medium">Importez un CV éxistant</h3>
                <p className="text-sm">CV, PDF, JSON, etc.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-6xl lg:max-w-7xl max-h-[90vh] w-full h-full overflow-auto rounded-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              Choisissez un modèle de CV
            </DialogTitle>
          </DialogHeader>
          {!isLoading ? (
            <div className="grid grid-cols-3 gap-8 place-items-center">
              {templates.map(temp => (
                <div
                  key={temp.id}
                  onClick={() => handleTemplateSelect(temp.id as ResumeTemplateType)}
                  className={`relative group flex cursor-pointer rounded-xl border-2
                    transition-all duration-300 transform hover:scale-105
                    hover:shadow-xl w-full max-w-[300px] ${
                      selectedTemplate === temp.id ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <div className="flex flex-col w-full ">
                    <div className={`  rouded-t-xl relative overflow-hidden`}>
                      <div className=" flex items-center justify-center">
                        {temp.thumbnail ? (
                          <Image
                            src={temp.thumbnail}
                            alt={temp.name || 'Template thumbnail'}
                            width={500} // Adjusted width for better fit in h-48 container
                            height={600} // Adjusted height for better fit
                            className="object-contain" // Ensure image scales within bounds
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No Preview
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-accent rounded-b-xl">
                      <h3 className="font-semibold text-lg text-accent-foreground mb-1">
                        {temp.name}
                      </h3>
                      <p className="text-sm">{temp.description}</p>
                    </div>
                  </div>

                  {selectedTemplate === temp.id && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                      <div className="px-4 py-2 bg-accent rounded-lg">Sélectionné</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center space-y-4">
                <div className="flex itemsc-center justify-center mx-auto w-16 h-16">
                  <FileText className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">Préparez votre template </h3>
                  <p className="text-accent">
                    Nous configurons votre template{' '}
                    {templates.find(t => t.id === selectedTemplate)?.name}...
                  </p>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Progress value={loadingProgress} className="h-2" />
                  <p className="text-sm text-center">{Math.round(loadingProgress)}% terminé</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DashboardPage;
