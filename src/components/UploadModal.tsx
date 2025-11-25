import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDropzone } from './FileDropzone';
import { Brand } from '@/types/sop';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: Brand;
  onUpload: (file: File, metadata: { fileCategory: string; uploadedBy: string }) => void;
  uploading: boolean;
}

export function UploadModal({ open, onClose, selectedBrand, onUpload, uploading }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileCategory, setFileCategory] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files[0], { fileCategory, uploadedBy });
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setFileCategory('');
      setUploadedBy('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload SOP Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Upload a PDF file to <span className="font-semibold text-foreground">{selectedBrand}</span>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fileCategory">File Category</Label>
              <Input
                id="fileCategory"
                placeholder="e.g., React, Node.js"
                value={fileCategory}
                onChange={(e) => setFileCategory(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadedBy">Uploaded By</Label>
              <Input
                id="uploadedBy"
                placeholder="Your name"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>
          
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            disabled={uploading}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
