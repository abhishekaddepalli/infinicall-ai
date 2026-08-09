"use client";

import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { BlogsProps } from "@/types/landing";
import { ArrowUpRight, Database, FileText, PhoneCall, Workflow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/redux/hooks";
import { ROUTES } from "@/constants/routes";

export function Blogs({ blogSection, blogsData }: BlogsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleBlogs = isExpanded ? blogsData : blogsData.slice(0, 6);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "June 1, 2026";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "June 1, 2026";
    }
  };

  const getCategoryName = (blog: any) => {
    if (blog.categories && blog.categories.length > 0) {
      return typeof blog.categories[0] === "object" ? blog.categories[0].name : blog.categories[0];
    }
    return "Insight";
  };

  return (
    <section className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-transparent border-t border-[#e2e8f0]/80 overflow-hidden" id="blogs">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0 bg-dot-pattern" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        {/* Centered Header Layout */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))]">
          <h2 className="text-[calc(22px+(46-22)*((100vw-320px)/(1920-320)))] font-extrabold text-[#0a0f1a] tracking-tight leading-[1.1] mb-4">{blogSection.title}</h2>

          <p className="text-[15px] text-subtitle-color leading-relaxed">{blogSection.description || "Discover actionable tips, implementation guides, and AI voice use cases from real-world businesses."}</p>
        </div>

        {/* Blog Cards CSS Grid */}
        {blogsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-slate-50/50 border border-[#e2e8f0] rounded-3xl max-w-[1450px] mx-auto text-center w-full shadow-sm">
            <div className="w-14 h-14 mb-4 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-title mb-1">{t('no_articles_found')}</h3>
            <p className="text-subtitle-color text-md max-w-sm">{t('no_articles_found_desc')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {visibleBlogs.map((blog, index) => {
                const renderIcon = (idx: number) => {
                  if (idx % 3 === 0) return <Workflow className="w-6 h-6 stroke-[1.5]" />;
                  if (idx % 3 === 1) return <PhoneCall className="w-6 h-6 stroke-[1.5]" />;
                  return <Database className="w-6 h-6 stroke-[1.5]" />;
                };

                const categoryName = getCategoryName(blog);
                const tagTitle = blog.tags?.[0]?.name || blog.tags?.[0]?.title || t('tech_analysis');
                const dateString = formatDate(blog.created_at || blog.published_at);

                const blogId = blog._id || blog.slug;
                const destination = (mounted && isAuthenticated) ? `/blog/${blogId}` : `${ROUTES.AUTH.LOGIN}?redirect_to=/blog/${blogId}`;

                return (
                  <Link href={destination} key={blogId || index} className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer">
                    {/* Graphic Cover Banner */}
                    <div className="w-full h-52 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-[#e2e8f0]/60 shrink-0">
                      {blog.thumbnail ? (
                        <Image width={500} height={500} src={getImageUrl(blog.thumbnail)} alt={blog.title} unoptimized className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,84,130,0.02)_0%,transparent_70%)]" />
                          <div className="w-14 h-14 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-primary shadow-sm z-10">{renderIcon(index)}</div>
                        </>
                      )}

                      {/* Category Overlay Tag */}
                      <div className="absolute top-4 left-4 text-[10px] bg-slate-900/80 px-2.5 py-1 rounded-md text-white font-bold tracking-wide uppercase z-20 shadow-sm">{tagTitle}</div>
                    </div>

                    {/* Card Content */}
                    <div className="sm:p-6 p-4 flex flex-col justify-between flex-grow">
                      <div>
                        {/* Meta information */}
                        <div className="flex items-center gap-2 text-[12px] text-subtitle-color font-bold uppercase tracking-wider mb-3">
                          <span className="text-primary">{categoryName}</span>
                          <span className="text-slate-300">•</span>
                          <span>{dateString}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[17px] font-bold text-[#0a0f1a] leading-snug group-hover:text-primary transition-colors duration-200 mb-4 line-clamp-2 break-all whitespace-normal">{blog.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Centered CTA Button */}
            {blogsData.length > 6 && (
              <div className="flex justify-center mt-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center justify-center h-12 gap-2 px-8 py-3.5 bg-primary p-padding! rounded-radius text-white font-bold text-sm transition-all duration-300"
                >
                  <span>{isExpanded ? t('view_less') : t('view_all')}</span>
                  <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
