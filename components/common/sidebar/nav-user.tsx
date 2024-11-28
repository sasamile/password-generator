"use client";

import { useState } from 'react';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import ProfileModal, { UserData } from "./profile-modal";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/actions/user";
import { getNotificationsAndPasswordSecurity } from "@/actions/notifications";
import { BillingModal } from './billing-modal';


export function NavUser() {
  const { isMobile } = useSidebar();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!session?.user?.email) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          setIsLoading(false);
          return;
        }
        const userData = await getUserByEmail(session.user.email);
        setUser(userData);
        setEditedUser(userData);

        const notificationsData = await getNotificationsAndPasswordSecurity();
        setNotificationCount(notificationsData?.totalNotifications || 0);
      } catch (error) {
        console.error("Error loading user:", error);
        setError("Error al cargar los datos del usuario.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
    const interval = setInterval(async () => {
      if (session?.user?.email) {
        const notificationsData = await getNotificationsAndPasswordSecurity();
        setNotificationCount(notificationsData?.totalNotifications || 0);
      }
    }, 2000); // Actualiza cada 5 segundos

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "i") {
        event.preventDefault();
        setIsProfileModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const openBillingModal = () => {
    setIsBillingModalOpen(true);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    className="object-cover"
                    src={editedUser?.image!}
                    alt={editedUser?.name!}
                  />
                  <AvatarFallback className="rounded-lg uppercase">
                    {editedUser?.name && editedUser?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {editedUser?.name!}
                  </span>
                  <span className="truncate text-xs">{editedUser?.email!}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      className="object-cover"
                      src={editedUser?.image!}
                      alt={editedUser?.name!}
                    />
                    <AvatarFallback className="rounded-lg uppercase">
                      {editedUser?.name && editedUser?.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={openBillingModal}>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={openProfileModal}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openBillingModal}>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/notifications')} className="relative">
                  <Bell />
                  Notifications
                  {notificationCount > 0 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {notificationCount}
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <BillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />
    </>
  );
}

