import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentFolder, goBackFolder } from "@/store/driveSlice";
import { RootState } from "@/store/store";

export function Breadcrumbs() {
  const dispatch = useDispatch();
  const { currentFolderId, folderStack } = useSelector(
    (state: RootState) => state.drive
  );

  // Root + folderStack forms the full path
  const path = folderStack;

  return (
    <div className="flex items-center gap-1 text-sm">
      {/* Home / Root button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch(setCurrentFolder({ folderId: null }))}
        className="gap-2"
      >
        <Home className="h-4 w-4" />
        My Drive
      </Button>

      {/* Render breadcrumb folders */}
      {path.map((folder, idx) => (
        <div key={folder._id} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(goBackFolder(idx))}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
