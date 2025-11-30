import { useState, useEffect } from "react";
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
import { renameFile, renameFolder } from "@/services";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  currentName: string;
  itemType: string;
  sync: () => void;
}

export function RenameDialog({ open, onOpenChange, itemId, currentName, itemType, sync }: RenameDialogProps) {
  const [newName, setNewName] = useState(currentName);
  const { toast } = useToast();

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleRename = async () => {
    if (!newName.trim() || newName === currentName) return;
    let res;
    try {
      if (itemType === "folder") {
        res = await renameFolder(itemId, newName);
      } else {
        res = await renameFile(itemId, newName);
      }
      if (res) {
        toast({
          title: "Renamed",
          description: "Item has been renamed successfully.",
        });

        onOpenChange(false);
        sync();
      }
    } catch (error) {
      console.error("Rename failed:", error);
      toast({
        variant: "destructive",
        title: "Rename Failed",
        description: "Unable to rename item. Please try again.",
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>
            Enter a new name for this item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
