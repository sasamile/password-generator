import Image from "next/image";
import React from "react";

function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] ">
      <div className="w-1/2 flex justify-center items-center" >{children}</div>
      <div className="w-1/2 h-screen relative ">
        <Image
          src={"/image/auth.avif"}
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
