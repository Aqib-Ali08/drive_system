import { DriveContent } from "@/components/drive/DriveContent";
import { DriveHeader } from "@/components/drive/DriveHeader";
import { DriveSidebar } from "@/components/drive/DriveSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Drive() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DriveSidebar />
        <div className="flex-1 flex flex-col">
          <DriveHeader/>
          <DriveContent />
        </div>
      </div>
      
   
    </SidebarProvider>
  );
}