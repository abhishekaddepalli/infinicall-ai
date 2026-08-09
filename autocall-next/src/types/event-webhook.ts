export interface EventWebhook {
    id: string;
    name: string;
    endpoint_url: string;
    events: string[];
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface WebhooksResponse {
    success: boolean;
    data: EventWebhook[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

export interface EventWebhookModalProps {
    isOpen: boolean
    onClose: () => void
    webhookToEdit?: EventWebhook
}