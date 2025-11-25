import { SOPFile } from '@/types/sop';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Pencil, Trash2, FileText } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';

interface SOPTableProps {
  files: SOPFile[];
  onPreview: (file: SOPFile) => void;
  onDownload: (file: SOPFile) => void;
  onUpdate: (file: SOPFile) => void;
  onDelete: (file: SOPFile) => void;
  loading?: boolean;
}

export function SOPTable({ files, onPreview, onDownload, onUpdate, onDelete, loading }: SOPTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No SOPs uploaded yet</p>
        <p className="text-sm">Upload your first SOP document to get started</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-foreground">Document Name</TableHead>
            <TableHead className="font-semibold text-foreground">Category</TableHead>
            <TableHead className="font-semibold text-foreground">Uploaded By</TableHead>
            <TableHead className="font-semibold text-foreground">Size</TableHead>
            <TableHead className="font-semibold text-foreground">Upload Date</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="font-medium">
                <button
                  onClick={() => onPreview(file)}
                  className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="group-hover:underline">{file.name}</span>
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {file.fileCategory || <span className="text-muted-foreground/50">—</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {file.uploadedBy || <span className="text-muted-foreground/50">—</span>}
              </TableCell>
              <TableCell className="text-muted-foreground font-medium">{formatBytes(file.size)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(file.uploadedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(file)}
                    className="h-9 px-3 hover:bg-primary/10 hover:text-primary"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
