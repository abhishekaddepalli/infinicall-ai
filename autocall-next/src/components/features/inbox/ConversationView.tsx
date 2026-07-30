"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useGetSmsMessagesQuery, useGetSmsSessionsQuery } from "@/redux/api/smsInboxApi";
import { useAppSelector } from "@/redux/hooks";
import { ConversationViewProps } from "@/types/shared";
import { Menu, MessageSquare, MessageSquareOff, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import ResolveBanner from "./ResolveBanner";

const ConversationView: React.FC<ConversationViewProps> = ({ sessionId, onToggleSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();
  const hasReplyPerm = hasPermission(PERMISSIONS.REPLY_SMS_CHAT);
  const currentUser = useAppSelector((state) => state.auth.user);

  
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: sessionData } = useGetSmsSessionsQuery(undefined, {
    skip: !sessionId,
  });

  const session = sessionData?.sessions?.find(s => (s._id || s.id) === sessionId);

  const { data, isLoading, error } = useGetSmsMessagesQuery(sessionId as string, {
    skip: !sessionId,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [data?.messages]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!sessionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-card sm:p-6 p-4 relative">
        <div className="absolute top-4 left-4 sm:top-7 sm:left-7 z-20 min-[1200px]:hidden">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-primary hover:bg-primary/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center max-w-[500px] w-full relative z-10">
          <div className="relative mb-5 mt-2">
            <div className="h-20 w-20 bg-primary/10 rounded-lg flex items-center justify-center border border-input-border-color overflow-hidden">
              <div className="overflow-hidden">
                <MessageSquareOff className="h-8 w-8 text-primary z-10" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-title mb-3 tracking-tight">{t("no_conversations")}</h3>
          <p className="text-center text-subtitle-color text-md font-medium ">{t("select_conversation_to_start")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[var(--bg-body)] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)] to-bg-card z-0" />
        <div className="z-10 flex flex-col h-full">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-between sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Skeleton className="h-11 w-11 rounded-full bg-input-border-color shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-input-border-color" />
                <Skeleton className="h-3 w-24 bg-input-border-color" />
              </div>
            </div>
            <Skeleton className="h-10 w-full sm:w-48 rounded-lg bg-input-border-color shrink-0" />
          </div>
          
          {/* Messages Skeleton */}
          <div className="flex-1 overflow-y-auto bg-bg-card p-4 md:p-6 space-y-6">
            <div className="flex justify-start">
              <Skeleton className="h-16 w-3/4 max-w-[400px] rounded-2xl rounded-tl-sm bg-input-border-color" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-1/2 max-w-[300px] rounded-2xl rounded-tr-sm bg-primary/20" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-24 w-2/3 max-w-[350px] rounded-2xl rounded-tl-sm bg-input-border-color" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-16 w-3/5 max-w-[350px] rounded-2xl rounded-tr-sm bg-primary/20" />
            </div>
          </div>
          
          {/* Composer Skeleton */}
          <div className="p-4 bg-bg-card border-t border-input-border-color">
            <div className="flex items-center gap-4">
              <Skeleton className="h-[60px] flex-1 rounded-xl bg-input-border-color" />
              <Skeleton className="h-12 w-12 rounded-xl bg-input-border-color shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        {t("failed_to_load")}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-body)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)] to-bg-card z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0"></div>

      <div className="z-10 flex flex-col h-full">
        <ChatHeader session={session} onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Banner moved to bottom */}

        <div className="flex-1 relative flex flex-col min-h-0 bg-bg-card">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-6 scroll-smooth"
          >
            {data?.messages?.length === 0 ? (
              <div className="text-center text-subtitle-color my-8">
                {t("no_messages")}
              </div>
            ) : (
              data?.messages?.map((msg) => (
                <MessageBubble key={msg._id || msg.id} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {showScrollButton && (
            <Button
              size="icon"
              className="absolute bottom-4 right-4 rounded-full bg-primary hover:bg-primary/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-white z-10 transition-all duration-300 w-10 h-10"
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          )}
        </div>

        {session.status === 'completed' && (
          <ResolveBanner />
        )}
        
        {session.status === 'active' && hasReplyPerm && (
          (() => {
            const isAssignedToOther = session.assigned_member_id && (session.assigned_member_id._id || session.assigned_member_id.id) !== ((currentUser as any)?._id || currentUser?.id);
            const assignedName = session.assigned_member_id ? `${session.assigned_member_id.first_name} ${session.assigned_member_id.last_name || ''}`.trim() : '';
            return isAssignedToOther ? (
              <div className="p-4 bg-bg-card border-t border-input-border-color text-center text-subtitle-color font-medium">
                {t("already_assigned_to", { name: assignedName, defaultValue: `Already assigned to ${assignedName}` })}
              </div>
            ) : (
              <MessageComposer sessionId={sessionId} />
            );
          })()
        )}
      </div>
    </div>
  );
};

export default ConversationView;
