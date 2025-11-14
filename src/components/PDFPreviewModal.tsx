import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, Loader2 } from 'lucide-react';
import { SOPFile } from '@/types/sop';

interface PDFPreviewModalProps {
  open: boolean;
  onClose: () => void;
  file: SOPFile | null;
  onDownload: () => void;
}

export function PDFPreviewModal({ open, onClose, file, onDownload }: PDFPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const handleClose = () => {
    setCurrentPage(1);
    setZoom(100);
    setLoading(true);
    onClose();
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  // For demo purposes, use a sample PDF URL
  // In production, use file.url
  const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

  // Create iframe URL with zoom parameter
  const iframeUrl = `${pdfUrl}#page=${currentPage}&zoom=${zoom}`;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{file?.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {zoom}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="default" size="sm" onClick={onDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-muted/20 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title={file?.name || 'PDF Preview'}
            onLoad={handleIframeLoad}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
