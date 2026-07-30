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
      <style dangerouslySetInnerHTML={{
        __html: `
        .ck-content h1 { font-size: 2em; font-weight: 800; margin-top: 0.67em; margin-bottom: 0.67em; line-height: 1.2; }
        .ck-content h2 { font-size: 1.5em; font-weight: 700; margin-top: 0.83em; margin-bottom: 0.83em; line-height: 1.3; }
        .ck-content h3 { font-size: 1.17em; font-weight: 700; margin-top: 1em; margin-bottom: 1em; }
        .ck-content h4 { font-size: 1em; font-weight: 700; margin-top: 1.33em; margin-bottom: 1.33em; }
        .ck-content ul { display: block; list-style-type: disc; margin-top: 1em; margin-bottom: 1em; padding-left: 40px; }
        .ck-content ol { display: block; list-style-type: decimal; margin-top: 1em; margin-bottom: 1em; padding-left: 40px; }
        .ck-content li { display: list-item; margin-bottom: 0.5em; }
        .ck-content blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; margin: 1.5em 0; font-style: italic; color: var(--subtitle-color); background: var(--bg-body); padding: 1rem; border-radius: 0 8px 8px 0; }
        .ck-content p { margin-bottom: 1em; }
        .ck-content a { color: var(--primary); text-decoration: underline; }
        .ck.ck-editor__editable { max-height: 333px; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .ck.ck-editor__editable::-webkit-scrollbar { display: none; }
        .dark {
          --ck-color-button-default-hover-background: rgba(255, 255, 255, 0.1) !important;
          --ck-color-button-default-active-background: rgba(255, 255, 255, 0.15) !important;
          --ck-color-button-on-background: rgba(255, 255, 255, 0.15) !important;
          --ck-color-button-on-hover-background: rgba(255, 255, 255, 0.2) !important;
          --ck-color-button-on-active-background: rgba(255, 255, 255, 0.25) !important;
          
          --ck-color-list-button-hover-background: rgba(255, 255, 255, 0.1) !important;
          --ck-color-list-button-on-background: rgba(255, 255, 255, 0.15) !important;
          --ck-color-list-button-on-text: #ffffff !important;
          --ck-color-list-button-hover-text: #ffffff !important;
          
          --ck-color-panel-background: #18181b !important;
          --ck-color-panel-border: rgba(255, 255, 255, 0.1) !important;
          --ck-color-list-background: #18181b !important;
        }
        .ck-toolbar-container .ck.ck-toolbar { flex-wrap: wrap !important; border: none !important; }
        .ck-toolbar-container .ck.ck-toolbar__items { flex-wrap: wrap !important; }
      `}} />
      <div className={cn('space-y-2 flex flex-col', className)}>
        {label && <Label className="text-md font-medium text-title">{label}</Label>}
        <div
          className={cn(
            heightClass || 'min-h-[300px]',
            'rounded-radius overflow-hidden border border-input-border-color bg-bg-card focus-within:border-primary/50 transition-all flex flex-col dark:ck-theme-dark',
            error && 'border-destructive/50',
          )}
        >
          {editor ? (
            <>
              <div ref={toolbarRef} className="ck-toolbar-container border-b border-input-border-color overflow-x-auto no-scrollbar" />
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
