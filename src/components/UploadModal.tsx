import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, FileUp, Globe } from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { Brand, UploadMode } from '@/types/sop';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: Brand;
  onUpload: (files: File[], mode: UploadMode) => void;
  uploading: boolean;
}

export function UploadModal({ open, onClose, selectedBrand, onUpload, uploading }: UploadModalProps) {
  const [singleFiles, setSingleFiles] = useState<File[]>([]);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [globalFiles, setGlobalFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<UploadMode>('single');

  const handleUpload = () => {
    const filesMap = {
      single: singleFiles,
      bulk: bulkFiles,
      global: globalFiles,
    };
    
    const files = filesMap[activeTab];
    if (files.length > 0) {
      onUpload(files, activeTab);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSingleFiles([]);
      setBulkFiles([]);
      setGlobalFiles([]);
      onClose();
    }
  };

  const filesMap = {
    single: singleFiles,
    bulk: bulkFiles,
    global: globalFiles,
  };

  const setFilesMap = {
    single: setSingleFiles,
    bulk: setBulkFiles,
    global: setGlobalFiles,
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload SOP Documents</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UploadMode)} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Single
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Bulk
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a single PDF file to <span className="font-semibold text-foreground">{selectedBrand}</span>
              </p>
              <FileDropzone
                files={singleFiles}
                onFilesChange={setSingleFiles}
                maxFiles={1}
                disabled={uploading}
              />
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload multiple PDF files to <span className="font-semibold text-foreground">{selectedBrand}</span>
              </p>
              <FileDropzone
                files={bulkFiles}
                onFilesChange={setBulkFiles}
                maxFiles={10}
                disabled={uploading}
              />
            </div>
          </TabsContent>

          <TabsContent value="global" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload PDF files and copy them to <span className="font-semibold text-foreground">all brands</span> (Knitwell, Chico's, Talbots)
              </p>
              <FileDropzone
                files={globalFiles}
                onFilesChange={setGlobalFiles}
                maxFiles={10}
                disabled={uploading}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={filesMap[activeTab].length === 0 || uploading}
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
