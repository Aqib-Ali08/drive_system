import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "./FileUpload";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
  sync: () => void;
}

export function FileUploadDialog({ open, onOpenChange, parentId, sync }: FileUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <FileUpload parentId={parentId} onUploadComplete={() => 
          {onOpenChange(false);
          sync()}} />
      </DialogContent>
    </Dialog>
  );
}