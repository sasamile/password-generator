"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

function HeaderTitle() {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = pathname.split("/").pop();
  return (
      <div className="flex flex-col items-center">
        <h1 className="text-4xl mb-2 font-bold font-acme text-center">
          {pageTitle === "sign-in" ? (
            <>Sign in to PasswordDev</>
          ) : (
            pageTitle === "sign-up" && <>Sign up to PasswordDev</>
          )}
        </h1>
        <p>
          {pageTitle === "sign-in" ? (
            <>
              If you don't have an account{" "}
              <span
                onClick={() => router.push("/sign-up")}
                className="cursor-pointer text-blue-800"
              >
                sign up{" "}
              </span>{" "}
            </>
          ) : (
            pageTitle === "sign-up" && (
              <>
                If you already have an account{" "}
                <span
                  onClick={() => router.push("/sign-in")}
                  className="cursor-pointer text-blue-800"
                >
                  log in
                </span>
              </>
            )
          )}
        </p>
      </div>
  );
}

export default HeaderTitle;
