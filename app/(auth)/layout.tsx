"use client";

import HeaderTitle from "@/components/auth/header-title";
import Loading from "@/components/auth/loading";
import { SocialButton } from "@/components/auth/social-button";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function LayoutAuth({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    } else {
      setIsVisible(false); // Asegúrate de ocultar el mensaje si no hay error
    }
  }, [error]);

  useEffect(() => {
    const urlErrorParam = searchParams.get("error");
    if (urlErrorParam === "OAuthAccountNotLinked") {
      setError("El correo ya está en uso con otra cuenta!");
    }
  }, [searchParams]);

  const handleLogin = async (provider: "google" | "microsoft-entra-id") => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EmailExists") {
          setError("Este correo ya está registrado con otro proveedor");
        } else {
          setError("Ocurrió un error durante el inicio de sesión");
        }
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      setError("Ocurrió un error durante el inicio de sesión");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] dark:bg-black bg-[#ddd] ">
      <div className="md:w-1/2 flex justify-center items-center overflow-y-auto h-full pt-8 hide-scrollbar">
        {isLoading && <Loading />}
        <div className="flex flex-col min-h-screen">
          <div className="pt-16 flex justify-center gap-3 items-center">
            <Image
              src="/image/logo1.avif"
              alt="logo"
              width={50}
              height={50}
              className="rounded-full  h-12 aspect-video object-cover"
            />
            <h2 className="text-2xl font-bold font-Protest">SasCode</h2>
          </div>
          {error && (
            <div
              className={`mx-auto max-w-md w-full px-4 transition-all duration-300 ease-in-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                <div className="flex-shrink-0 rounded-full bg-red-400">
                  <X className="w-4 h-4 p-1" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="py-6">
            <HeaderTitle />
          </div>
          {children}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-sm  dark:bg-background px-2 text-muted-foreground">
                o
              </span>
            </div>
          </div>
          <div className="flex xs:flex-row flex-col items-center justify-center gap-3 pb-8 w-full max-w-md mx-auto">
            <SocialButton
              label="Log in with Google"
              label2="Google"
              onClick={() => handleLogin("google")}
            />
            <SocialButton
              label="Log in with Microsoft"
              label2="Microsoft"
              onClick={() => handleLogin("microsoft-entra-id")}
            />
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen relative max-xl:hidden ">
        <Image
          src={`${
            pageTitle === "sign-in" ? "/image/auth.avif" : "/image/auth1.avif"
          }`}
          fill
          alt="auth"
          sizes="21"
          className="p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] rounded-2xl"
        />
      </div>
    </div>
  );
}

export default LayoutAuth;
