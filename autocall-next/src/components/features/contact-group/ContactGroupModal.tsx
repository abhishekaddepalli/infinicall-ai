'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { useGetContactsQuery } from '@/redux/api/contactApi'
import { Contact } from '@/types/contact'
import { ContactGroupModalProps } from '@/types/contact-group'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ContactGroupModal({ isOpen, onClose, onConfirm, initialData, isLoading }: ContactGroupModalProps) {
  const { t } = useTranslation()
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [contactSearch, setContactSearch] = useState('')
  const [errors, setErrors] = useState<{ group_name?: string; group_contacts?: string }>({})

  const { data: contactsData, isFetching } = useGetContactsQuery(
    { page: 1, limit: 100, search: contactSearch },
    { skip: !isOpen }
  )

  const contacts: Contact[] = contactsData?.data || []

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    if (initialData) {
      setGroupName(initialData.group_name || '')
      setGroupDescription(initialData.group_description || '')
      const initialIds = (initialData.group_contacts || []).map((c: any) => (typeof c === 'string' ? c : (c._id || c.id))).filter(Boolean)
      setSelectedContactIds(initialIds)
    } else {
      setGroupName('')
      setGroupDescription('')
      setSelectedContactIds([])
      setContactSearch('')
    }
  }, [isOpen, initialData])

  const selectedCount = useMemo(() => selectedContactIds.length, [selectedContactIds])

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) => (
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    ))
  }

  const handleSubmit = () => {
    const nextErrors: { group_name?: string; group_contacts?: string } = {}
    if (!groupName.trim()) nextErrors.group_name = t('group_name_is_required')
    if (!selectedContactIds.length) nextErrors.group_contacts = t('select_at_least_one_contact')
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onConfirm({
      group_name: groupName.trim(),
      group_description: groupDescription.trim(),
      group_contacts: selectedContactIds,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0 rounded-modal-radius gap-0 border-input-border-color bg-white overflow-hidden max-h-[90vh] no-scrollbar flex flex-col">
        <DialogHeader className="sm:p-5 p-4 border-b border-input-border-color bg-linear-to-b from-primary/5 to-transparent">
          <DialogTitle className="text-xl font-bold text-title flex items-center gap-2">
            {initialData ? t('edit_contact_group') : t('create_contact_group')}
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-5 p-4 pt-0 space-y-5 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <Label className="text-md font-semibold text-title">{t('group_name')}</Label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t('enter_group_name')}
              className="h-11 bg-input-color border-input-border-color"
            />
            {errors.group_name && <p className="text-xs text-destructive font-medium">{errors.group_name}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-md font-semibold text-title">{t('group_description')}</Label>
            <Textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder={t('enter_group_description')}
              className="min-h-22"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-md font-semibold text-title">
                {t('group_contacts')}
              </Label>
              <span className="text-xs font-semibold text-primary">
                {selectedCount} {t('selected')}
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder={t('search_contacts')}
                className="h-10 pl-9 bg-input-color border-input-border-color"
              />
            </div>
            <div className="rounded-radius border border-input-border-color bg-input-color/40 max-h-[240px] overflow-auto no-scrollbar">
              {isFetching ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t('loading_contacts')}
                </div>
              ) : contacts.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {t('no_contacts_found')}
                </div>
              ) : (
                contacts.map((contact) => {
                  const id = contact._id || contact.id
                  const isChecked = selectedContactIds.includes(id)
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 px-3 py-2.5 border-b last:border-b-0 border-input-border-color/70 hover:bg-primary/10 cursor-pointer"
                      onClick={() => toggleContact(id)}
                    >
                      <Checkbox checked={isChecked} onChange={() => toggleContact(id)} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-title truncate">
                          {`${contact.first_name || ''} ${contact.last_name || ''}`.trim() || t('unnamed_contact')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.phone_number} {contact.email ? `• ${contact.email}` : ''}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {errors.group_contacts && <p className="text-xs text-destructive font-medium">{errors.group_contacts}</p>}
          </div>
        </div>

        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 p-5">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all w-full sm:w-auto">
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm w-full sm:w-auto">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : initialData ? t('save_changes') : t('create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
