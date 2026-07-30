'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from "@/components/reusable/data-view"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { PERMISSIONS } from "@/constants/permissions"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { usePermission } from "@/hooks/usePermission"
import {
  useCreateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
  useGetSmsTemplatesQuery,
  useUpdateSmsTemplateMutation,
} from "@/redux/api/smsTemplateApi"
import { ApiError } from "@/types/api"
import { MessageSquare, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { SmsTemplateItem } from "./SmsTemplateItem"
import { SmsTemplateModal } from "./SmsTemplateModal"

export const SmsTemplateTab = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_SMS_TEMPLATES)
  const canCreate = hasPermission(PERMISSIONS.CREATE_SMS_TEMPLATES)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SMS_TEMPLATES)
  const canDelete = hasPermission(PERMISSIONS.DELETE_SMS_TEMPLATES)

  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const debouncedSearch = useDebounce(search, 500)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const { data: response, isLoading } = useGetSmsTemplatesQuery(
    { search: debouncedSearch },
    { skip: !canView }
  )

  const [createSmsTemplate, { isLoading: isCreating }] = useCreateSmsTemplateMutation()
  const [updateSmsTemplate, { isLoading: isUpdating }] = useUpdateSmsTemplateMutation()
  const [deleteSmsTemplate, { isLoading: isDeleting }] = useDeleteSmsTemplateMutation()

  const smsTemplates = Array.isArray(response) ? response : (response?.data || response?.smsTemplates || response?.templates || [])
  const totalResults = response?.total || smsTemplates.length

  const paginatedTemplates = useMemo(() => {
    const startIndex = (page - 1) * limit
    return smsTemplates.slice(startIndex, startIndex + limit)
  }, [smsTemplates, page, limit])

  const handleCreateOpen = () => {
    setSelectedTemplate(null)
    setIsModalOpen(true)
  }

  const handleEditOpen = (template: any) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  const handleDeleteOpen = (id: string) => {
    setTemplateToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (data: any) => {
    try {
      if (selectedTemplate) {
        const id = selectedTemplate.id || selectedTemplate._id
        await updateSmsTemplate({ id, data }).unwrap()
        toast.success(t("sms_template_updated_successfully"))
      } else {
        await createSmsTemplate(data).unwrap()
        toast.success(t("sms_template_created_successfully"))
      }
      setIsModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  const handleStatusToggle = async (template: any) => {
    try {
      const id = template.id || template._id
      const newStatus = template.status === 'active' ? 'inactive' : 'active'
      await updateSmsTemplate({
        id,
        data: {
          name: template.name,
          description: template.description || '',
          content: template.content,
          status: newStatus,
        },
      }).unwrap()
      toast.success(t("status_updated_successfully"))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("failed_to_update_status"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return
    try {
      await deleteSmsTemplate(templateToDelete).unwrap()
      toast.success(t("sms_template_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setTemplateToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        {t("no_permission_to_view")}
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      <div className="pb-6">
        <PageHeader
          title={t("sms_templates")}
          showBackButton={false}
          onBack={() => router.push(ROUTES.ATTRIBUTE)}
          icon={<MessageSquare className="w-8 h-8 text-primary" />}
          primaryAction={
            canCreate ? {
              label: t("create_sms_template"),
              onClick: handleCreateOpen,
              icon: <Plus className="w-5 h-5" />,
              className: "bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding"
            } : undefined
          }
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t("search_sms_templates")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DataViewLayout<any>
        items={paginatedTemplates}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<MessageSquare className="w-8 h-8 text-primary" />}
            title={t("no_sms_templates_found")}
            description={t("no_sms_templates_description")}
            actionLabel={t("create_sms_template")}
            onAction={canCreate ? handleCreateOpen : undefined}
          />
        }
        renderListItem={(template, index) => (
          <SmsTemplateItem
            key={template.id || template._id}
            template={template}
            viewMode="list"
            isLastItem={index === paginatedTemplates.length - 1}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
          />
        )}
        renderGridItem={(template) => (
          <SmsTemplateItem
            key={template.id || template._id}
            template={template}
            viewMode="grid"
            canUpdate={canUpdate}
            canDelete={canDelete}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
          />
        )}
      />

      <DataViewPagination
        currentPage={page}
        totalItems={totalResults}
        itemsPerPage={limit}
        onPageChange={setPage}
      />

      <SmsTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        smsTemplate={selectedTemplate}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_sms_template")}
        description={t("delete_sms_template_desc")}
      />
    </div>
  )
}
