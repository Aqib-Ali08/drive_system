import { Folder, FileText, Trash2, Edit, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
// import { RenameDialog } from "./RenameDialog";
import { deleteFile, deleteFolder, downloadFile, renameFile } from "@/services";
import { useDispatch } from "react-redux";
import { setCurrentFolder } from "@/store/driveSlice";
import { RenameDialog } from "./RenameDialog";

export function DriveList({ items, sync }) {
  const dispatch = useDispatch()

  const [renameItem, setRenameItem] = useState({
    open: false,
    itemId: null,
    currentName: "",
    itemType: ""
  });
  const [loading, setLoading] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => {
                if (item.type === "folder") {
                  dispatch(setCurrentFolder({ folderId: item._id, folderName: item.name }));

                }
              }}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.type === "folder" ? (
                    <Folder className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">{item.name || item.filename}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.type === "file" ? formatSize(item.size) : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                      onClick={() => handleDeleteItem(item.id, item.type)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {loading ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </>
  );
}
