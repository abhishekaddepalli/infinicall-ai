"use client";

import { AuthLogo } from "@/components/auth/AuthLogo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/redux/hooks";
import { HeaderProps } from "@/types/landing";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PhoneCall, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function Header({ navigation }: HeaderProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScrollEvent = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navigation.forEach((item) => {
      if (item.href.startsWith("#") && item.href !== "#") {
        const target = document.querySelector(item.href);
        if (target) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setActiveSection(item.href);
                }
              });
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
          );
          observer.observe(target);
          observers.push(observer);
        }
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [navigation]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isMobile = false) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (isMobile) {
        setMobileMenuOpen(false);
      }
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("");
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(href);
        }
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full sticky top-0 z-50 px-4 md:px-8 max-w-[1700px] mx-auto transition-all duration-300 ${isScrolled ? "pt-4" : "pt-6"
          }`}
      >
        <div className={`flex items-center justify-between border border-primary/10 rounded-full px-6 md:px-8 py-3.5 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-lg shadow-[0_8px_30px_rgba(1,84,130,0.08)]" : "bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(1,84,130,0.04)]"
          }`}>
          {/* Logo */}
          <AuthLogo logoType="landing" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = activeSection ? activeSection === item.href : item.active;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className={`text-base font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${isActive ? "text-primary" : "text-title hover:text-primary"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Sign In / Get Started Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {!mounted ? (
              <>
                <div className="w-[80px] h-[38px] bg-primary/5 rounded-radius animate-pulse" />
                <div className="w-[110px] h-[38px] bg-primary/10 rounded-radius animate-pulse" />
              </>
            ) : (
              <>
                {!isAuthenticated && (
                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="p-padding! rounded-radius text-primary hover:bg-primary hover:text-white bg-primary/10 transition-all duration-300 font-bold text-sm"
                  >
                    {t("sign_in")}
                  </Link>
                )}
                <Link
                  href={ROUTES.AUTH.REGISTER}
                  className="p-padding! rounded-radius bg-primary text-white  transition-all duration-300 font-bold text-sm"
                >
                  {t("get_started")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 bg-unset rounded-full text-slate-700 hover:bg-primary/5 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </motion.header>

      {/* Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#020617]/40 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="#" onClick={(e) => handleScroll(e, "#", true)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-[#020617]">{t('autocall')}</span>
                </Link>
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-unset rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <nav className="flex flex-col gap-5 mb-8">
                {navigation.map((item) => {
                  const isActive = activeSection ? activeSection === item.href : item.active;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href, true)}
                      className={`text-lg font-semibold py-1.5 transition-colors ${isActive
                        ? "text-primary border-l-2 border-primary pl-3"
                        : "text-title hover:text-primary pl-3"
                        }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                {!mounted ? (
                  <>
                    <div className="w-full h-[48px] bg-slate-100 rounded-full animate-pulse" />
                    <div className="w-full h-[48px] bg-slate-200 rounded-full animate-pulse" />
                  </>
                ) : (
                  <>
                    {!isAuthenticated && (
                      <Link
                        href={ROUTES.AUTH.LOGIN}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full h-12 flex items-center justify-center p-padding rounded-radius text-primary hover:bg-primary font-bold hover:text-white text-sm bg-primary/10 transition-all text-center"
                      >
                        {t('sign_in')}
                      </Link>
                    )}
                    <Link
                      href={ROUTES.AUTH.REGISTER}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full h-12 flex items-center justify-center p-padding rounded-radius bg-primary text-white font-bold text-sm shadow-[0_8px_20px_rgba(1,84,130,0.2)] hover:bg-[#004166] transition-all text-center"
                    >
                      {t('get_started')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
