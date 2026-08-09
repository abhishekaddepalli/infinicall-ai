'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useGetActiveRolesQuery } from '@/redux/api/roleApi'
import { useCreateUserMutation, useUpdateUserMutation } from '@/redux/api/userApi'
import { ApiError } from '@/types/api'
import { Role } from '@/types/role'
import { MemberModalProps } from '@/types/user'
import { getMediaUrl } from '@/utils/auth'
import { ROUTES } from '@/constants/routes'
import { userSchemas } from '@/utils/validation-schemas'
import { Form, Formik, FormikHelpers } from 'formik'
import { Camera, X } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function MemberModal({ isOpen, onClose, user }: MemberModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const isEditing = !!user

  const { data: rolesData } = useGetActiveRolesQuery()
  const roles = rolesData?.data || []

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    roleId: user?.roleId || '',
    isActive: user?.isActive ?? true,
    avatar: null as File | null,
    removeAvatar: false,
    isEditing,
  }

  // Returns true if any field differs from the saved user (always true when creating)
  const getIsDirty = (values: typeof initialValues) => {
    if (!isEditing) return true
    return (
      values.avatar !== null ||
      values.removeAvatar ||
      values.name !== (user?.name || '') ||
      values.email !== (user?.email || '') ||
      values.roleId !== (user?.roleId || '') ||
      values.isActive !== (user?.isActive ?? true) ||
      (values.password !== '' && values.password !== undefined)
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: FormikHelpers<typeof initialValues>['setFieldValue']) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      setFieldValue('avatar', file)
      setFieldValue('removeAvatar', false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      if (values.password) formData.append('password', values.password)
      formData.append('roleId', values.roleId)
      formData.append('isActive', String(values.isActive))

      if (values.avatar) {
        formData.append('avatar', values.avatar)
      } else if (values.removeAvatar) {
        formData.append('remove_avatar', 'true')
      }

      if (isEditing && user) {
        formData.append('id', user.id)
        const res = await updateUser(formData).unwrap()
        toast.success(res.message || t('user_updated_successfully'))
      } else {
        const res = await createUser(formData).unwrap()
        toast.success(res.message || t('user_created_successfully'))
      }
      onClose()
      setPreviewImage(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-xl! gap-0 max-w-[calc(100%-2rem)]! max-h-[90vh] sm:p-6 p-4 no-scrollbar overflow-auto border-none rounded-modal-radius shadow-2xl bg-white  dark:border-white/10">
        <DialogHeader className="pb-3 border-b mb-0 border-input-border-color">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-bold  text-title">{isEditing ? t("edit_member") : t("create_member")}</DialogTitle>
          </div>
        </DialogHeader>

        <Formik initialValues={initialValues} enableReinitialize validationSchema={userSchemas.create(t)} onSubmit={handleSubmit}>
          {({ setFieldValue, values }) => (
            <Form className="pt-3 space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="absolute inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all opacity-0 group-hover:opacity-100" />
                    <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 rounded-full relative z-10 transition-transform group-hover:scale-105">
                      {(() => {
                        const displayAvatar = values.removeAvatar ? null : (previewImage || (user?.avatar && user.avatar !== 'null' ? getMediaUrl(user.avatar) : null));
                        return (
                          <>
                            <AvatarImage src={displayAvatar || undefined} className="object-cover" />
                            <AvatarFallback className={cn("text-4xl font-bold text-white ", getAvatarColorClass(values.name))}>{values.name.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                          </>
                        )
                      })()}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 rtl:right-[unset] rtl:left-0 w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg z-20">
                      <Camera size={18} />
                    </div>
                  </div>
                  {(!values.removeAvatar && (previewImage || (user?.avatar && user.avatar !== 'null'))) && (
                    <div
                      className="absolute top-0 right-0 rtl:right-[unset] rtl:left-0 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg z-30 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewImage(null)
                        setFieldValue('avatar', null)
                        setFieldValue('removeAvatar', true)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      <X size={14} />
                    </div>
                  )}
                </div>
                <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} />
                <p className="text-sm font-bold text-title tracking-wide">{t("upload_image")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <TextInput name="name" label={t("name")} placeholder={t("enter_name")} className="rounded-radius border border-input-border-color h-10" />
                </div>
                <div className="space-y-1.5">
                  <TextInput name="email" label={t("email")} placeholder={t("enter_your_email")} className="rounded-radius border border-input-border-color h-10" />
                </div>
              </div>

              {user?.role !== "super_admin" && (
                <div className="space-y-1.5">
                  <SelectField
                    className="rounded-xl dark:bg-white/5 dark:border-white/10"
                    name="roleId"
                    label={t("role")}
                    placeholder={t("select_role")}
                    options={[
                      ...roles
                        .filter((r: Role) => r.name !== "super_admin")
                        .map((r: Role) => ({
                          label: t(r.name),
                          value: r._id,
                        })),
                    ]}
                    emptyStateTitle={t('no_roles_found', { defaultValue: 'No Roles Found' })}
                    emptyStateDescription={t('no_roles_desc', { defaultValue: 'Please create a role before assigning one.' })}
                    emptyStateActionLabel={t('add_role', { defaultValue: 'Add Role' })}
                    onEmptyStateAction={() => {
                      onClose()
                      router.push(ROUTES.PERMISSIONS)
                    }}
                  />
                </div>
              )}

              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <TextInput name="password" label={t("password")} type="password" placeholder={t("enter_password")} className="rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <TextInput name="confirmPassword" label={t("confirm_password")} type="password" placeholder={t("confirm_your_password")} className="rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-subcard border border-input-border-color transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-md font-bold text-gray-900 dark:text-white">
                    {t("active_status") || t('active_status')}
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t("member_status_description") || "Enable or disable this member access."}</p>
                </div>
                <Switch id="isActive" checked={values.isActive} onCheckedChange={(checked: boolean) => setFieldValue("isActive", checked)} className="data-[state=checked]:bg-primary" />
              </div>

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading || !getIsDirty(values)} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? t("save_changes") : t("create")}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
