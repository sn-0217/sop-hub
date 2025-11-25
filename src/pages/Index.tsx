import { useState, useEffect } from 'react';
import { Brand, SOPFile, UploadMode } from '@/types/sop';
import { BrandSidebar } from '@/components/BrandSidebar';
import { SOPTable } from '@/components/SOPTable';
import { StatisticsBar } from '@/components/StatisticsBar';
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

  const handleUpload = async (uploadFiles: File[], mode: UploadMode, metadata: { fileCategory: string; uploadedBy: string }) => {
    setUploading(true);
    try {
      if (mode === 'single') {
        await sopApi.uploadSOP(uploadFiles[0], selectedBrand, metadata);
        toast.success('SOP uploaded successfully');
      } else if (mode === 'bulk') {
        await sopApi.uploadBulk(uploadFiles, selectedBrand, metadata);
        toast.success(`${uploadFiles.length} SOPs uploaded successfully`);
      } else if (mode === 'global') {
        await sopApi.uploadGlobal(uploadFiles, metadata);
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
      {/* Brand Selector */}
      <BrandSidebar selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-start justify-between gap-8 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                      SOP Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      <span className="capitalize font-medium text-foreground">{selectedBrand}</span> • Standard Operating Procedures
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setUploadModalOpen(true)} 
                size="lg" 
                className="gap-2 shrink-0 h-11 px-6 shadow-sm"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-background border-border shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-background">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Statistics Bar */}
            <StatisticsBar files={files} />
            
            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
              </div>
            ) : files.filter(file => 
                file.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No documents found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Upload your first SOP document to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                )}
              </div>
            ) : (
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
            )}
          </div>
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
