"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSmsSessionsQuery } from "@/redux/api/smsInboxApi";
import { ConversationListProps } from "@/types/shared";
import { MessageSquare, Search, X } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConversationItem from "./ConversationItem";
import { Button } from "@/components/ui/button";

const ConversationList: React.FC<ConversationListProps> = ({
  selectedSessionId,
  onSelectSession,
  onCloseSidebar,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>("all");

  const { data, isLoading, error, refetch } = useGetSmsSessionsQuery({
    search: search.trim() || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  return (
    <div className="flex flex-col h-full bg-bg-card overflow-x-hidden">
      <div className="sm:p-6 p-4 border-b border-input-border-color space-y-5 relative z-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-title flex items-center gap-2">
            {t("inbox")}
          </h2>
          {onCloseSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseSidebar}
              className="text-subtitle-color hover:text-title hover:bg-input-border-color min-[1200px]:hidden -mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="relative group">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-subtitle-color group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder={t("search_conversations")}
            className="ps-10 bg-input-color border border-input-border-color text-title placeholder:text-subtitle-color rounded-lg h-[44px] focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val: any) => setStatusFilter(val)}
        >
          <SelectTrigger className="w-full shadow-none bg-input-color border border-input-border-color text-title rounded-lg h-[44px] hover:border-input-border-color transition-colors focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder={t("filter_by_status", "Filter by status")} />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-input-border-color shadow-xl rounded-lg">
            <SelectItem value="all" className="focus:bg-[var(--subcard)] cursor-pointer rounded-lg">{t("all", "All")}</SelectItem>
            <SelectItem value="active" className="focus:bg-[var(--subcard)] cursor-pointer rounded-lg">{t("open")}</SelectItem>
            <SelectItem value="completed" className="focus:bg-[var(--subcard)] cursor-pointer rounded-lg">{t("resolved")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading && (
          <div className="space-y-0 pt-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="group flex items-center gap-4 sm:p-4 p-3 m-2 rounded-lg bg-subcard border border-transparent">
                <div className="relative shrink-0">
                  <Skeleton className="h-11 w-11 rounded-full bg-input-border-color" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <Skeleton className="h-4 w-1/3 bg-input-border-color" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-10 rounded-md bg-input-border-color" />
                      <Skeleton className="h-3 w-8 bg-input-border-color" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-1/4 bg-input-border-color" />
                  <Skeleton className="h-3 w-4/5 bg-input-border-color" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-destructive flex flex-col items-center">
            <p className="mb-2">{t("failed_to_load")}</p>
            <Button
              onClick={() => refetch()}
              className="text-sm underline hover:text-destructive/80"
            >
              {t("retry")}
            </Button>
          </div>
        )}

        {!isLoading && !error && data?.sessions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center h-full sm:p-6 p-4 text-center">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xl font-semibold text-title mb-1.5">
              {t("no_conversations")}
            </p>
            <p className="text-md text-subtitle-color leading-relaxed max-w-[200px]">
              {t("your_message_history", "Your message history will appear here")}
            </p>
          </div>
        )}

        {!isLoading && data?.sessions.map((session) => {
          const sessionId = session._id || session.id;
          return (
            <ConversationItem
              key={sessionId}
              session={session}
              isSelected={sessionId === selectedSessionId}
              onClick={() => onSelectSession(sessionId as string)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
