"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { SocialButton } from "@/components/auth/SocialButton";
import Loading from "@/components/auth/Loading";

function RootLayoutAuth({ children }: { children: React.ReactNode }) {
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
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col min-h-screen">
        <div className="p-14 flex justify-center gap-3 items-center">
          <Image
            src="/image/logo.avif"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full  h-12 aspect-video object-cover"
          />
          <h2 className="text-2xl font-bold">SasCode</h2>
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
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            {" "}
            {/* Cambiado para centrar el contenido */}
            <h1 className="text-4xl mt-12 mb-6 font-bold font-Fira text-center">
              {" "}
              {/* Añadido text-center */}
              Log in to PasswordDev
            </h1>
            <p className="mb-12 text-center text-sm w-[80%] ">
              {/* Añadido text-center */}
              The app that protects your passwords and helps you keep them safe
              and organized. Access your data with confidence and enjoy an
              experience designed for your peace of mind.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-4">
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
    </>
  );
}

export default RootLayoutAuth;
