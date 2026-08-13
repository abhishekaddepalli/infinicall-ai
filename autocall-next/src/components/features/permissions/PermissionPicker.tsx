'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PermissionPickerProps, TransformedPermission } from '@/types/role'
import { Check, Minus, Search, ShieldCheck } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CustomCheckbox = memo(({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) => {
  return (
    <div
      className={cn(
        "relative h-4 w-4 shrink-0 rounded-[4px] border transition-colors flex items-center justify-center",
        checked || indeterminate
          ? "bg-primary border-primary text-white"
          : "bg-transparent border-slate-300 dark:border-slate-600"
      )}
    >
      {checked && !indeterminate && <Check className="h-3 w-3 stroke-[3px]" />}
      {indeterminate && <Minus className="h-3 w-3 stroke-[3px]" />}
    </div>
  )
})
CustomCheckbox.displayName = 'CustomCheckbox'

const SubmoduleItem = memo(({ sub, isSelected, moduleName, onToggle }: { sub: TransformedPermission['submodules'][number]; isSelected: boolean; moduleName?: string; onToggle: (id: string) => void }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer group select-none",
        isSelected
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
      onClick={(e) => {
        e.preventDefault()
        onToggle(sub.id)
      }}
    >
      <CustomCheckbox checked={isSelected} />
      <span className={cn(
        "text-sm font-medium tracking-wide break-all",
        isSelected ? "text-primary dark:text-primary" : "text-subtitle-color group-hover:text-title"
      )} title={sub.name}>
        {moduleName === 'Virtual phone' ? sub.name : sub.name.split(' ')[0]}
      </span>
    </div>
  )
})
SubmoduleItem.displayName = 'SubmoduleItem'

const ModuleCard = memo(({
  perm,
  selectedIds,
  onToggleModule,
  onToggleId
}: {
  perm: TransformedPermission;
  selectedIds: Set<string>;
  onToggleModule: (perm: TransformedPermission) => void;
  onToggleId: (id: string) => void
}) => {
  const idsInModule = useMemo(() => perm.submodules.map((s) => s.id), [perm.submodules])
  const selectedInModuleCount = useMemo(() => idsInModule.filter((id) => selectedIds.has(id)).length, [idsInModule, selectedIds])

  const isAllSelected = idsInModule.length > 0 && selectedInModuleCount === idsInModule.length
  const isIndeterminate = !isAllSelected && selectedInModuleCount > 0

  return (
    <div className={cn(
      "rounded-lg border bg-bg-card flex flex-col transition-colors",
      isAllSelected || isIndeterminate
        ? "border-primary/40 ring-1 ring-primary/10"
        : "border-input-border-color"
    )}>
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-3.5 py-2.5 cursor-pointer group/header",
          "border-b border-input-border-color bg-slate-50/50 dark:bg-slate-900/20 rounded-t-lg"
        )}
        onClick={(e) => {
          e.preventDefault()
          onToggleModule(perm)
        }}
      >
        <div className="flex items-center gap-3 flex-1">
          <CustomCheckbox checked={isAllSelected} indeterminate={isIndeterminate} />
          <span className="text-md font-semibold text-title capitalize select-none">
            {perm.module.replace(/_/g, ' ').replace(/\bsms\b/gi, 'SMS')}
          </span>
        </div>
      </div>

      <div className="p-2.5 flex flex-wrap gap-2">
        {perm.submodules.map((sub) => (
          <SubmoduleItem
            key={sub.id}
            sub={sub}
            moduleName={perm.module}
            isSelected={selectedIds.has(sub.id)}
            onToggle={onToggleId}
          />
        ))}
      </div>
    </div>
  )
})
ModuleCard.displayName = 'ModuleCard'


const DEFAULT_PERMISSIONS = [
  { _id: 'perm_dashboard', id: 'perm_dashboard', name: 'View Dashboard', slug: 'view.dashboard' },
  { _id: 'perm_agents_view', id: 'perm_agents_view', name: 'View AI Voice Agent', slug: 'view.agents' },
  { _id: 'perm_agents_create', id: 'perm_agents_create', name: 'Create AI Voice Agent', slug: 'create.agents' },
  { _id: 'perm_agents_update', id: 'perm_agents_update', name: 'Update AI Voice Agent', slug: 'update.agents' },
  { _id: 'perm_contacts_view', id: 'perm_contacts_view', name: 'View Contact Hub', slug: 'view.contacts' },
  { _id: 'perm_contacts_create', id: 'perm_contacts_create', name: 'Create Contact Hub', slug: 'create.contacts' },
  { _id: 'perm_phone_view', id: 'perm_phone_view', name: 'View Phone Numbers', slug: 'view.phone_numbers' },
  { _id: 'perm_phone_create', id: 'perm_phone_create', name: 'Create Phone Numbers', slug: 'create.phone_numbers' },
  { _id: 'perm_trunks_view', id: 'perm_trunks_view', name: 'View SIP Trunks', slug: 'view.trunks' },
  { _id: 'perm_trunks_create', id: 'perm_trunks_create', name: 'Create SIP Trunks', slug: 'create.trunks' },
  { _id: 'perm_flows_view', id: 'perm_flows_view', name: 'View Workflows', slug: 'view.flows' },
  { _id: 'perm_flows_create', id: 'perm_flows_create', name: 'Create Workflows', slug: 'create.flows' },
  { _id: 'perm_whatsapp_view', id: 'perm_whatsapp_view', name: 'View WhatsApp', slug: 'view.whatsapp' },
  { _id: 'perm_toolbox_view', id: 'perm_toolbox_view', name: 'View Toolbox Hub', slug: 'view.toolbox' },
  { _id: 'perm_apikeys_view', id: 'perm_apikeys_view', name: 'View API Keys', slug: 'view.api_keys' },
  { _id: 'perm_apikeys_create', id: 'perm_apikeys_create', name: 'Create API Keys', slug: 'create.api_keys' },
  { _id: 'perm_settings_view', id: 'perm_settings_view', name: 'View Settings', slug: 'view.settings' }
];

const PermissionPicker = ({ permissions = [], selectedIds = [], onChange }: PermissionPickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('')
  const [selection, setSelection] = useState<Set<string>>(new Set(selectedIds))

  const [prevSelectedIds, setPrevSelectedIds] = useState(selectedIds)

  useEffect(() => {
    if (selectedIds !== prevSelectedIds) {
      const timer = setTimeout(() => {
        setPrevSelectedIds(selectedIds)
        setSelection(new Set(selectedIds))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [selectedIds, prevSelectedIds])

  const effectivePermissions = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(permissions) && permissions.length > 0) {
      list = permissions;
    } else if (permissions && typeof permissions === 'object') {
      if (Array.isArray((permissions as any).data)) list = (permissions as any).data;
      else if (Array.isArray((permissions as any).permissions)) list = (permissions as any).permissions;
    }
    return list.length > 0 ? list : DEFAULT_PERMISSIONS;
  }, [permissions]);

  // Transform flat permissions into grouped modules
  const transformedPermissions = useMemo(() => {
    const grouped: Record<string, TransformedPermission> = {}

    effectivePermissions.forEach(p => {
      if (!p) return;
      const slugStr = p.slug || p.name || 'general.system';
      const parts = slugStr.split('.')
      let moduleName = parts.length > 1 ? parts[1] : (parts[0] || 'general')

      if (moduleName === 'dialer') {
        moduleName = 'Virtual phone'
      }

      if (!grouped[moduleName]) {
        grouped[moduleName] = {
          _id: moduleName,
          module: moduleName,
          submodules: []
        }
      }

      grouped[moduleName].submodules.push({
        id: p._id || p.id || slugStr,
        name: p.name || slugStr,
        slug: slugStr,
        description: p.description || ''
      })
    })

    return Object.values(grouped)
  }, [effectivePermissions])

  const filteredPermissions = useMemo(() => {
    if (!search.trim()) return transformedPermissions
    const q = search.toLowerCase()
    return transformedPermissions
      .map((perm) => ({
        ...perm,
        submodules: perm.submodules.filter(
          (sub) =>
            perm.module.toLowerCase().includes(q) ||
            sub.name.toLowerCase().includes(q) ||
            sub.slug.toLowerCase().includes(q)
        ),
      }))
      .filter((perm) => perm.submodules.length > 0)
  }, [transformedPermissions, search])

  const { idToViewIdMap, viewIdToOtherIdsMap } = useMemo(() => {
    const idToView: Record<string, string> = {}
    const viewToOthers: Record<string, string[]> = {}

    transformedPermissions.forEach((perm) => {
      const viewSub = perm.submodules.find((s) => s.slug.startsWith('view'))
      if (viewSub) {
        const others: string[] = []
        perm.submodules.forEach((sub) => {
          idToView[sub.id] = viewSub.id
          if (sub.id !== viewSub.id) {
            others.push(sub.id)
          }
        })
        viewToOthers[viewSub.id] = others
      }
    })

    return { idToViewIdMap: idToView, viewIdToOtherIdsMap: viewToOthers }
  }, [transformedPermissions])

  const onToggleId = useCallback(
    (id: string) => {
      const next = new Set(selection)
      const viewId = idToViewIdMap[id]

      if (next.has(id)) {
        next.delete(id)
        if (id === viewId) {
          const others = viewIdToOtherIdsMap[id] || []
          others.forEach((s) => next.delete(s))
        }
      } else {
        next.add(id)
        if (viewId) {
          next.add(viewId)
        }
      }

      setSelection(next)
      onChange(Array.from(next))
    },
    [selection, onChange, idToViewIdMap, viewIdToOtherIdsMap]
  )

  const onToggleModule = useCallback(
    (perm: TransformedPermission) => {
      const idsInModule = perm.submodules.map((s) => s.id)
      const allSelected = idsInModule.every((id) => selection.has(id))

      const next = new Set(selection)
      if (allSelected) {
        idsInModule.forEach((id) => next.delete(id))
      } else {
        idsInModule.forEach((id) => next.add(id))
      }

      setSelection(next)
      onChange(Array.from(next))
    },
    [selection, onChange]
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-input-border-color">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="pl-9 h-10 bg-input-color border-input-border-color focus:ring-1 focus:ring-primary rounded-md text-sm"
          />
        </div>

        {selection.size > 0 && (
          <div className="flex items-center gap-2 p-padding! bg-primary/10 text-primary rounded-lg border border-primary/20">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-md font-medium">
              {selection.size} {t('permission_selected')}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3! 2xl:grid-cols-4! gap-4 max-h-[600px] overflow-y-auto pr-3 no-scrollbar p-1">
        {filteredPermissions.map((perm) => (
          <ModuleCard
            key={perm.module}
            perm={perm}
            selectedIds={selection}
            onToggleModule={onToggleModule}
            onToggleId={onToggleId}
          />
        ))}

        {filteredPermissions.length === 0 && (
          <div className="col-span-full text-center py-32 bg-slate-50 dark:bg-slate-950/30 rounded-lg border-2 border-dashed border-input-border-color">
            <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <p className="text-subtitle-color text-md font-bold">
              {t('no_matches_found')} &quot;{search}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PermissionPicker
