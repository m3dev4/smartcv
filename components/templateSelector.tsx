import React from 'react';
import { Dialog, DialogClose, DialogHeader, DialogTitle } from './ui/dialog';


interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogClose className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choisissez un modèle de CV</DialogTitle>
        </DialogHeader>
      </DialogClose>
    </Dialog>
  );
};

export default TemplateSelector;
