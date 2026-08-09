'use client'

import { cn } from '@/lib/utils'
import { EditorModules } from '@/types/formFields'
import { CKEditorFieldProps } from '@/types/shared'
import type { DecoupledEditor as DecoupledEditorType } from '@ckeditor/ckeditor5-editor-decoupled'
import 'ckeditor5/ckeditor5.css'
import DOMPurify from 'dompurify'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../ui/label'

export default function CKEditorField({
  label,
  value,
  onChange,
  placeholder,
  className,
  error,
  onReady,
  heightClass,
}: CKEditorFieldProps) {
  const { t } = useTranslation()
  const [editor, setEditor] = useState<EditorModules | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([import('@ckeditor/ckeditor5-react'), import('ckeditor5')]).then(
      ([
        { CKEditor },
        {
          DecoupledEditor,
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Heading,
          Link,
          List,
          BlockQuote,
          Table,
          TableToolbar,
          Alignment,
          FontColor,
          FontBackgroundColor,
          Strikethrough,
          Underline,
          Code,
          CodeBlock,
          Indent,
          IndentBlock
        },
      ]) => {
        setEditor({
          CKEditor,
          DecoupledEditor: DecoupledEditor as unknown as typeof DecoupledEditorType,
          plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Heading,
            Link,
            List,
            BlockQuote,
            Table,
            TableToolbar,
            Alignment,
            FontColor,
            FontBackgroundColor,
            Strikethrough,
            Underline,
            Code,
            CodeBlock,
            Indent,
            IndentBlock
          ],
        })
      }
    )
  }, [])

  const { CKEditor, DecoupledEditor, plugins } = editor || {}

  return (
    <>

      <div className={cn('space-y-2 flex flex-col', className)}>
        {label && <Label className="text-md font-medium text-title">{label}</Label>}
        <div
          className={cn(
            heightClass || 'min-h-[300px]',
            'rounded-radius border border-input-border-color bg-bg-card focus-within:border-primary/50 transition-all flex flex-col dark:ck-theme-dark relative',
            error && 'border-destructive/50',
          )}
        >
          {editor ? (
            <>
              <div ref={toolbarRef} className="ck-toolbar-container border-b border-input-border-color relative z-10" />
              <div className="flex-1 flex flex-col" ref={editorRef}>
                <CKEditor
                  editor={DecoupledEditor as any}
                  data={value ? DOMPurify.sanitize(value) : value}
                  onReady={(editorInstance: any) => {
                    if (toolbarRef.current && editorInstance.ui.view.toolbar?.element) {
                      toolbarRef.current.innerHTML = '' // Prevent duplicates in Strict Mode
                      toolbarRef.current.appendChild(editorInstance.ui.view.toolbar.element)
                    }
                    if (onReady) {
                      onReady(editorInstance)
                    }
                  }}
                  onChange={(_event: any, editorInstance: any) => {
                    const data = editorInstance.getData()
                    onChange(DOMPurify.sanitize(data))
                  }}
                  config={{
                    licenseKey: "GPL",
                    plugins: plugins,
                    placeholder: placeholder || t('start_typing_content'),
                    toolbar: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      'strikethrough',
                      'fontColor',
                      'fontBackgroundColor',
                      '|',
                      'code',
                      'codeBlock',
                      '|',
                      'link',
                      '|',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'blockQuote',
                      'insertTable',
                      '|',
                      'undo',
                      'redo',
                    ],
                  }}
                />
              </div>
            </>
          ) : (
            <div className={cn("flex items-center justify-center flex-1 text-muted-foreground animate-pulse text-sm", heightClass || "min-h-[300px]")}>
              {t('loading_editor')}...
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
      </div>
    </>
  )
}
