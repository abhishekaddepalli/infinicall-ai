"use client";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthSplitPageProps } from "@/types/auth";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "i18next";
import React, { Suspense } from "react";
import { Button } from "../ui/button";
import { AuthControls } from "./AuthControls";
import { AuthLogo } from "./AuthLogo";
import { VisualPanel } from "./VisualPanel";

const AuthSplitPage: React.FC<AuthSplitPageProps> = ({ initialMode = "login" }) => {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const isRegister = mode === "register";

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    window.history.replaceState(null, "", newMode === "login" ? "/login" : "/register");
  };

  const toggle = () => {
    const newMode = mode === "login" ? "register" : "login";
    handleModeChange(newMode);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-bg-card text-title font-sans">
      {/* Top Right Controls - Desktop Only */}
      <AuthControls className="hidden lg:flex" />

      <div
        className="absolute top-0 h-full w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-12 xl:p-20 bg-bg-card z-10 overflow-y-auto custom-scrollbar"
        style={{
          left: 0,
          transform: isDesktop ? (isRegister ? "translateX(100%)" : "translateX(0%)") : "none",
          transition: isDesktop ? "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
          willChange: isDesktop ? "transform" : "auto",
        }}
      >
        {/* Logo & Mobile Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-2 sm:mt-0">
          <AuthLogo className="z-20 relative" />
          <AuthControls className="!static lg:hidden !shadow-none !p-[4px]" />
        </div>

        {/* Mobile/Tablet Switcher Tabs */}
        <div className="lg:hidden w-full max-w-[420px] mx-auto mt-6 mb-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex gap-1 relative z-25">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleModeChange("login")}
            className={`flex-1 h-10 py-2.5 text-center font-bold text-sm rounded-lg transition-all hover:bg-transparent ${mode === "login"
              ? "bg-primary hover:bg-primary text-white shadow-sm hover:text-white"
              : "text-subtitle-color hover:text-title"
              }`}
          >
            {t('sign_in')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleModeChange("register")}
            className={`flex-1 h-10 py-2.5 text-center font-bold text-sm rounded-lg transition-all hover:bg-transparent ${mode === "register"
              ? "bg-primary hover:bg-primary text-white shadow-sm hover:text-white"
              : "text-subtitle-color hover:text-title"
              }`}
          >
            {t('sign_up')}
          </Button>
        </div>

        {/* Form with crossfade */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="w-full"
            >
              {mode === "login" ? (
                <Suspense fallback={null}>
                  <LoginForm />
                </Suspense>
              ) : (
                <RegisterForm onSuccess={() => handleModeChange("login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div
        className="absolute top-0 h-full hidden lg:block w-1/2"
        style={{
          left: "50%",
          transform: isRegister ? "translateX(-100%)" : "translateX(0%)",
          transition: "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)",
          willChange: "transform",
        }}
      >
        <VisualPanel />
      </div>

      <div
        className="hidden lg:flex absolute z-30 items-center justify-center pointer-events-none"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Button
          onClick={toggle}
          className="pointer-events-auto flex items-center gap-2 p-padding! rounded-modal-radius! h-12 font-bold text-sm tracking-wide text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer outline-none"
          style={{ background: "linear-gradient(135deg, #015482 0%, #013a5c 100%)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              {mode === "login" ? "Sign Up →" : "← Sign In"}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>

      <div className="invisible min-h-screen w-full" aria-hidden="true" />
    </div>
  );
};

export default AuthSplitPage;
