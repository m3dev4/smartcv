'use client';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Button } from './ui/button';
import { Copy, Download, FileEdit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteResume } from '@/app/api/actions';
import { toast, Toaster } from 'sonner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
  progress?: number;
}

const ResumeDrawer = ({
  resume,
  onEdit,
  open,
  setOpen,
}: {
  resume: Resume;
  onEdit: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteResume(id);
      if (result?.success) {
        setOpen(false);
        toast.success('CV supprimé avec succès');
        router.refresh();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.error('Une erreur est survenue lors de la suppression du CV');
      toast.error('Une erreur est survenue lors de la suppression du CV');
    }
  };
  const handleDuplicate = (id: string) => {};
  const handleDownload = (id: string) => {};

  const handleEdit = () => {
    // Rediriger vers la page d'édition avec l'ID du CV
    onEdit(resume.id);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Toaster position="top-center" richColors />
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center gap-2">
            <DrawerTitle className="text-lg">{resume.title}</DrawerTitle>
            <DrawerDescription>Sélectionnez une action pour ce CV</DrawerDescription>
          </DrawerHeader>
          <div className=" grid grid-cols-2 gap-4 p-4">
            <Button
              className="flex flex-col items-center justify-center h-40 gap-2 group hover:scale-110 transition-transform cursor-pointer"
              onClick={handleEdit}
            >
              <FileEdit className="h-8 w-8" />
              <span>Ouvrir</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-40 gap-2 group hover:scale-110 transition-transform"
              onClick={() => handleDownload(resume.id)}
            >
              <Download className="h-8 w-8" />
              <span>Télécharger</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-40 gap-2 group hover:scale-110 transition-transform"
              onClick={() => handleDuplicate(resume.id)}
            >
              <Copy className="h-8 w-8" />
              <span>Dupliquer</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="flex flex-col items-center justify-center h-40 gap-2 group hover:scale-110 transition-transform"
                  variant="destructive"
                >
                  <Trash className="h-8 w-8" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce CV ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible et supprimera définitivement ce CV.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(resume.id)}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResumeDrawer;
