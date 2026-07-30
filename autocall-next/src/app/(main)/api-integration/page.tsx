"use client";

import { ApiKeyRawDisplayModal } from "@/components/features/api-integration/ApiKeyRawDisplayModal";
import { ApiKeyRegenerateModal } from "@/components/features/api-integration/ApiKeyRegenerateModal";
import { ApiKeyViewModal } from "@/components/features/api-integration/ApiKeyViewModal";
import { Column } from "@/components/reusable/DataTable";
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal";
import { TableLayout } from "@/components/reusable/TableLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PERMISSIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import { usePermission } from "@/hooks/usePermission";
import { useDeleteApiKeyMutation, useGetApiKeysQuery, useRegenerateApiKeyMutation, useUpdateApiKeyStatusMutation } from "@/redux/api/apiKeyApi";
import { ApiError } from "@/types/api";
import { ApiKey } from "@/types/api-key";
import { formatDate } from "@/utils/validation-schemas";
import { BookOpen, Eye, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function ApiIntegrationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { hasPermission, isAdmin } = usePermission();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isUserAdmin = isAdmin();

  const canCreate = hasPermission(PERMISSIONS.CREATE_API_KEY);
  const canUpdateStatus = hasPermission(PERMISSIONS.UPDATE_STATUS_API_KEY);
  const canRegenerate = hasPermission(PERMISSIONS.REGENERATE_API_KEY);
  const canDelete = hasPermission(PERMISSIONS.DELETE_API_KEY);

  const { data, isLoading } = useGetApiKeysQuery({
    page,
    limit,
    search: debouncedSearch,
    self: !isUserAdmin,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const [updateStatus] = useUpdateApiKeyStatusMutation();
  const [deleteApiKey, { isLoading: isDeleting }] = useDeleteApiKeyMutation();
  const [regenerateApiKey, { isLoading: isRegenerating }] = useRegenerateApiKeyMutation();

  // Key display dialog state
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirm delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Confirm regenerate dialog state
  const [regenerateId, setRegenerateId] = useState<string | null>(null);

  // View modal state
  const [viewId, setViewId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      const res = await updateStatus({ id, is_active: !currentStatus }).unwrap();
      toast.success(res.message || t("status_updated_successfully"));
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t("failed_to_update_status"));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteApiKey(deleteId).unwrap();
      toast.success(res.message || t("api_key_deleted_successfully"));
      setDeleteId(null);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t("failed_to_delete_api_key"));
    }
  };

  const handleRegenerate = (id: string) => {
    setRegenerateId(id);
  };

  const confirmRegenerate = async () => {
    if (!regenerateId) return;
    try {
      const res = await regenerateApiKey(regenerateId).unwrap();
      if (res.data?.raw_key) {
        setNewRawKey(res.data.raw_key);
        setIsModalOpen(true);
      }
      toast.success(res.message || t("api_key_regenerated_successfully"));
      setRegenerateId(null);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t("failed_to_regenerate_api_key"));
    }
  };

  const handleView = (id: string) => {
    setViewId(id);
  };

  const columns: Column<ApiKey>[] = [
    {
      header: t("name"),
      accessorKey: "name",
      className: "font-semibold text-md text-primary dark:text-white w-[25%] xl1680:min-w-[265px]",
      sortable: true,
      cell: (row) => <span className="font-semibold text-md text-title break-all whitespace-normal line-clamp-2">{row.name}</span>,
    },
    {
      header: t("permissions"),
      accessorKey: "permissions",
      className: "w-[30%] xl1680:min-w-[360px]",
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {row.permissions && row.permissions.length > 0 ? (
            row.permissions.slice(0, 3).map((perm) => (
              <span key={perm.id} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                {perm.slug ? perm.slug.replace(/\./g, ": ") : perm.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{t("no_permissions")}</span>
          )}
          {row.permissions && row.permissions.length > 3 && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-bold">+{row.permissions.length - 3}</span>}
        </div>
      ),
    },
    {
      header: t("status"),
      accessorKey: "is_active",
      sortable: true,
      cell: (row) => <div className="flex items-center gap-3">{canUpdateStatus ? <Switch checked={row.is_active} onCheckedChange={() => handleStatusChange(row.id, row.is_active)} className="shadow-sm bg-switch-background dark:bg-switch-background" /> : <Switch checked={row.is_active} disabled />}</div>,
      className: "w-[15%] xl1680:min-w-[150px]",
    },
    {
      header: t("last_used"),
      accessorKey: "last_used_at",
      sortable: true,
      className: "w-[15%] xl1680:min-w-[180px]",
      cell: (row) => <span className="text-subtitle-color font-bold text-md">{row.last_used_at ? formatDate(row.last_used_at) : t("never")}</span>,
    },
    {
      header: t("created_at"),
      accessorKey: "created_at",
      sortable: true,
      className: "w-[15%] xl1680:min-w-[150px]",
      cell: (row) => <span className="text-subtitle-color font-medium text-md">{formatDate(row.created_at)}</span>,
    },
    {
      header: t("actions"),
      className: " w-[15%] xl1680:min-w-[180px]",
      cell: (row) => (
        <div className="flex items-center justify-start gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-radius bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => handleView(row.id)} title={t("view")}>
            <Eye className="h-4 w-4" />
          </Button>

          {canRegenerate || canDelete ? (
            <>
              {canRegenerate && (
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-radius bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => handleRegenerate(row.id)} title={t("regenerate")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all" onClick={() => handleDelete(row.id)} title={t("delete")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground/30 font-extrabold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg">{t("view_only")}</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <TableLayout
        title={t("api_integration")}
        subtitle={t("api_integration_subtitle")}
        headerIcon={<Key className="h-6 w-6 text-primary" />}
        endContent={
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" onClick={() => router.push(ROUTES.API_DOCUMENTATION)} className="gap-2 border-input-border-color bg-primary/10  hover:bg-primary hover:text-white group text-primary font-medium rounded-radius">
              <BookOpen className="h-5 w-5 group-hover:text-white" />
              <span>{t("view_documentation")}</span>
            </Button>
            {canCreate && (
              <Button onClick={() => router.push(ROUTES.API_INTEGRATION_CREATE)} className="bg-primary hover:bg-primary/95 text-white font-medium rounded-radius gap-2 px-6 shadow-sm shadow-primary/20">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                <span>{t("create_api_key")}</span>
              </Button>
            )}
          </div>
        }
        columns={columns}
        data={data?.apiKeys || []}
        totalResults={data?.pagination?.total || 0}
        currentPage={data?.pagination?.page || 1}
        totalPages={data?.pagination?.pages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_api_keys_title", "No API Keys Found")}
        emptyMessage={t("no_api_keys_desc", "Generate secure keys to authenticate external applications.")}
        emptyStateActionLabel={t("create_api_key")}
        onEmptyStateAction={canCreate ? () => router.push(ROUTES.API_INTEGRATION_CREATE) : undefined}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_api_keys")}
        showBackButton={false}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title={t("delete_api_key_title")} description={t("delete_api_key_desc")} isLoading={isDeleting} />

      <ApiKeyRegenerateModal isOpen={!!regenerateId} onClose={() => setRegenerateId(null)} onConfirm={confirmRegenerate} isRegenerating={isRegenerating} />

      <ApiKeyViewModal viewId={viewId} onClose={() => setViewId(null)} />

      <ApiKeyRawDisplayModal
        isOpen={isModalOpen}
        onClose={(open) => {
          if (open === false) {
            setIsModalOpen(false);
            setTimeout(() => {
              setNewRawKey(null);
            }, 300);
          }
        }}
        newRawKey={newRawKey}
      />
    </>
  );
}
