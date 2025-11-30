import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { downloadFile } from "@/services";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
}

export function FilePreviewDialog({ open, onOpenChange, itemId }: FilePreviewDialogProps) {
  const [file, setFile] = useState({
    name: "",
    mimeType: "",
    dataUrl: ""
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open || !itemId) return;

    const fetchFile = async () => {
      try {
        setLoading(true); // Start loading
        const { fileName, downloadUrl, mimeType } = await downloadFile(itemId);
        setFile({
          name: fileName,
          mimeType: mimeType,
          dataUrl: downloadUrl,
        });
      } catch (err) {
        console.error("Error fetching file for preview:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFile();

    return () => {
      if (file.dataUrl) URL.revokeObjectURL(file.dataUrl);
      setFile({ name: "", mimeType: "", dataUrl: "" });
    };
  }, [open, itemId]);

  const getFilePreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-16">
          <p className="text-muted-foreground text-lg">Loading file preview...</p>
        </div>
      );
    }
    const mimeType = file.mimeType.toLowerCase();

    // Images
    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center max-h-[70vh]">
          <img
            src={file.dataUrl}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      );
    }

    // PDFs
    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={file.dataUrl}
          className="w-full h-[70vh] rounded-lg"
          title={file.name}
        />
      );
    }

    // Videos
    if (mimeType.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center">
          <video
            src={file.dataUrl}
            controls
            className="max-w-full max-h-[70vh] rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio
    if (mimeType.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4">🎵</div>
          <audio src={file.dataUrl} controls className="w-full max-w-md" />
        </div>
      );
    }

    // Text files
    if (mimeType.startsWith('text/') ||
      mimeType === 'application/json' ||
      mimeType === 'application/xml') {
      return (
        <div className="max-h-[70vh] overflow-auto">
          <iframe
            src={file.dataUrl}
            className="w-full h-[70vh] rounded-lg border"
            title={file.name}
          />
        </div>
      );
    }

    // Documents (basic support)
    if (mimeType.includes('document') ||
      mimeType.includes('word') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation')) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">{file.name}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Document preview is not available in the browser.
          </p>
          <Button asChild>
            <a href={file.dataUrl} download={file.name}>
              Download File
            </a>
          </Button>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">📎</div>
        <p className="text-lg font-medium mb-2">{file.name}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Preview not available for this file type.
        </p>
        <Button asChild>
          <a href={file.dataUrl} download={file.name}>
            Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-8">{file.name}</span>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {getFilePreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
