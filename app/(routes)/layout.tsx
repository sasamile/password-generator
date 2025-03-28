"use client";
import ModeToggle from "@/components/common/dark-mode/mode-toggle";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/constants";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function layoutRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [breadcrumbTitle, setBreadcrumbTitle] = useState<string>("");
  const [itemTitles, setItemTitles] = useState<string[]>([]);

  useEffect(() => {
    const navItem = SidebarNav.navMain.find((nav) =>
      nav.items?.some((url) => url.url === pathname)
    );

    if (navItem) {
      setBreadcrumbTitle(navItem.title);

      const currentItem = navItem.items?.find((item) => item.url === pathname);
      if (currentItem) {
        setItemTitles([currentItem.title]); // Solo el título del item actual
      } else {
        setItemTitles([]); // No hay item, así que vaciamos
      }
    } else {
      const foundNavItem = SidebarNav.navMain.find(
        (nav) => nav.url === pathname
      );
      setBreadcrumbTitle(foundNavItem ? foundNavItem.title : pathname);
      setItemTitles([]);
    }

    // Nueva lógica para establecer el título de Analytics
    const projectItem = SidebarNav.projects.find(
      (project) => project.url === pathname
    );
    if (projectItem) {
      setBreadcrumbTitle(projectItem.name); // Establece el nombre del proyecto
    }

    // Asegúrate de que esta línea se ejecute
    if (pathname === "/notifications") {
      setBreadcrumbTitle("Notifications");
    } else if (pathname.includes("/analytics/")) {
      setBreadcrumbTitle("Analytics");
    } else {
      const navItem = SidebarNav.navMain.find((nav) =>
        nav.items?.some((url) => url.url === pathname)
      );
      if (navItem) {
        setBreadcrumbTitle(navItem.title);
      }
    
    }
  }, [pathname]);

  return (
    <SidebarProvider defaultOpen={true} className="h-full overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2 px-4 justify-between w-full mt-3">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1 size-5" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {itemTitles.length > 0 && <BreadcrumbSeparator />}
                  {itemTitles.length > 0 && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{itemTitles.join(", ")}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <ModeToggle />
          </div>
        </header>
        <main className="p-8 h-full overflow-y-auto hide-scrollbar">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layoutRoutes;
