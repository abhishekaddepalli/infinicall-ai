'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetTeamMembersQuery, useGetTransferTeamsQuery } from '@/redux/api/teamMemberApi'
import { TransferTeamSelectorProps } from '@/types/team'
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'

export function TransferMemberSelectOptions({ teamId }: { teamId: string }) {
  const { t } = useTranslation()
  const { data: membersData, isLoading } = useGetTeamMembersQuery(teamId, {
    skip: !teamId,
  })

  if (isLoading)
    return (
      <SelectItem value="__loading__" disabled>
        {t('loading', 'Loading...')}
      </SelectItem>
    )

  if (!membersData?.data?.length)
    return (
      <SelectItem value="__none__" disabled>
        {t('no_members_found', 'No members found')}
      </SelectItem>
    )

  return (
    <>
      {membersData.data.map((m: any) => (
        <SelectItem key={m._id} value={m._id}>
          {m.first_name} {m.last_name}
        </SelectItem>
      ))}
    </>
  )
}

export function TransferTeamSelector({
  teamId,
  setTeamId,
  memberId,
  setMemberId,
  disabled,
}: TransferTeamSelectorProps) {
  const { t } = useTranslation()

  const { data: teamsData, isLoading: isLoadingTeams } = useGetTransferTeamsQuery()
  const eligibleTeams = teamsData?.data || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Team dropdown */}
      <div className="space-y-3">
        <Label className="text-md font-medium text-title">
          {t('transfer_team', 'Transfer Team')}
        </Label>
        <Select
          value={teamId || ''}
          onValueChange={(val) => {
            setTeamId(val)
            setMemberId(null)
          }}
          disabled={isLoadingTeams || disabled}
        >
          <SelectTrigger className="h-10 rounded-radius bg-input-color border-input-border-color font-bold text-sm shadow-none">
            <SelectValue
              placeholder={
                isLoadingTeams
                  ? t('loading', 'Loading...')
                  : eligibleTeams.length === 0
                    ? t('no_transfer_teams', 'No teams with transfer permission')
                    : t('select_team', 'Select Team')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {isLoadingTeams ? (
              <SelectItem value="__loading__" disabled>
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t('loading', 'Loading teams...')}
                </span>
              </SelectItem>
            ) : eligibleTeams.length === 0 ? (
              <SelectItem value="__none__" disabled>
                {t('no_transfer_teams', 'No teams with handleTransfer permission')}
              </SelectItem>
            ) : (
              eligibleTeams.map((team: any) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Member dropdown */}
      <div className="space-y-3">
        <Label className="text-md font-medium text-title">
          {t('transfer_member', 'Transfer Member')}
        </Label>
        <Select
          value={memberId || ''}
          onValueChange={(val) => setMemberId(val)}
          disabled={!teamId || disabled}
        >
          <SelectTrigger className="h-10 rounded-radius bg-input-color border-input-border-color font-bold text-sm shadow-none">
            <SelectValue placeholder={t('select_member', 'Select Member')} />
          </SelectTrigger>
          <SelectContent>
            {teamId ? (
              <TransferMemberSelectOptions teamId={teamId} />
            ) : (
              <SelectItem value="__none__" disabled>
                {t('select_team_first', 'Select a team first')}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
