import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDropzone } from './FileDropzone';
import { Brand, BrandFilter } from '@/types/sop';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: BrandFilter;
  onUpload: (files: File[], brand: Brand, metadata: { fileCategory: string; uploadedBy: string }) => void;
  uploading: boolean;
}

const brands: { value: Brand; label: string }[] = [
  { value: 'knitwell', label: 'Knitwell' },
  { value: 'chicos', label: "Chico's" },
  { value: 'talbots', label: 'Talbots' },
];

export function UploadModal({ open, onClose, selectedBrand, onUpload, uploading }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileCategory, setFileCategory] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [brand, setBrand] = useState<Brand>('knitwell');

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setFileCategory('');
      setUploadedBy('');
    } else {
      // Initialize brand based on selectedBrand prop
      if (selectedBrand !== 'home') {
        setBrand(selectedBrand);
      } else {
        // Default to knitwell if on home page
        setBrand('knitwell');
      }
    }
  }, [open, selectedBrand]);

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files, brand, { fileCategory, uploadedBy });
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
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add new SOP documents
          </p>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                <div className="flex flex-wrap gap-3">
                  {brands.map((b) => (
                    <Button
                      key={b.value}
                      type="button"
                      variant={brand === b.value ? 'default' : 'outline'}
                      onClick={() => setBrand(b.value)}
                      disabled={uploading || selectedBrand !== 'home'}
                      className={cn(
                        "flex-1 min-w-[100px]",
                        brand === b.value && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {b.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fileCategory" className="text-sm font-medium">Category</Label>
                <Input
                  id="fileCategory"
                  placeholder="e.g., Development, HR, Finance"
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value)}
                  disabled={uploading}
                  className="h-10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="uploadedBy" className="text-sm font-medium">Uploaded By</Label>
                <Input
                  id="uploadedBy"
                  placeholder="Enter your name"
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                  disabled={uploading}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          <div className="h-full flex flex-col">
            <Label className="text-sm font-medium mb-2">Documents</Label>
            <div className="flex-1">
              <FileDropzone
                files={files}
                onFilesChange={setFiles}
                maxFiles={10}
                disabled={uploading}
                className="h-full min-h-[150px]"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={uploading} className="h-10 px-4">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || !fileCategory || !uploadedBy || !brand || uploading}
            className="h-10 px-6 min-w-[100px]"
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
