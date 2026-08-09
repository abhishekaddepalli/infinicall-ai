export interface Category {
  _id: string
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  status: boolean
  parent_id?: string | Category
  children?: Category[]
  created_at: string
  updated_at: string
}

export interface Tag {
  _id: string
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Blog {
  _id: string
  id: string
  title: string
  slug: string
  description: string
  content: string
  thumbnail?: string
  meta_title?: string
  meta_description?: string
  meta_image?: string
  categories: string[] | Category[]
  tags: string[] | Tag[]
  status: boolean
  created_at: string
  updated_at: string
}

export interface BlogResponse {
  blogs: Blog[]
  totalPages: number
  currentPage: number
  total: number
}

export interface BlogCardProps {
  blog: Blog
  onEdit: (blog: Blog) => void
  onDelete: (id: string) => void
  onClick: (blog: Blog) => void
}

export interface BlogFormProps {
  blog: Blog | null
  onClose: () => void
}

export interface BlogDetailsProps {
  blog: Blog
  allBlogs: Blog[]
  onClose: () => void
  onNavigate: (blog: Blog) => void
}

export interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
}

export interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  tag?: Tag | null
}

export interface BlogHeaderProps {
  blog: Blog
}

export interface BlogNavigationProps {
  prevBlog: Blog | null
  nextBlog: Blog | null
  onNavigate: (blog: Blog) => void
}
export interface BlogSidebarDetailsProps {
  recentBlogs: Blog[]
  onNavigate: (blog: Blog) => void
  onClose: () => void
}

export interface BlogFormValues {
  title: string
  slug: string
  description: string
  content: string
  thumbnail: File | null
  meta_image: File | null
  categories: string[]
  tags: string[]
  status: boolean
  meta_title: string
  meta_description: string
}

export interface BlogGeneralInfoProps {
  setFieldValue: (field: string, value: unknown) => void
  values: BlogFormValues
  isEditing: boolean
  errors?: any
  touched?: any
}

export interface BlogSidebarProps {
  values: BlogFormValues
  setFieldValue: (field: string, value: unknown) => void
  touched: any
  errors: any
  categories: Category[]
  tags: Tag[]
  thumbnailUrl: string | null
  setThumbnailUrl: (url: string | null) => void
  uploadAttachment?: (file: File) => Promise<{ url: string }> | unknown
  isUploading?: boolean
  isLoading: boolean
  isEditing: boolean
  onClose: () => void
}

export interface BlogSEOInfoProps {
  setFieldValue: (field: string, value: unknown) => void
  values: BlogFormValues
  metaImageUrl: string | null
  setMetaImageUrl: (url: string | null) => void
}

export type Props = {
  params: Promise<{ id: string }>
}