
import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function TeamSwitcher() {
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => router.push("/")}
        >
          <div className="flex aspect-video relative size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Image
              src="/image/logo1.avif"
              alt="logo"
              fill
              sizes="full"
              className="rounded-lg object-cover"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold font-Protest">
              SasCode{" "}
            </span>
            <span className="truncate text-xs">Empresa</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
