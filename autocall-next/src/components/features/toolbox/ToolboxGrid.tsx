'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toolboxItems } from "@/data/toolboxData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ToolboxGrid() {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-title line-clamp-1 ">
          {t("toolbox_page_title")}
        </h1>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolboxItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="group relative overflow-hidden rounded-radius flex flex-col h-full bg-bg-card border border-slate-200 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
              {/* Premium Glow Effect */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <CardHeader className="flex-1 p-6 pb-6 relative z-10">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>

                {/* Content */}
                <CardTitle className="text-xl font-bold text-title mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                  {t(item.titleKey)}
                </CardTitle>
                <CardDescription className="text-md text-subtitle-color leading-relaxed font-medium">
                  {t(item.descriptionKey)}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 mt-auto relative z-10 flex justify-center">
                <Link href={item.redirectPath} className="inline-flex items-center gap-2 p-padding bg-subcard border border-input-border-color rounded-radius w-full items-center justify-center text-[14px] font-bold text-title font-medium dark:text-white group-hover:text-primary transition-colors duration-300">
                  {t("toolbox_manage")}
                  <div className="flex items-center justify-center group-hover:translate-x-1.5 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
