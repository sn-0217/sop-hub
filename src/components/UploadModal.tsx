import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileUp, Globe } from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { Brand, UploadMode } from '@/types/sop';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedBrand: Brand;
  onUpload: (files: File[], mode: UploadMode, metadata: { fileCategory: string; uploadedBy: string }) => void;
  uploading: boolean;
}

export function UploadModal({ open, onClose, selectedBrand, onUpload, uploading }: UploadModalProps) {
  const [singleFiles, setSingleFiles] = useState<File[]>([]);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [globalFiles, setGlobalFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<UploadMode>('single');
  const [fileCategory, setFileCategory] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');

  const handleUpload = () => {
    const filesMap = {
      single: singleFiles,
      bulk: bulkFiles,
      global: globalFiles,
    };
    
    const files = filesMap[activeTab];
    if (files.length > 0) {
      onUpload(files, activeTab, { fileCategory, uploadedBy });
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSingleFiles([]);
      setBulkFiles([]);
      setGlobalFiles([]);
      setFileCategory('');
      setUploadedBy('');
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileCategory-bulk">File Category</Label>
                  <Input
                    id="fileCategory-bulk"
                    placeholder="e.g., React, Node.js"
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadedBy-bulk">Uploaded By</Label>
                  <Input
                    id="uploadedBy-bulk"
                    placeholder="Your name"
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileCategory-global">File Category</Label>
                  <Input
                    id="fileCategory-global"
                    placeholder="e.g., React, Node.js"
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadedBy-global">Uploaded By</Label>
                  <Input
                    id="uploadedBy-global"
                    placeholder="Your name"
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>
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
