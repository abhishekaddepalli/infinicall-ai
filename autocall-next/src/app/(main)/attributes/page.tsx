'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { attributeItems } from "@/data/attribute";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AttributePage() {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6 py-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("attributes")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {attributeItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="group relative overflow-hidden rounded-xl flex flex-col h-full bg-bg-card border border-slate-200 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardHeader className="flex-1 sm:p-6 p-4 pb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10  border border-input-border-color  flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10 group-hover:border-primary/20">
                  <Icon className="w-5 h-5 text-primary transition-colors duration-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-md text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0! mt-auto relative z-10">
                <Button asChild className="w-full sm:w-auto bg-primary/10 hover:bg-primary hover:text-white text-primary border-none transition-all duration-300 shadow-none group/btn font-bold" variant="outline">
                  <Link href={item.redirectPath} className="flex items-center gap-2">
                    {t('integrate')}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
