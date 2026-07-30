'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useDeleteRestrictedWordMutation, useGetRestrictedWordsQuery } from '@/redux/api/restrictedWordsApi'
import { RestrictedWord } from '@/types/restricted-words'
import { Column } from '@/types/table'
import { format } from 'date-fns'
import { Edit2, Plus, ShieldAlert, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import RestrictedWordModal from './RestrictedWordModal'

export default function RestrictedWordsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<RestrictedWord | undefined>(undefined)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [wordToDelete, setWordToDelete] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const debouncedSearch = useDebounce(search, 500)

  const { data: response, isLoading, isFetching } = useGetRestrictedWordsQuery({ page, limit, search: debouncedSearch })
  const [deleteWord, { isLoading: isDeleting }] = useDeleteRestrictedWordMutation()

  const handleEdit = (word: RestrictedWord) => {
    setSelectedWord(word)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setWordToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!wordToDelete) return
    try {
      await deleteWord(wordToDelete).unwrap()
      toast.success(t('restricted_word_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setWordToDelete(null)
    } catch {
      toast.error(t('failed_to_delete_restricted_word'))
    }
  }

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'high': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{t('high') || 'High'}</Badge>
      case 'medium': return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-500">{t('medium') || 'Medium'}</Badge>
      case 'low': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">{t('low') || 'Low'}</Badge>
      default: return <Badge variant="outline" className="capitalize">{level}</Badge>
    }
  }

  const columns: Column<RestrictedWord>[] = [
    {
      header: t('text') || 'Text',
      className: "xl1580:min-w-[280px]",
      sortable: true,
      sortKey: 'word',
      cell: (row) => <span className="font-bold text-title text-base break-all whitespace-normal line-clamp-2">{row.word}</span>,
    },
    {
      header: t('priority_level') || 'Priority Level',
      className: "xl1580:min-w-[180px]",
      sortable: true,
      sortKey: 'severity_level',
      cell: (row) => getSeverityBadge(row.severity_level),
    },
    {
      header: t('status') || 'Status',
      className: "xl1580:min-w-[110px]",
      sortable: true,
      sortKey: 'is_active',
      cell: (row) => (
        <Badge variant="outline" className={row.is_active ? "bg-edit/10 text-edit border-edit/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"}>
          {row.is_active ? t('active') : t('inactive')}
        </Badge>
      ),
    },
    {
      header: t('created_at') || 'Created At',
      className: "xl1580:min-w-[150px]",
      sortable: true,
      sortKey: 'created_at',
      cell: (row) => <span className="text-md text-title font-semibold">{row.created_at ? format(new Date(row.created_at), 'MMM dd, yyyy') : '-'}</span>,
    },
    {
      header: t('action') || 'Action',
      className: "xl1580:min-w-[100px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-9 w-9 text-edit bg-edit/10 hover:bg-edit hover:text-white transition-colors">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row._id || row.id)} className="h-9 w-9 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-colors">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredData = useMemo(() => {
    return response?.data || []
  }, [response?.data])

  // Reset page when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 0)
    return () => clearTimeout(timer)
  }, [debouncedSearch])

  return (
    <>
      <TableLayout
        title={t('restricted_words') || 'Restricted Words'}
        headerIcon={<ShieldAlert className="w-8 h-8 text-primary" />}
        columns={columns}
        data={filteredData}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_restricted_words') || 'Search restricted words...'}
        emptyStateTitle={t("no_restricted_words_found") || 'No Restricted Words Found'}
        emptyMessage={t("no_restricted_words_desc") || 'Add restricted words to filter and monitor call transcripts.'}
        showBackButton={false}
        totalResults={response?.pagination?.total || filteredData.length}
        currentPage={response?.pagination?.page || page}
        totalPages={response?.pagination?.totalPages || Math.ceil(filteredData.length / limit)}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
        filters={
          <div className="flex items-center gap-2">
            <Button onClick={() => { setSelectedWord(undefined); setIsModalOpen(true); }} className="gap-2 h-11 p-padding! text-md font-semibold rounded-lg bg-primary text-white">
              <Plus className="w-5 h-5" />
              {t('create_restricted_word') || 'Create Restricted Word'}
            </Button>
          </div>
        }
      />

      <RestrictedWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wordToEdit={selectedWord}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('delete_restricted_word')}
        description={t('confirm_delete_restricted_word')}
        isLoading={isDeleting}
      />
    </>
  )
}
