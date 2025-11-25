import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileDropzone } from './FileDropzone';
import { SOPFile } from '@/types/sop';

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
  file: SOPFile | null;
  onUpdate: (file: File) => void;
  updating: boolean;
}

export function UpdateModal({ open, onClose, file, onUpdate, updating }: UpdateModalProps) {
  const [newFile, setNewFile] = useState<File[]>([]);

  const handleUpdate = () => {
    if (newFile.length > 0) {
      onUpdate(newFile[0]);
    }
  };

  const handleClose = () => {
    if (!updating) {
      setNewFile([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update SOP Document</DialogTitle>
          <DialogDescription>
            Replace <span className="font-semibold text-foreground">{file?.fileName}</span> with a new PDF file
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <FileDropzone
            files={newFile}
            onFilesChange={setNewFile}
            maxFiles={1}
            disabled={updating}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={updating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={newFile.length === 0 || updating}>
            {updating ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
