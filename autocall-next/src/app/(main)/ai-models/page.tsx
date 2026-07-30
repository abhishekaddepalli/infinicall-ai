'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteAiModelMutation, useGetAiModelsQuery, useUpdateAiModelMutation } from '@/redux/api/aiModelApi'
import { AIModel } from '@/types/ai-modal'
import { ApiError } from '@/types/api'
import { formatDate } from '@/utils/validation-schemas'
import { BadgeCheck, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function AIModelsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canManage = hasPermission(PERMISSIONS.UPDATE_SETTINGS) 
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: modelsData, isLoading } = useGetAiModelsQuery()
  const [deleteModel, { isLoading: isDeleting }] = useDeleteAiModelMutation()
  const [updateModel] = useUpdateAiModelMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    router.push(`/ai-models/${id}/edit`)
  }

  const handleCreate = () => {
    router.push(ROUTES.AI_MODAL_CREATE)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteModel(idToDelete).unwrap()
      toast.success(res.message || t('ai_model_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_ai_model'))
    }
  }

  const handleStatusChange = async (id: string, currentStatus: string) => {
    try {                             
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const res = await updateModel({ id, body: { status: newStatus } }).unwrap()
      toast.success(res.message || t('status_updated_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  // Client-side search, sorting and pagination for instant feel
  const processedModels = useMemo(() => {
    const rawList = modelsData?.data || []

    // Filter
    let list = rawList.filter((model) => {
      const searchStr = `${model.name} ${model.display_name} ${model.provider} ${model.model_id}`.toLowerCase()
      return searchStr.includes(search.toLowerCase())
    })

    // Sort
    list = [...list].sort((a: any, b: any) => {
      const valA = a[sortColumn]
      const valB = b[sortColumn]

      if (valA === undefined) return 1
      if (valB === undefined) return -1

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      } else {
        return sortOrder === 'asc'
          ? (valA > valB ? 1 : -1)
          : (valB > valA ? 1 : -1)
      }
    })

    return list
  }, [modelsData, search, sortColumn, sortOrder])

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit
    return processedModels.slice(startIndex, startIndex + limit)
  }, [processedModels, page, limit])

  const columns: Column<AIModel>[] = [
    {
      header: t('display_name'),
      accessorKey: 'display_name',
      sortable: true,
      className: 'font-semibold text-title-color dark:text-white w-[25%] lg991:min-w-[275px]',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-title flex items-center gap-1.5">
            {row.display_name}
            {row.is_default && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <BadgeCheck className="w-3 h-3" />
                {t('default')}
              </span>
            )}
          </span>
        </div>
      ),
    },
    {
      header: t('provider'),
      accessorKey: 'provider',
      sortable: true,
      className: 'w-[15%]  lg991:min-w-[190px]',
      cell: (row) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-radius bg-primary/5 text-primary border-input-border-color">
          {row.provider}
        </span>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      className: 'w-[15%] lg991:min-w-[150px]',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {canManage ? (
            <Switch
              checked={row.status === 'active'}
              onCheckedChange={() => handleStatusChange(row.id, row.status)}
              className="shadow-sm bg-switch-background dark:bg-switch-background"
            />
          ) : (
            <Switch checked={row.status === 'active'} disabled />
          )}
        </div>
      ),
    },
    {
      header: t('last_updated'),
      accessorKey: 'updated_at',
      sortable: true,
      className: 'w-[15%] lg991:min-w-[190px]',
      cell: (row) => (
        <span className="text-title/80 font-bold text-sm">
          {formatDate(row.updated_at)}
        </span>
      ),
    },
    {
      header: t('actions'),
      className: 'w-[10%] lg991:min-w-[190px]',
      cell: (row) => (
        <div className="flex items-center justify-start gap-3">
          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
                onClick={() => handleEdit(row.id)}
                title={t('edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                onClick={() => handleDelete(row.id)}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground/30 font-extrabold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg">
              {t('view_only')}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t('ai_models_title')}
        primaryAction={
          canManage
            ? {
              label: t('create_ai_model'),
              onClick: handleCreate,
              icon: <Plus className="h-5 w-5 mr-1" strokeWidth={2.5} />,
              className: 'bg-primary text-white font-bold transition-all duration-300 rounded-radius p-padding! h-12',
            }
            : undefined
        }
        columns={columns}
        data={paginatedData}
        totalResults={processedModels.length}
        currentPage={page}
        totalPages={Math.ceil(processedModels.length / limit)}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_ai_models_title", "No AI Models Found")}
        emptyMessage={t("no_ai_models_desc", "Connect and configure AI models to power your automated assistants.")}
        emptyStateActionLabel={t('create_ai_model')}
        onEmptyStateAction={canManage ? handleCreate : undefined}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={false}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_ai_models')}
        showBackButton={false}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_ai_model_title')}
        description={t('delete_ai_model_desc')}
        isLoading={isDeleting}
      />
    </>
  )
}
