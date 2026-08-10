"use client";

import { AuthLogo } from "@/components/auth/AuthLogo";
import Spinner from '@/components/reusable/Spinner';
import { ROUTES } from "@/constants/routes";
import useSettings from "@/hooks/useSettings";
import { useGetPageBySlugQuery } from "@/redux/api/pageApi";
import { PageProps } from "@/types/pages";
import DOMPurify from "isomorphic-dompurify";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { use } from "react";
import { useTranslation } from "react-i18next";

export default function CMSPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: pageData, isLoading, error } = useGetPageBySlugQuery(slug);
  const { settings } = useSettings();
  const { t } = useTranslation();

  const decodeHtml = (html: string) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const sanitizedContent = DOMPurify.sanitize(decodeHtml(pageData?.page.content || ""), {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'br', 'a', 'span', 'div', 'img', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height'],
  });

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar flex flex-col bg-bg-body text-title font-sans">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-bg-body/80 backdrop-blur-lg border-b border-input-border-color w-full flex items-center justify-between px-6 sm:px-12 py-4">
        <AuthLogo />
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-all p-padding! rounded-lg hover:bg-primary bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("back_to_login")}</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col w-full relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Spinner />
            <p className="mt-4 text-sm text-subtitle-color">{t("loading_page_content")}</p>
          </div>
        ) : error || !pageData?.page ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">{t("page_not_found")}</h1>
            <p className="text-subtitle-color text-base mb-8">
              {t("page_not_found_description")}
            </p>
            <Link
              href={ROUTES.HOME}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              {t("go_to_homepage")}
            </Link>
          </div>
        ) : (
          <>
            {/* Premium Hero Section */}
            <div className="w-full relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-bg-body pt-16 pb-28 px-4 text-center border-b border-input-border-color/50">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-title mb-6 drop-shadow-sm">
                  {pageData.page.title}
                </h1>
                {(pageData.page.updated_at || pageData.page.created_at) && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card/80 border border-input-border-color shadow-sm backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-sm font-medium text-subtitle-color">
                      Last updated: {new Date(pageData.page.updated_at || pageData.page.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Overlapping Content Card */}
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-20">
              <article className="bg-bg-card rounded-lg shadow-2xl shadow-black/5 border border-input-border-color overflow-hidden">
                <div className="p-4 sm:p-12 md:p-16">
                  <div className="public-content text-[15px] text-subtitle-color leading-relaxed text-left rtl:text-right max-w-4xl mx-auto" >
                    <div 
                      className="
                        break-words
                        [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-title [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:tracking-tight
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-title [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:tracking-tight
                        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-title [&_h3]:mb-4 [&_h3]:mt-6
                        [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-title [&_h4]:mb-3 [&_h4]:mt-5
                        [&_p]:mb-6 [&_p]:text-subtitle-color [&_p]:leading-relaxed
                        [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline
                        [&_strong]:text-title [&_strong]:font-bold
                        [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ul_li]:mb-1 [&_ul_li_p]:mb-0 [&_ul_li::marker]:text-subtitle-color/50
                        [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_ol_li]:mb-1 [&_ol_li_p]:mb-0 [&_ol_li::marker]:text-subtitle-color/50
                        [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-10 [&_img]:max-w-full [&_img]:h-auto
                        [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-subtitle-color/80
                        [&_pre]:bg-subcard [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:border [&_pre]:border-input-border-color
                        [&_code]:bg-subcard [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-input-border-color
                      "
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    ></div>
                  </div>
                </div>
              </article>
            </div>
          </>
        )}
      </main>

      {/* Global Page Footer */}
      <footer className="w-full border-t border-input-border-color bg-bg-card/50 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-subtitle-color">
            © {new Date().getFullYear()} {settings?.app_name || "InfiniCall AI"}. {t('all_right_reserved')}
          </p>
          <div className="flex gap-4">
            <Link href={ROUTES.PRIVACY_POLICY} className="text-sm font-medium text-subtitle-color hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href={ROUTES.TERMS_AND_CONDITIONS} className="text-sm font-medium text-subtitle-color hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
