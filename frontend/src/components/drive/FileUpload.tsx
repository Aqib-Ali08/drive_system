import { useRef, useState } from "react";
import { Upload, FileIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/services";

interface FileUploadProps {
  parentId: string | null;
  onUploadComplete: () => void;
}

export function FileUpload({ parentId , onUploadComplete}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { toast } = useToast();

  const onChooseFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      setProgress((prev) => ({ ...prev, [file.name]: 0 }));
    });
  };

  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[file.name];
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        await uploadFile(file, parentId, (evt: ProgressEvent) => {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setProgress((prev) => ({ ...prev, [file.name]: percent }));
        });
      }

      toast({
        title: "Upload complete",
        description: `${selectedFiles.length} file(s) uploaded successfully.`,
      });

      setSelectedFiles([]);
      setProgress({});
      onUploadComplete()
    } catch {
      toast({
        title: "Upload failed",
        description: "Something went wrong during upload.",
        variant: "destructive",
      });
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onChooseFiles(e.dataTransfer.files);
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            Upload {selectedFiles.length} file(s)
          </Button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/10"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          Drag & drop files here, or select using the button above
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onChooseFiles(e.target.files)}
      />

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Files to Upload</h4>

          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg bg-muted/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{file.name}</span>
                </div>

                <Trash2
                  className="h-5 w-5 text-red-500 cursor-pointer"
                  onClick={() => removeFile(idx)}
                />
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="w-full h-2 rounded bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${progress[file.name] || 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
