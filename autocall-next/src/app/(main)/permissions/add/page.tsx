'use client'

import RoleForm from '@/components/features/permissions/RoleForm'
import { ROUTES } from '@/constants/routes'
import { useCreateRoleMutation, useUpdateRoleMutation } from '@/redux/api/roleApi'
import { ApiError } from '@/types/api'
import { CreateRoleRequest } from '@/types/role'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AddRolePage = () => {
  const router = useRouter()
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
  const [updateRole] = useUpdateRoleMutation()

  const handleSubmit = async (values: CreateRoleRequest & { permission_ids: string[], permissions?: string[] }) => {
    try {
      // 1. Create the role
      const roleRes = await createRole({
        name: values.name,
        description: values.description,
        status: values.status,
        is_active: values.is_active,
      }).unwrap()
      
      const roleId = roleRes.data.id || roleRes.data._id

      // 2. Assign permissions
      if (roleId && values.permissions && values.permissions.length > 0) {
        await updateRole({
          id: roleId,
          data: {
            permissions: values.permissions
          } as any
        }).unwrap()
      }

      toast.success(roleRes.message || 'Role created successfully with permissions')
      router.push(ROUTES.PERMISSIONS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to create role')
    }
  }

  return (
    <div>
      <RoleForm 
        mode="create" 
        onSubmit={handleSubmit} 
        isLoading={isCreating} 
      />
    </div>
  )
}

export default AddRolePage
