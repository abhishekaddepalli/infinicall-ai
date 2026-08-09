"use client";

import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal";
import { PageHeader } from "@/components/reusable/PageHeader";
import Spinner from '@/components/reusable/Spinner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { useGetConnectionsQuery } from "@/redux/api/whatsappApi";
import { useDeleteTemplateMutation, useGetTemplatesQuery, useSyncTemplatesStatusMutation } from "@/redux/api/whatsappTemplateApi";
import { WABAConnection, WhatsAppTemplate } from "@/types/waba";
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { SyncTemplatesModal } from "./SyncTemplatesModal";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
;

export default function WhatsAppTemplatesPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedWabaId, setSelectedWabaId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // 1. Fetch WABA connections
  const { data: connectionsResponse, isLoading: isLoadingWabas } = useGetConnectionsQuery();
  const connections: WABAConnection[] = useMemo(() => connectionsResponse?.data || [], [connectionsResponse]);

  // Select the first WABA connection as default
  useEffect(() => {
    if (connections.length > 0 && !selectedWabaId) {
      const timer = setTimeout(() => {
        setSelectedWabaId(connections[0]._id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [connections, selectedWabaId]);

  // 2. Fetch templates for selected WABA (passing status filter payload for call API)
  const {
    data: templatesResponse,
    isLoading: isLoadingTemplates,
    refetch,
  } = useGetTemplatesQuery(
    {
      waba_id: selectedWabaId,
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    { skip: !selectedWabaId }
  );

  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();
  const [syncStatus, { isLoading: isSyncingStatus }] = useSyncTemplatesStatusMutation();

  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<WhatsAppTemplate | null>(null);

  const templates: WhatsAppTemplate[] = useMemo(() => templatesResponse?.data || [], [templatesResponse]);

  // Filter templates locally by search query
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const name = template.template_name?.toLowerCase() || "";
      const body = template.message_body?.toLowerCase() || "";
      const query = search.toLowerCase();
      return name.includes(query) || body.includes(query);
    });
  }, [templates, search]);

  // Paginated templates
  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredTemplates.slice(start, start + limit);
  }, [filteredTemplates, page, limit]);

  const totalResults = filteredTemplates.length;
  const totalPages = Math.ceil(totalResults / limit);

  // Reset pagination when filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleEdit = (template: WhatsAppTemplate) => {
    router.push(`${ROUTES.WHATSAPP_TEMPLATES}/edit/${template._id}`);
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteTemplate(idToDelete).unwrap();
      toast.success(t("whatsapp_template_deleted_successfully"));
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_whatsapp_template"));
    }
  };

  const handleSyncStatus = async () => {
    if (!selectedWabaId) return;
    try {
      await syncStatus({ waba_id: selectedWabaId }).unwrap();
      toast.success(t("template_statuses_synced_successfully"));
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_sync_statuses"));
    }
  };

  // If WABA is loading, show standard spinner
  if (isLoadingWabas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Spinner />
      </div>
    );
  }

  // If WABA Connections are empty, show beautifully styled required message
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center sm:p-6 p-4 max-w-lg max-h-lg mx-auto my-auto text-center space-y-6 bg-bg-card border border-input-border-color rounded-radius">
        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-title-color">{t("waba_connection_required")}</h2>
          <p className="text-md text-subtitle-color leading-relaxed">
            {t("waba_required_description", {
              defaultValue: "To manage and create WhatsApp message templates, you first need to connect a WhatsApp Business Account (WABA) to this workspace.",
            })}
          </p>
        </div>
        <Button onClick={() => router.push(ROUTES.WHATSAPP_CONNECT)} className=" bg-primary cursor-pointer text-white font-medium rounded-radius transition-all p-padding">
          {t("go_to_connections")}
        </Button>
      </div>
    );
  }

  const selectedWaba = connections.find((c) => c._id === selectedWabaId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("whatsapp_templates_title")}
        showBackButton={false}
        endContent={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* WABA Dropdown */}
            <Select value={selectedWabaId} onValueChange={(val) => setSelectedWabaId(val)}>
              <SelectTrigger className="h-10 w-full sm:w-56 border-input-border-color rounded-radius bg-card-color font-bold transition-all focus:ring-1 focus:ring-primary/50 text-xs shadow-xs">
                <span className="truncate">{selectedWaba ? selectedWaba.name : t("select_waba_connection")}</span>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                {connections.map((conn) => (
                  <SelectItem key={conn._id} value={conn._id} className="font-bold text-xs">
                    {conn.name} ({conn.whatsapp_business_account_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Action Ribbon Buttons */}
            <div className="flex items-center flex-wrap gap-2 justify-end w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" disabled={isLoadingTemplates || !selectedWabaId} onClick={() => setIsSyncModalOpen(true)} className="h-12 p-padding! bg-primary/10 border-input-border-color text-primary rounded-lg font-bold transition-all hover:bg-primary hover:text-white text-xs shrink-0 flex-1 sm:flex-none px-2!">
                  <RefreshCw className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                  <span className="truncate">{t("sync_templates")}</span>
                </Button>
                <Button variant="outline" disabled={isSyncingStatus || isLoadingTemplates} onClick={handleSyncStatus} className="h-12 p-padding! bg-primary/10 border-input-border-color text-primary rounded-lg font-bold transition-all hover:bg-primary hover:text-white text-xs shrink-0 flex-1 sm:flex-none px-2!">
                  <RefreshCw className={`w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 shrink-0 ${isSyncingStatus ? "animate-spin" : ""}`} />
                  <span className="truncate">{t("sync_status")}</span>
                </Button>
              </div>

              <Button onClick={() => router.push(`${ROUTES.WHATSAPP_TEMPLATES}/create`)} className="bg-primary text-white font-bold rounded-radius h-12 p-padding! text-xs gap-1.5 shrink-0 w-full sm:w-auto">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                {t("add_template")}
              </Button>
            </div>
          </div>
        }
      />

      {/* Standard Search and Filter Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white pointer-events-none z-10" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_templates")} className="pl-11 h-11 w-full rounded-lg border border-input-border-color! bg-input-color font-semibold text-xs transition-all focus:border-primary! focus-visible:ring-1 focus-visible:ring-primary/50" />
        </div>

        {/* Status Filter Dropdown */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-12 w-48 border-none rounded-radius bg-primary/10 font-bold transition-all focus:ring-1 focus:ring-primary/50 text-xs">
            <span className="truncate">{statusFilter === "all" ? t("all_status") : t(`${statusFilter}_status`, { defaultValue: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) })}</span>
          </SelectTrigger>
          <SelectContent className="rounded-radius border-input-border-color dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
            <SelectItem value="all" className="font-bold text-xs">
              {t("all_status")}
            </SelectItem>
            <SelectItem value="approved" className="font-bold text-xs">
              {t("approved_status")}
            </SelectItem>
            <SelectItem value="pending" className="font-bold text-xs">
              {t("pending_status")}
            </SelectItem>
            <SelectItem value="rejected" className="font-bold text-xs">
              {t("rejected_status")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Content Body */}
      {isLoadingTemplates ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t("loading_templates")}</p>
        </div>
      ) : paginatedTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl min-h-[300px] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center shadow-xs shrink-0 mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{t("no_waba_templates_found")}</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1.5 max-w-[280px]">{t("try_adjusting_search_waba")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {paginatedTemplates.map((template) => (
              <TemplateCard key={template._id} template={template} onPreview={setPreviewTemplate} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination bottom bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/60 pt-6 mt-6">
              <p className="text-sm text-subtitle-color font-bold">
                {t("showing_templates", {
                  start: (page - 1) * limit + 1,
                  end: Math.min(page * limit, totalResults),
                  total: totalResults,
                  defaultValue: `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, totalResults)} of ${totalResults} Templates`
                })}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)} className="h-12 p-padding! border-input-border-color text-primary rounded-radius font-bold text-xs bg-primary/10 hover:bg-primary hover:text-white transition-all">
                  {t("previous")}
                </Button>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="h-12 p-padding! bg-primary! rounded-radius text-white font-bold text-xs transition-all border-none">
                  {t("next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("delete_whatsapp_template_title")}
        description={t("delete_whatsapp_template_description", {
          defaultValue: "Are you sure you want to delete this WhatsApp template? This action will permanently remove it from Meta.",
        })}
        isLoading={isDeleting}
      />

      {/* Smartphone Template Preview Modal */}
      <TemplatePreviewModal template={previewTemplate} isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} />

      {/* Sync Templates from Meta Modal */}
      {selectedWabaId && <SyncTemplatesModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} wabaId={selectedWabaId} onSyncSuccess={refetch} />}
    </div>
  );
}
