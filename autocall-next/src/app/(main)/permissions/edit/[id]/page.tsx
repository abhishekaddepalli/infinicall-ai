'use client'

import RoleForm from '@/components/features/permissions/RoleForm'
import Spinner from '@/components/reusable/Spinner'
import { ROUTES } from '@/constants/routes'
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useUpdateRolePermissionsMutation
} from '@/redux/api/roleApi'
import { ApiError } from '@/types/api'
import { CreateRoleRequest } from '@/types/role'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const EditRolePage = () => {
  const { t } = useTranslation ()
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  
  const { data: roleData, isLoading: isFetching } = useGetRoleByIdQuery(id)
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation()
  const [updatePermissions, { isLoading: isUpdatingPermissions }] = useUpdateRolePermissionsMutation()

  const handleSubmit = async (values: CreateRoleRequest & { permission_ids: string[], permissions?: string[] }) => {
    try {
      // Send single payload with basic info and mapped permission slugs
      await updateRole({
        id,
        data: {
          name: values.name,
          description: values.description,
          status: values.status,
          is_active: values.is_active,
          permissions: values.permissions
        } as any
      }).unwrap()

      toast.success(t('role_update_successfully'))
      router.push(ROUTES.PERMISSIONS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_role'))
    }
  }

  const initialValues = useMemo(() => {
    if (!roleData?.data) return undefined;
    if ('role' in roleData.data && 'permissions' in roleData.data) {
      return {
        ...roleData.data.role,
        permissions: roleData.data.permissions.map((p) => p._id || p.id)
      };
    }
    return undefined;
  }, [roleData]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <RoleForm 
        key={id}
        mode="edit" 
        initialValues={initialValues} 
        onSubmit={handleSubmit} 
        isLoading={isUpdatingRole || isUpdatingPermissions} 
      />
    </div>
  )
}

export default EditRolePage
