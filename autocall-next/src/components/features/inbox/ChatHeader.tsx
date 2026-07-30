"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useResolveSmsSessionMutation } from "@/redux/api/smsInboxApi";
import { useAppSelector } from "@/redux/hooks";
import { ChatHeaderProps } from "@/types/shared";
import { CheckCircle2, Menu } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AssignDropdown from "./AssignDropdown";

const ChatHeader: React.FC<ChatHeaderProps> = ({ session, onToggleSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();
  const hasAssignPerm = hasPermission(PERMISSIONS.ASSIGN_SMS_CHAT);
  const hasReplyPerm = hasPermission(PERMISSIONS.REPLY_SMS_CHAT);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [resolveSession, { isLoading }] = useResolveSmsSessionMutation();

  const isAssignedToOther = session.assigned_member_id && (session.assigned_member_id._id || session.assigned_member_id.id) !== ((currentUser as any)?._id || currentUser?.id);

  const handleResolve = async () => {
    try {
      await resolveSession(session._id || session.id || '').unwrap();
      toast.success(t("conversation_resolved"));
    } catch (error) {
      toast.error(t("something_went_wrong"));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    if (name.startsWith('+')) return name.substring(1, 3);
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = session.contact_id?.first_name || session.phone_number;

  return (
    <div className="min-h-[76px] py-3 sm:py-0 h-auto border-b border-input-border-color bg-bg-card/80 backdrop-blur-xl px-4 sm:px-7 flex flex-wrap sm:flex-nowrap items-center justify-between z-20 sticky top-0 transition-all gap-3 sm:gap-2">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-[200px]">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-primary hover:bg-primary/10 min-[1200px]:hidden shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-input-border-color">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 end-0.5 h-3 sm:h-3.5 w-3 sm:w-3.5 rounded-full bg-edit border-[2.5px] border-input-border-color"></div>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <h3 className="font-bold text-sm sm:text-base text-title tracking-tight break-words whitespace-normal leading-tight mb-0.5">
            {displayName}
          </h3>
          <p className="text-xs sm:text-sm text-subtitle-color font-medium tracking-wide break-words whitespace-normal leading-tight">
            {session.phone_number}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasAssignPerm && (
          <AssignDropdown session={session} />
        )}
        {hasReplyPerm && session.status === 'active' && (
          <Button
            size="sm"
            variant="outline"
            className=" border-none sm:flex gap-2 text-white bg-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-lg p-padding! h-9 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResolve}
            disabled={isLoading || Boolean(isAssignedToOther)}
          >
            <CheckCircle2 className="h-5 w-5" />
            {t("resolve")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
