import { ReactNode } from "react"

export interface Testimonial {
    _id?: string
    id?: string
    title: string
    description: string
    status: boolean
    rating: number
    user_name: string
    user_post: string
    user_image: string | null
    created_at?: string
    updated_at?: string
}

export interface TestimonialResponse {
    message: string
    testimonials: Testimonial[]
    total: number
    totalPages: number
    page: number
    limit: number
}

export interface TestimonialCardProps {
    testimonial: Testimonial
    onEdit: (testimonial: Testimonial) => void
    onDelete: (testimonial: Testimonial) => void
    onToggleStatus: (testimonial: Testimonial) => void
}

export interface TestimonialFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: FormData) => Promise<void>
    testimonial?: Testimonial | null
    isLoading?: boolean
}

export interface DataCardGridProps<T> {
    data: T[]
    renderCard: (item: T) => ReactNode
    currentPage?: number
    totalPages?: number
    totalResults?: number
    onPageChange?: (page: number) => void
    isLoading?: boolean
    emptyMessage?: string
    emptyStateTitle?: string
    emptyStateActionLabel?: string
    onEmptyStateAction?: () => void
    onRowsPerPageChange?: (limit: number) => void
    rowsPerPage?: number
    searchValue?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string
    gridClassName?: string
}