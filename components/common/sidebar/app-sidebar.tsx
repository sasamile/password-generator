import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { SidebarNav } from "@/constants";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AppSidebar() {
  const user = useCurrentUser();
  const navusedata = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.image ?? "",
  };
  return (
    <Sidebar variant="inset" collapsible="icon" >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarNav.navMain} />
        <NavProjects projects={SidebarNav.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navusedata} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
