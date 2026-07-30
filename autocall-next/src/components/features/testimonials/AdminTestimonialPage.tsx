'use client'

import { DataCardGrid } from "@/components/reusable/DataCardGrid"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { useDebounce } from "@/hooks/useDebounce"
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialsMutation,
  useGetTestimonialsQuery,
  useUpdateTestimonialMutation,
  useUpdateTestimonialStatusMutation,
} from "@/redux/api/testimonialApi"
import { Testimonial } from "@/types/testimonial"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import TestimonialCard from "./TestimonialCard"
import TestimonialFormModal from "./TestimonialFormModal"

const AdminTestimonialPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [sortColumn] = useState("created_at")
  const [sortOrder] = useState<"asc" | "desc">("desc")

  const debouncedSearch = useDebounce(search, 500)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null)

  const { data: response, isLoading } = useGetTestimonialsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation()
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation()
  const [updateStatus] = useUpdateTestimonialStatusMutation()
  const [deleteTestimonials, { isLoading: isDeleting }] = useDeleteTestimonialsMutation()

  const testimonials = response?.testimonials || []
  const totalPages = response?.totalPages || 0
  const totalResults = response?.total || 0

  const handleCreateOpen = () => {
    setSelectedTestimonial(null)
    setIsFormModalOpen(true)
  }

  const handleEditOpen = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsFormModalOpen(true)
  }

  const handleDeleteOpen = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial._id || testimonial.id || null)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedTestimonial) {
        await updateTestimonial({
          id: selectedTestimonial._id || selectedTestimonial.id || "",
          data: formData,
        }).unwrap()
        toast.success(t("testimonial_updated_successfully"))
      } else {
        await createTestimonial(formData).unwrap()
        toast.success(t("testimonial_created_successfully"))
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return
    try {
      await deleteTestimonials({ ids: [testimonialToDelete] }).unwrap()
      toast.success(t("testimonial_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setTestimonialToDelete(null)
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  const handleToggleStatus = async (testimonial: Testimonial) => {
    try {
      await updateStatus({
        id: testimonial._id || testimonial.id || "",
        status: !testimonial.status,
      }).unwrap()
      toast.success(t("status_updated_successfully"))
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("testimonials_management")}
        primaryAction={{
          label: t("create_testimonial"),
          onClick: handleCreateOpen,
          icon: <Plus className="w-5 h-5 mr-1 rtl:mr-0 rtl:ml-1" strokeWidth={2.5} />,
          className: 'bg-primary text-white font-bold transition-all duration-300 rounded-radius p-padding  ',
        }}
        showBackButton={false}
      />

      <DataCardGrid
        data={testimonials}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        rowsPerPage={limit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_testimonials")}
        emptyStateTitle={t("no_testimonials_title", "No Testimonials Found")}
        emptyMessage={t("no_testimonials_desc", "Add user reviews and success stories to build trust.")}
        emptyStateActionLabel={t("create_testimonial")}
        onEmptyStateAction={handleCreateOpen}
        renderCard={(testimonial) => (
          <TestimonialCard
            testimonial={testimonial}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
            onToggleStatus={handleToggleStatus}
          />
        )}

      />

      <TestimonialFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        testimonial={selectedTestimonial}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_testimonial_title")}
        description={t("delete_testimonial_desc")}
      />
    </div>
  )
}

export default AdminTestimonialPage
