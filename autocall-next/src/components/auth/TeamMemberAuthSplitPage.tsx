"use client";

import TeamMemberLoginForm from "@/components/auth/TeamMemberLoginForm";
import { motion } from "framer-motion";
import React from "react";
import { AuthControls } from "./AuthControls";
import { AuthLogo } from "./AuthLogo";
import { VisualPanel } from "./VisualPanel";

const TeamMemberAuthSplitPage: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-bg-card text-title font-sans">
      {/* Top Right Controls */}
      <AuthControls />

      <div className="absolute top-0 h-full w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 xl:p-20 bg-bg-card z-10 left-0">
        {/* Logo */}
        <AuthLogo className="z-20 relative" />

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="w-full"
          >
            <TeamMemberLoginForm />
          </motion.div>
        </div>
      </div>

      <div className="absolute top-0 h-full hidden lg:block w-1/2 left-1/2">
        <VisualPanel />
      </div>

      <div className="invisible min-h-screen w-full" aria-hidden="true" />
    </div>
  );
};

export default TeamMemberAuthSplitPage;
