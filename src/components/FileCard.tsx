import { SOPFile } from '@/types/sop';
import { Button } from '@/components/ui/button';
import { Download, Pencil, Trash2, FileText } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface FileCardProps {
  file: SOPFile;
  onPreview: (file: SOPFile) => void;
  onDownload: (file: SOPFile) => void;
  onUpdate: (file: SOPFile) => void;
  onDelete: (file: SOPFile) => void;
}

export function FileCard({ file, onPreview, onDownload, onUpdate, onDelete }: FileCardProps) {
  return (
    <div className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Preview Area */}
      <button
        onClick={() => onPreview(file)}
        className="w-full bg-muted/50 h-48 flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8 text-destructive" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            PDF Document
          </span>
        </div>
      </button>

      {/* Content Area */}
      <div className="p-5">
        <button
          onClick={() => onPreview(file)}
          className="w-full text-left mb-3 group/title"
        >
          <h3 className="font-semibold text-foreground group-hover/title:text-primary transition-colors line-clamp-2 mb-1">
            {file.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span>
              {new Date(file.uploadedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </button>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(file)}
            className="flex-1 h-9 hover:bg-primary/10 hover:text-primary"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate(file)}
            className="h-9 w-9 p-0 hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(file)}
            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
