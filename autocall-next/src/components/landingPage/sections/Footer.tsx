"use client";

import { AuthLogo } from "@/components/auth/AuthLogo";
import { ROUTES } from "@/constants/routes";
import { FooterProps } from "@/types/landing";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer({ footerData }: FooterProps) {
  const { t } = useTranslation();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#" || href === "#home") {
        const container = document.getElementById("main-scroll-container");
        if (container) {
          container.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] text-[#e2e8f0] border-t border-white/10 pt-20 pb-10">
      {/* Decorative ambient subtle bottom-right glow inside footer */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(1,84,130,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        {/* Primary Footer Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))] pb-[calc(25px+(64-25)*((100vw-320px)/(1920-320)))] border-b border-white/10">
          {/* Company Branding Column */}
          <div className="md:col-span-6 flex flex-col justify-between pr-0 md:pr-16">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <AuthLogo logoType="landing" />
              </div>

              {/* Very clear description text with excellent contrast */}
              <p className="text-[14px] text-[#cbd5e1] leading-relaxed max-w-md mb-8">{footerData.subtitle}</p>
            </div>

            {/* Social Icons row */}
            <div>
              <h4 className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-widest mb-4">{t('follow_us_on')}</h4>
              <div className="flex items-center gap-3">
                <Link href={footerData.content?.instagram || "#"} className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-primary border border-slate-800 flex items-center justify-center text-[#cbd5e1] hover:text-white transition-all duration-200" aria-label={t('instagram')}>
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </Link>
                <Link href={footerData.content?.facebook || "#"} className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-primary border border-slate-800 flex items-center justify-center text-[#cbd5e1] hover:text-white transition-all duration-200" aria-label={t('facebook')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href={footerData.content?.twitter || "#"} className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-primary border border-slate-800 flex items-center justify-center text-[#cbd5e1] hover:text-white transition-all duration-200" aria-label="X (formerly Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link href={footerData.content?.linkedin || "#"} className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-primary border border-slate-800 flex items-center justify-center text-[#cbd5e1] hover:text-white transition-all duration-200" aria-label={t('linkedin')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-3">
            <h4 className="text-[13px] font-extrabold text-white uppercase tracking-wider mb-6">{t('company')}</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Pricing", href: "#pricing" },
                { name: "Blogs", href: "#blogs" },
                { name: "Contact", href: "#contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-[13px] text-[#cbd5e1] hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[13px] font-extrabold text-white uppercase tracking-wider mb-6">{t('product')}</h4>
            <ul className="space-y-4">
              {[
                { name: "Core Features", href: "#features" },
                { name: "Automation", href: "#automate" },
                { name: "Smart Conversations", href: "#human-transfer" },
                { name: "Platform Comparison", href: "#comparison" },
                { name: "Premium Add-ons", href: "#addons" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-[13px] text-[#cbd5e1] hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row copyrights */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-[calc(25px+(40-25)*((100vw-320px)/(1920-320)))] text-[12px] text-white">
          <p>© 2026 AutoCall AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={ROUTES.PRIVACY_POLICY} target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-200">
              {t("privacy_policy")}
            </Link>
            <Link href={ROUTES.TERMS_AND_CONDITIONS} target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-200">
              {t("terms_and_conditions")}
            </Link>
            <Link href={ROUTES.REFUND_POLICY} target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-200">
              {t("refund_policy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
