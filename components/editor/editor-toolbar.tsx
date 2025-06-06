import React from 'react';
import { Button } from '../ui/button';
import {
  Download,
  Eye,
  Maximize,
  Redo,
  Save,
  Share,
  SidebarClose,
  Undo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface EditorToolbarProps {
  onTogglePropertiesPanel: () => void;
  proprietiesPanelOpen: boolean;
}
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onTogglePropertiesPanel,
  proprietiesPanelOpen,
}) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* left section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="h-6" orientation="vertical" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w[60px] text-center">100%</span>
            <Button variant="ghost" size="sm" disabled>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* center section */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Derniere sauvegarde: il y a 2 min
          </Badge>
        </div>

        {/* right section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button onClick={onTogglePropertiesPanel} variant="ghost" size="sm">
            <SidebarClose
              className={`h-4 w-4 transitiion-transform ${
                proprietiesPanelOpen ? '' : 'rotate-180'
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
