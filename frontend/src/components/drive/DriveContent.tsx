import { useEffect, useState } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { DriveGrid } from "./DriveGrid";
import { DriveList } from "./DriveList";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload, Folder } from "lucide-react";
import { getFolders } from "@/services";
import { FileUploadDialog } from "./FileUploadDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function DriveContent() {
  const { currentFolderId } = useSelector((state: RootState) => state.drive);
  const { viewMode } = useSelector((state: any) => state.drive);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await getFolders(currentFolderId);
      setItems(res.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [currentFolderId]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Breadcrumbs />

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <Button onClick={() => setCreateFolderOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>

              <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Folder className="h-24 w-24 text-muted-foreground/20 mb-6" />
            <h3 className="text-xl font-semibold mb-2">This folder is empty</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating a folder or uploading files
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button onClick={() => setCreateFolderOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <DriveGrid items={items} sync={fetchItems} />
            ) : (
              <DriveList items={items} sync={fetchItems} />
            )}
          </>
        )}
      </div>

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        parentId={currentFolderId}
        sync={fetchItems}
      />
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        parentId={currentFolderId}
        sync={fetchItems}
      />
    </main>
  );
}
