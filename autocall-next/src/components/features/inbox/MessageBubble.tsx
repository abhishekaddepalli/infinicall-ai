"use client";

import { cn } from "@/lib/utils";
import { MessageBubbleProps } from "@/types/shared";
import { format } from "date-fns";
import { Check, CheckCheck, Clock } from "lucide-react";
import React from "react";

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.role === "ai" || message.role === "human";
  const roleLabel = message.role === "ai" ? "AI Assistant" : message.role === "human" ? "Human" : "Customer";

  return (
    <div
      className={cn(
        "flex flex-col w-full",
        isOutgoing ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "flex items-center gap-2 mb-1.5 px-1 text-sm font-medium tracking-wide",
        isOutgoing ? "text-subtitle-color/80" : "text-subtitle-color"
      )}>
        <span>{roleLabel}</span>
      </div>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] sm:px-5 px-3 py-3.5 relative group transition-all",
          isOutgoing
            ? "bg-primary text-white rounded-2xl rounded-te-sm border border-primary/20 shadow-[0_4px_15px_rgba(var(--primary-rgb),0.15)]"
            : "bg-primary/15 text-primary rounded-2xl rounded-ts-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        )}
      >
        <div className="whitespace-pre-wrap break-words text-md leading-relaxed">
          {message.content}
        </div>

        <div className={cn(
          "flex items-center gap-1.5 mt-1.5 text-xs font-medium tracking-wide",
          isOutgoing ? "justify-end text-white/70" : "justify-end text-primary"
        )}>
          <span>
            {message.created_at ? format(new Date(message.created_at), "HH:mm") : ""}
          </span>
          {isOutgoing && message.status && (
            <span className="opacity-80">
              {message.status === "sent" ? (
                <Check className="h-3.5 w-3.5" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="h-3.5 w-3.5 text-white" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
