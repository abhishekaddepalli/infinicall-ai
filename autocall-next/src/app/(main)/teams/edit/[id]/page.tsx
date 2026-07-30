'use client'

import TeamForm from '@/components/features/teams/TeamForm'
import Spinner from '@/components/reusable/Spinner'
import { ROUTES } from '@/constants/routes'
import { useGetTeamByIdQuery, useUpdateTeamMutation } from '@/redux/api/teamApi'
import { ApiError } from '@/types/api'
import { UpdateTeamRequest } from '@/types/team'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const EditTeamPage = () => {
  const router = useRouter()
  const params = useParams()
  const { t } = useTranslation()
  const id = params.id as string

  const { data, isLoading: isFetching } = useGetTeamByIdQuery(id)
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation()

  const handleSubmit = async (values: UpdateTeamRequest) => {
    try {
      const res = await updateTeam({ id, data: values }).unwrap()
      toast.success(res.message || t('team_updated_successfully', 'Team updated successfully'))
      router.push(ROUTES.TEAMS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_team', 'Failed to update team'))
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  if (!data?.data) {
    return <div className="text-center mt-10">{t('team_not_found', 'Team not found')}</div>
  }

  return (
    <div>
      <TeamForm 
        mode="edit" 
        initialValues={{
          name: data.data.name,
          description: data.data.description,
          status: data.data.status,
          permissions: data.data.permissions
        }}
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  )
}

export default EditTeamPage
