import { Folder, FileText, Trash2, Edit, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
// import { RenameDialog } from "./RenameDialog";
import { deleteFile, deleteFolder, downloadFile } from "@/services";
import { useDispatch } from "react-redux";
import { setCurrentFolder } from "@/store/driveSlice";
import { RenameDialog } from "./RenameDialog";
import { FilePreviewDialog } from "./FilePreviewDialog";

export function DriveGrid({ items, sync }) {
  const dispatch = useDispatch()
  const [renameItem, setRenameItem] = useState({
    open: false,
    itemId: null,
    currentName: "",
    itemType: ""
  });
  const [previewFile, setPreviewFile] = useState({
    open: false,
    itemId: null,
  });
  const [loading, setLoading] = useState(false);
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Folder className="mx-auto h-16 w-16 mb-4 opacity-20" />
        <p>This folder is empty</p>
      </div>
    );
  }
  const handleDeleteItem = async (item_id, item_type) => {
    try {
      setLoading(true); // start loader
      let res;
      if (item_type === "folder") {
        res = await deleteFolder(item_id);
      } else {
        res = await deleteFile(item_id);
      }
      if (res) {
        sync()
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false); // stop loader
    }
  };
  const handleDownload = async (fileId) => {
    try {
      const { fileName, downloadUrl } = await downloadFile(fileId);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  const openRenameDialog = (item) => {
    setRenameItem({ open: true, itemId: item._id, currentName: item.name || item.fileName, itemType: item.type });
  };
  const openPreviewDialog = (item) => {
    setPreviewFile({ open: true, itemId: item._id });
  }
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
            onClick={() => {
              if (item.type === "folder") {
                dispatch(setCurrentFolder({ folderId: item._id, folderName: item.name }));
              }
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {item.type === "file" &&
                  <DropdownMenuItem onClick={() => openPreviewDialog(item)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                }
                {item.type === "file" &&
                  <DropdownMenuItem onClick={() => handleDownload(item._id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>}
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  openRenameDialog(item)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteItem(item._id, item.type)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {loading ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col items-center gap-2">
              {item.type === "folder" ? (
                <Folder className="h-12 w-12 text-primary" />
              ) : (
                <FileText className="h-12 w-12 text-muted-foreground" />
              )}
              <div className="text-center w-full">
                <p className="text-sm font-medium truncate">{item.name || item.filename}</p>
                {item.type === "file" && (
                  <p className="text-xs text-muted-foreground">{formatSize(item.size)}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {renameItem && (
        <RenameDialog
          open={renameItem.open}
          onOpenChange={(open) => {
            if (!open) setRenameItem(null);
            else setRenameItem({ ...renameItem, open: true });
          }}
          itemId={renameItem.itemId}
          currentName={renameItem.currentName}
          itemType={renameItem.itemType}
          sync={sync}
        />
      )}
      <FilePreviewDialog
        open={previewFile.open}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewFile({ open: false, itemId: null});
          } else {
            setPreviewFile({ ...previewFile, open: true });
          }
        }}
        itemId={previewFile.itemId}
      />

    </>
  );
}
