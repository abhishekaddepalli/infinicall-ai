"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textArea";
import { useReplySmsSessionMutation } from "@/redux/api/smsInboxApi";
import { MessageComposerProps } from "@/types/shared";
import { Send } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';;
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const MessageComposer: React.FC<MessageComposerProps> = ({ sessionId }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [replySession, { isLoading }] = useReplySmsSessionMutation();

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    try {
      await replySession({ sessionId, message: message.trim() }).unwrap();
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      // Error is handled by global error handler usually, but we could add toast here
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [sessionId]);

  return (
    <div className="p-4 bg-bg-card border-t border-input-border-color z-10 relative">
      <div className="flex items-end gap-2 bg-input-color rounded-lg p-1.5 px-2 border border-input-border-color focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={t("type_your_message")}
          className="min-h-[44px] max-h-[140px] resize-none border-0 focus-visible:ring-0 bg-transparent outline-none p-0! text-[15px] w-full text-title placeholder:text-subtitle-color leading-relaxed custom-scrollbar"
          rows={1}
          disabled={isLoading}
        />

        <div className="p-0.5 shrink-0">
          <Button
            size="icon"
            className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className={cn("h-5 w-5 rtl:rotate-180")} />
            )}
          </Button>
        </div>
      </div>
      <div className="text-md text-subtitle-color text-center mt-3 font-medium tracking-wide">
        {t("enter_to_send_shift_enter_for_newline", "Enter to send, Shift + Enter for newline")}
      </div>
    </div>
  );
};

export default MessageComposer;
