'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { StatusSwitch } from '@/components/reusable/StatusSwitch'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import {
  useDeleteLanguagesMutation,
  useGetLanguagesQuery,
  useUpdateLanguageStatusMutation,
} from '@/redux/api/languageApi'
import { ApiError } from '@/types/api'
import { Language } from '@/types/language'
import { BookOpen, Globe, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const LanguagesView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_LANGUAGES)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useGetLanguagesQuery({ page, limit, search })
  const [updateLanguageStatus] = useUpdateLanguageStatusMutation()
  const [deleteLanguages, { isLoading: isDeleting }] = useDeleteLanguagesMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [langToDelete, setLangToDelete] = useState<string | null>(null)

  const handleStatusChange = useCallback(
    async (lang: Language) => {
      try {
        await updateLanguageStatus({ id: lang.id || (lang as any)._id }).unwrap()
        toast.success(t('status_updated_successfully'))
        await refetch()
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('failed_to_update_status'))
      }
    },
    [updateLanguageStatus, t, refetch],
  )

  const handleDeleteClick = (id: string) => {
    setLangToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!langToDelete) return
    try {
      await deleteLanguages({ ids: [langToDelete] }).unwrap()
      toast.success(t('language_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setLangToDelete(null)
      refetch()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const columns: Column<Language>[] = [
    {
      header: t("flag"),
      accessorKey: "flag",
      className: "w-[100px] lg991:min-w-[130px]",
      cell: (row: Language) => {
        const flagPath = row.flag || "";
        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";
        const flagUrl = flagPath.startsWith("http") ? flagPath : flagPath ? `${storageUrl.replace(/\/$/, "")}/${flagPath.replace(/^\//, "")}` : null;

        return <div className="group/flag relative h-10 w-10 rounded-radius bg-primary/10 dark:from-white/5 dark:to-white/10 border border-zinc-200/50 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">{flagUrl ? <Image width={24} height={24} src={flagUrl} alt={row.name} unoptimized className="w-5 h-4 object-cover inline-block" /> : <Globe className="h-5 w-5 text-primary" />}</div>;
      },
    },
    {
      header: t("name"),
      className: "lg991:min-w-[140px]",
      accessorKey: "name",
      sortable: true,
      cell: (row: Language) => <span className="font-medium text-base tracking-tight text-title">{row.name}</span>,
    },
    {
      header: t("locale"),
      className: "lg991:min-w-[120px]",
      accessorKey: "locale",
      cell: (row: Language) => <code className="px-2.5 py-1 bg-primary/10 dark:bg-white/5 border border-primary/20 rounded-radius text-xs font-bold text-primary">{row.locale}</code>,
    },
    {
      header: t("rtl"),
      className: "lg991:min-w-[110px]",
      accessorKey: "is_rtl",
      cell: (row: Language) => (
        <Badge variant={row.is_rtl ? "secondary" : "outline"} className="rounded-radius bg-card-color px-3 py-1 text-sm font-bold border-primary/10">
          {row.is_rtl ? t("yes") : t("no")}
        </Badge>
      ),
    },
    {
      header: t("status"),
      className: "lg991:min-w-[110px]",
      accessorKey: "is_active",
      cell: (row: Language) => <StatusSwitch isActive={row.is_active} disabled={row.is_default || false} canManage={canManage} onToggle={() => handleStatusChange(row)} />,
    },
    {
      header: t("actions"),
      className: "text-right min-w-[150px] lg991:min-w-[180px]",
      cell: (row: Language) => (
        <div className="flex items-center justify-start gap-2.5">
          <Button variant="ghost" size="icon" className="text-primary h-9 w-9 bg-primary/10 hover:bg-primary hover:text-white rounded-radius transition-all duration-300" onClick={() => router.push(`/languages/${row.id || (row as any)._id}/translations`)} title={t("manage_translations")}>
            <BookOpen className="h-4.5 w-4.5" />
          </Button>

          {canManage && (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all" onClick={() => router.push(`/languages/${row.id || (row as any)._id}/edit`)} title={t("edit")}>
                <Pencil className="h-4.5 w-4.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all" disabled={row.is_default || isDeleting} onClick={() => handleDeleteClick(row.id || (row as any)._id)} title={t("delete")}>
                <Trash2 className="h-4.5 w-4.5" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('delete_language')}
        description={t('confirm_delete_language')}
        isLoading={isDeleting}
      />
      <TableLayout
        title={t('languages')}
        showBackButton={false}
        primaryAction={
          canManage
            ? {
              label: t('create_language'),
              onClick: () => router.push(ROUTES.LANGUAGES_NEW),
              icon: <Plus className="w-5 h-5" />,
            }
            : undefined
        }
        columns={columns}
        data={data?.data?.languages || []}
        currentPage={page}
        totalPages={data?.data?.pagination?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_languages_title", "No Languages Found")}
        emptyMessage={t("no_languages_desc", "Add supported languages to expand your global reach.")}
        emptyStateActionLabel={t('create_language')}
        onEmptyStateAction={canManage ? () => router.push(ROUTES.LANGUAGES_NEW) : undefined}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_languages')}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
      />
    </>
  )
}
