import { useState, useEffect } from 'react';
import { Brand, SOPFile, UploadMode } from '@/types/sop';
import { BrandSidebar } from '@/components/BrandSidebar';
import { SOPTable } from '@/components/SOPTable';
import { UploadModal } from '@/components/UploadModal';
import { UpdateModal } from '@/components/UpdateModal';
import { DeleteDialog } from '@/components/DeleteDialog';
import { PDFPreviewModal } from '@/components/PDFPreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { sopApi } from '@/services/sopApi';
import { Upload, FileText, Search } from 'lucide-react';

const Index = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>('knitwell');
  const [files, setFiles] = useState<SOPFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SOPFile | null>(null);

  // Load files for selected brand
  useEffect(() => {
    loadFiles();
  }, [selectedBrand]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await sopApi.getSOPs(selectedBrand);
      setFiles(data);
    } catch (error) {
      toast.error('Failed to load SOPs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (uploadFiles: File[], mode: UploadMode) => {
    setUploading(true);
    try {
      if (mode === 'single') {
        await sopApi.uploadSOP(uploadFiles[0], selectedBrand);
        toast.success('SOP uploaded successfully');
      } else if (mode === 'bulk') {
        await sopApi.uploadBulk(uploadFiles, selectedBrand);
        toast.success(`${uploadFiles.length} SOPs uploaded successfully`);
      } else if (mode === 'global') {
        await sopApi.uploadGlobal(uploadFiles);
        toast.success(`SOPs uploaded to all brands successfully`);
      }
      setUploadModalOpen(false);
      loadFiles();
    } catch (error) {
      toast.error('Failed to upload SOPs');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = (file: SOPFile) => {
    setSelectedFile(file);
    setPreviewModalOpen(true);
  };

  const handleDownload = (file: SOPFile) => {
    // Simulate download
    toast.success(`Downloading ${file.name}`);
    // In real implementation: window.open(file.url, '_blank');
  };

  const handleUpdate = async (file: File) => {
    if (!selectedFile) return;
    
    setUpdating(true);
    try {
      await sopApi.updateSOP(selectedFile.id, file);
      toast.success('SOP updated successfully');
      setUpdateModalOpen(false);
      setSelectedFile(null);
      loadFiles();
    } catch (error) {
      toast.error('Failed to update SOP');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;

    setDeleting(true);
    try {
      await sopApi.deleteSOP(selectedFile.id);
      toast.success('SOP deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedFile(null);
      loadFiles();
    } catch (error) {
      toast.error('Failed to delete SOP');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BrandSidebar selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                SOP Management Portal
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage Standard Operating Procedures for{' '}
                <span className="font-semibold text-foreground capitalize">{selectedBrand}</span>
              </p>
            </div>
            <Button onClick={() => setUploadModalOpen(true)} size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Upload SOP
            </Button>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          <SOPTable
            files={files.filter(file => 
              file.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onUpdate={(file) => {
              setSelectedFile(file);
              setUpdateModalOpen(true);
            }}
            onDelete={(file) => {
              setSelectedFile(file);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      </main>

      {/* Modals */}
      <PDFPreviewModal
        open={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
        onDownload={() => selectedFile && handleDownload(selectedFile)}
      />

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        selectedBrand={selectedBrand}
        onUpload={handleUpload}
        uploading={uploading}
      />

      <UpdateModal
        open={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
        onUpdate={handleUpdate}
        updating={updating}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default Index;
