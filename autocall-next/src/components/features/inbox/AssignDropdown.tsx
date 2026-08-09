"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AssignDropdownProps } from "@/types/shared";
import { useAssignSmsSessionMutation, useGetReplyTeamMembersQuery } from "@/redux/api/smsInboxApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User2, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

const AssignDropdown: React.FC<AssignDropdownProps> = ({ session }) => {
  const { t } = useTranslation();
  const { data: teamMembersData, isLoading } = useGetReplyTeamMembersQuery();
  const [assignSession, { isLoading: isAssigning }] = useAssignSmsSessionMutation();

  const members = teamMembersData?.data || [];

  const handleAssign = async (member_id: string) => {
    if (session.assigned_member_id) {
      const currentAssignedId = session.assigned_member_id._id || session.assigned_member_id.id;
      if (currentAssignedId !== member_id) {
        toast.error(t("already_assigned"));
      }
      return;
    }
    
    try {
      await assignSession({ sessionId: session._id || session.id || '', member_id }).unwrap();
      toast.success(t("assigned_successfully", "Assigned successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={session.status === 'completed'}>
        <Button disabled={session.status === 'completed'} variant="outline" size="sm" className="gap-2 bg-primary/10 border-input-border-color text-primary hover:border-primary/30 hover:text-primary transition-all duration-300 rounded-lg p-padding! h-9 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          <User2 className="h-[15px] w-[15px] text-primary" />
          <span className="hidden sm:inline-block max-w-[120px] truncate">
            {session.assigned_member_id ? `${session.assigned_member_id.first_name} ${session.assigned_member_id.last_name}` : t("assigned_to")}
          </span>
          <ChevronDown className="h-[14px] w-[14px] opacity-60 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-bg-card border-input-border-color shadow-lg rounded-lg z-[60]">
        <DropdownMenuLabel className="text-title">{t("assigned_to")}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-input-border-color" />
        {isLoading ? (
          <div className="p-2 text-sm text-center text-subtitle-color">
            {t("loading")}
          </div>
        ) : (
          members.map((member: any) => {
            const memberId = member._id || member.id;
            return (
              <DropdownMenuItem
                key={memberId}
                onClick={() => handleAssign(memberId)}
                disabled={isAssigning}
                className="flex items-center justify-between cursor-pointer focus:bg-[var(--subcard)] focus:text-[var(--title)] text-[var(--title)]"
              >
                <div className="flex items-center gap-2">
                  <span>{member.first_name} {member.last_name}</span>
                  {member.assigned_tasks_count !== undefined && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {member.assigned_tasks_count}
                    </span>
                  )}
                </div>
                {(session.assigned_member_id?._id || session.assigned_member_id?.id) === memberId && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssignDropdown;
