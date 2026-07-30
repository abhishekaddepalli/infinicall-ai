'use client'

import TeamForm from '@/components/features/teams/TeamForm'
import { ROUTES } from '@/constants/routes'
import { useCreateTeamMutation } from '@/redux/api/teamApi'
import { ApiError } from '@/types/api'
import { CreateTeamRequest } from '@/types/team'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AddTeamPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation()

  const handleSubmit = async (values: CreateTeamRequest) => {
    try {
      const res = await createTeam(values).unwrap()
      toast.success(res.message || t('team_created_successfully', 'Team created successfully'))
      router.push(ROUTES.TEAMS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_create_team', 'Failed to create team'))
    }
  }

  return (
    <div>
      <TeamForm 
        mode="create" 
        onSubmit={handleSubmit} 
        isLoading={isCreating} 
      />
    </div>
  )
}

export default AddTeamPage
