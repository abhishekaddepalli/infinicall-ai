import { FileText, Globe, Link2 } from "lucide-react";

export   const fileTypes = [
    { id: 'url', label: 'Website URL', icon: <Link2 className="w-5 h-5" />, description: 'Import content from a website' },
    { id: 'file', label: 'Document File', icon: <Globe className="w-5 h-5" />, description: 'Upload PDF, TXT, or DOCX Files' },
    { id: 'text', label: 'Text Content', icon: <FileText className="w-5 h-5" />, description: 'Paste or write plain text content' },
  ]