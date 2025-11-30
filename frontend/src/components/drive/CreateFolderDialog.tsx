import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createFolder } from "@/services";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
  sync: () => void;
}

export function CreateFolderDialog({ open, onOpenChange, parentId, sync }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const { toast } = useToast();
  const handleCreate = async () => {
    if (folderName.trim()) {
      try {
        const res = await createFolder(folderName, parentId);

        if (res) {
          toast({
            title: "Folder created",
            description: `Folder "${folderName}" has been created.`,
          });
          setFolderName("");
          onOpenChange(false);
          sync()
        }
      } catch (error) {
        console.error("Error creating folder:", error);
        toast({
          title: "Error",
          description: "Failed to create folder. Please try again.",
          variant: "destructive", // if your toast supports variants
        });
      }
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Untitled folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
