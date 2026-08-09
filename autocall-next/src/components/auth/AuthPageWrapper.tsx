"use client";

import { AuthPageWrapperProps } from "@/types/auth";
import React from "react";
import { AuthControls } from "./AuthControls";
import { AuthLogo } from "./AuthLogo";
import { VisualPanel } from "./VisualPanel";

export const KezakLogoEmblem = ({ className = "w-8 h-8", color = "currentColor" }) => (

  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="30" fill={color} />
    <path d="M32 30C32 27.7909 33.7909 26 36 26H50L68 50L50 74H36C33.7909 74 32 72.2091 32 70V30Z" fill="white" className="opacity-95" />
    <path d="M68 30C68 27.7909 66.2091 26 64 26H50L32 50L50 74H64C66.2091 74 68 72.2091 68 70V30Z" fill="white" className="opacity-40" />
    <path
      d="M44 40L56 50L44 60"
      stroke={color === "currentColor" ? "#015482" : color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex bg-bg-card text-title font-sans overflow-hidden">
      {/* Top Right Controls - Desktop Only */}
      <AuthControls className="hidden lg:flex" />

      <div className="w-full flex flex-col lg:flex-row min-h-screen">

        {/* ── Left: Form ─────────────────────────────────────────────────── */}
        <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-12 xl:p-20 h-screen overflow-y-auto custom-scrollbar">
          {/* Logo & Mobile Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-2 sm:mt-0">
            <AuthLogo />
            <AuthControls className="!static lg:hidden !shadow-none !p-[4px]" />
          </div>

          {/* Form content */}
          <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto py-8">
            {children}
          </div>
        </div>

        {/* ── Right: Visual Banner ────────────────────────────────────────── */}
        <VisualPanel className="hidden lg:flex lg:w-1/2" />

      </div>
    </div>
  );
};

export default AuthPageWrapper;
