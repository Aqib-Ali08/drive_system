import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { HardDrive } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { title: "My Drive", icon: HardDrive, id: "my-drive" },
];

export function DriveSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [activeItem, setActiveItem] = useState("my-drive");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const currentFolderId = null

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          {/* <div className="p-4">
            {!isCollapsed && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="w-full"
              >
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            )}
            {isCollapsed && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                size="icon"
                className="w-full"
              >
                <Folder className="h-4 w-4" />
              </Button>
            )}
          </div> */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-semibold">
              D
            </span>
            <h2 className="text-lg font-semibold text-gray-800">Drive</h2>
          </div>


          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveItem(item.id)}
                      className={activeItem === item.id ? "bg-sidebar-accent" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
