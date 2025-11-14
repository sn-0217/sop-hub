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
  onDownload: (file: SOPFile) => void;
  onUpdate: (file: SOPFile) => void;
  onDelete: (file: SOPFile) => void;
  loading?: boolean;
}

export function SOPTable({ files, onDownload, onUpdate, onDelete, loading }: SOPTableProps) {
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
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">File Name</TableHead>
            <TableHead className="font-semibold">Size</TableHead>
            <TableHead className="font-semibold">Uploaded Date</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-destructive" />
                  {file.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatBytes(file.size)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(file.uploadedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(file)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdate(file)}
                    className="hover:bg-warning/10 hover:text-warning"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file)}
                    className="hover:bg-destructive/10 hover:text-destructive"
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
