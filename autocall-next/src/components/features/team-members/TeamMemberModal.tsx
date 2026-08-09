'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddTeamMemberMutation } from '@/redux/api/teamMemberApi'
import { ApiError } from '@/types/api'
import { TeamMemberModalProps } from '@/types/team'
import { AddTeamMemberRequest } from '@/types/teamMember'
import { Loader2 } from '@/components/reusable/Loader2';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function TeamMemberModal({ isOpen, onClose, teamId }: TeamMemberModalProps) {
  const { t } = useTranslation()
  const [addTeamMember, { isLoading }] = useAddTeamMemberMutation()

  const [formData, setFormData] = useState<Omit<AddTeamMemberRequest, 'teamId'>>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    status: 'active',
  })

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone_number: '',
          status: 'active',
        })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await addTeamMember({
        ...formData,
        teamId,
      }).unwrap()
      toast.success(res.message || t('team_member_added_successfully', 'Team member added successfully'))
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_add_team_member', 'Failed to add team member'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[550px] max-w-[calc(100%-2rem)]  p-0 overflow-auto no-scrollbar max-h-[90vh] gap-0 bg-bg-card border-input-border-color">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <DialogHeader className="px-6 py-5 border-b border-input-border-color bg-bg-card m-0 shrink-0">
            <DialogTitle className="text-[20px] font-bold text-title flex items-center gap-3">
              {t('create_team_member', 'Create Team Member')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 sm:p-6 p-4 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name" className="text-sm font-bold text-title">{t('first_name', 'First Name')} <span className="text-destructive">*</span></Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder={t('first_name', 'First Name')}
                  required
                  className="h-11 rounded-radius bg-bg-card border-input-border-color focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name" className="text-sm font-bold text-title">{t('last_name', 'Last Name')}</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder={t('last_name', 'Last Name')}
                  className="h-11 rounded-radius bg-bg-card border-input-border-color focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[14px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-bold text-title">{t('email', 'Email')} <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('email_placeholder', 'name@company.com')}
                required
                className="h-11 rounded-radius bg-bg-card border-input-border-color focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[14px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-bold text-title">{t('password', 'Password')} <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t('password_placeholder', '••••••••')}
                required
                className="h-11 rounded-radius bg-bg-card border-input-border-color focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[14px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone_number" className="text-sm font-bold text-title">{t('phone_number', 'Phone Number')} <span className="text-destructive">*</span></Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+1234567890"
                required
                className="h-11 rounded-radius bg-bg-card border-input-border-color focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[14px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-title">{t('status', 'Status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11 rounded-radius border-input-border-color focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[14px]">
                  <SelectValue placeholder={t('select_status', 'Select Status')} />
                </SelectTrigger>
                <SelectContent className="rounded-radius border-input-border-color">
                  <SelectItem value="active" className="rounded-radius">{t('active', 'Active')}</SelectItem>
                  <SelectItem value="inactive" className="rounded-radius">{t('inactive', 'Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="p-3 gap-3 sm:gap-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('create', 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
