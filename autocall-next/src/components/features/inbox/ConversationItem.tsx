"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConversationItemProps } from "@/types/shared";
import { formatDistanceToNow } from "@/utils/validation-schemas";
import React from "react";
import { useTranslation } from "react-i18next";

const ConversationItem: React.FC<ConversationItemProps> = ({
  session,
  isSelected,
  onClick,
}) => {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    if (!name) return "U";
    if (name.startsWith('+')) return name.substring(1, 3);
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = session.contact_id?.first_name || session.phone_number;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 sm:p-4 p-3 m-2 rounded-lg cursor-pointer transition-all duration-200 relative",
        isSelected
          ? "bg-primary/10 text-title"
          : "border border-transparent bg-subcard hover:border-input-border-color text-title"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className={cn(
          "h-11 w-11 border transition-all duration-300",
          isSelected ? "border-primary/40" : "border-input-border-color group-hover:border-primary/30"
        )}>
          <AvatarFallback className={cn("font-semibold text-md", isSelected ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary")}>
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        {(session.unreadCount ?? 0) > 0 && (
          <span className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--sidebar-bg)] shadow-sm">
            {session.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className={cn("font-semibold text-md truncate pe-2 transition-colors", isSelected ? "text-primary" : "group-hover:text-primary")}>
            {displayName}
          </h4>
          <div className="flex items-center gap-2 shrink-0">
            {session.status === "completed" || session.status === "human_takeover" ? (
              <Badge variant="secondary" className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium border-0", isSelected ? "bg-[var(--table-input-color)]/50 text-[var(--subtitle-color)]" : "bg-[var(--table-input-color)]/30 text-[var(--subtitle-color)]")}>
                {t("resolved")}
              </Badge>
            ) : (
              <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium border-transparent shadow-sm", isSelected ? "bg-primary text-white" : "bg-primary text-white")}>
                {t("open")}
              </Badge>
            )}
            <span className={cn("text-[11px] whitespace-nowrap font-medium tracking-wide", isSelected ? "text-primary" : "text-[var(--subtitle-color)]")}>
              {session.lastMessageTime
                ? formatDistanceToNow(new Date(session.lastMessageTime), {
                  addSuffix: true,
                })
                : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <p className="text-md text-subtitle-color truncate font-medium tracking-wide">
            {session.phone_number}
          </p>
        </div>

        <p className={cn("text-sm truncate pe-6 transition-colors line-clamp-1 leading-relaxed", isSelected ? "text-title/90" : "text-[var(--subtitle-color)] group-hover:text-title/80")}>
          {session.lastMessage || ""}
        </p>


      </div>
    </div>
  );
};

export default ConversationItem;
