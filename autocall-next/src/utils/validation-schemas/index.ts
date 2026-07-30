import { format } from 'date-fns'
import { formatDistanceToNow as dateFnsFormatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export const authSchemas = {
    login: (t: TFunction) =>
        yup
            .object({
                email: yup.string().email(t('invalid_email')).required(t('email_required')),
                password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
            })
            .required(),

    register: (t: TFunction, isAgreementEnabled?: boolean) =>
        yup
            .object({
                name: yup.string().required(t('name_required')),
                email: yup.string().email(t('invalid_email')).required(t('email_required')),
                password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
                confirmPassword: yup
                    .string()
                    .oneOf([yup.ref('password')], t('passwords_must_match'))
                    .required(t('confirm_password_required')),
                signup_agreement: yup.boolean().when([], {
                    is: () => isAgreementEnabled,
                    then: (schema) => schema.oneOf([true], t('must_agree_to_terms')),
                    otherwise: (schema) => schema.optional(),
                }),
            })
            .required(),

    forgotPassword: (t: TFunction) =>
        yup
            .object({
                email: yup.string().email(t('invalid_email')).required(t('email_required')),
            })
            .required(),

    verifyOtp: (t: TFunction) =>
        yup
            .object({
                otp: yup.string().required(t('otp_required')).length(6, t('otp_length_6')),
            })
            .required(),

    resetPassword: (t: TFunction) =>
        yup
            .object({
                password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
                confirmPassword: yup
                    .string()
                    .oneOf([yup.ref('password')], t('passwords_must_match'))
                    .required(t('confirm_password_required')),
            })
            .required(),
}

export const faqSchemas = {
    create: (t: TFunction) =>
        yup.object({
            title: yup.string().required(t('title_required')),
            description: yup.string().required(t('description_required')),
            status: yup.boolean(),
        }),
}
export const pageSchemas = {
    create: (t: TFunction) =>
        yup.object({
            title: yup.string().required(t('title_required')),
            slug: yup.string().required(t('slug_required')),
            content: yup.string().nullable(),
            meta_title: yup.string().nullable(),
            meta_description: yup.string().nullable(),
            status: yup.boolean(),
        }),
}

export const userSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            email: yup.string().email(t('invalid_email')).required(t('email_required')),
            password: yup.string().when('isEditing', {
                is: (isEditing: boolean) => !isEditing,
                then: (schema) => schema.min(6, t('password_too_short')).required(t('password_required')),
                otherwise: (schema) => schema.min(6, t('password_too_short')).optional(),
            }),
            confirmPassword: yup.string().when('isEditing', {
                is: (isEditing: boolean) => !isEditing,
                then: (schema) =>
                    schema.oneOf([yup.ref('password')], t('passwords_must_match')).required(t('confirm_password_required')),
                otherwise: (schema) => schema.optional(),
            }),
            roleId: yup.string().required(t('role_required')),
            isActive: yup.boolean(),
            tags: yup.array().of(yup.string()).optional(),
        }),
}

export const contactSchemas = {
    create: (t: TFunction, type?: 'email' | 'whatsapp') =>
        yup.object({
            name: yup
                .string()
                .min(2, t('name_too_short'))
                .required(t('name_required')),
            email: yup
                .string()
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('invalid_email'))
                .when([], {
                    is: () => type === 'whatsapp',
                    then: (schema) => schema.optional(),
                    otherwise: (schema) => schema.required(t('email_required')),
                }),
            phone: yup
                .string()
                .matches(/^[0-9]+$/, {
                    message: t('invalid_phone'),
                    excludeEmptyString: true,
                })
                .when([], {
                    is: () => type === 'whatsapp',
                    then: (schema) =>
                        schema
                            .min(7, t('phone_too_short'))
                            .required(t('phone_required')),
                    otherwise: (schema) => schema.optional(),
                }),
            tags: yup.array().of(yup.string()).optional(),
        }),
}

export const contactGroupSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            description: yup.string().required(t('description_required')),
            type: yup
                .string()
                .oneOf(['email', 'whatsapp'])
                .required(t('type_required')),
            contactIds: yup.array().of(yup.string()).optional(),
        }),
}

export const segmentSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            description: yup.string().required(t('description_required')),
            conditions: yup.array().optional(),
        }),
}

export const emailConfigSchemas = {
    update: (t: TFunction) =>
        yup.object().shape({
            emailProvider: yup.string().required(t('email_provider_required')),
            fromName: yup.string().required(t('from_name_required')),
            fromEmail: yup
                .string()
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('invalid_email'))
                .required(t('from_email_required')),
            config: yup
                .object()
                .when('emailProvider', {
                    is: (emailProvider: string) => emailProvider === 'nodemailer',
                    then: (schema) =>
                        schema.shape({
                            smtp_host: yup.string().required(t('smtp_host_required')),
                            smtp_port: yup.number().typeError(t('must_be_number')).required(t('smtp_port_required')),
                            smtp_user: yup.string().required(t('smtp_user_required')),
                            smtp_pass: yup.string().required(t('smtp_pass_required')),
                            mail_encryption: yup.string().required(t('encryption_required')),
                        }),
                    otherwise: (schema) => schema,
                })
                .when('emailProvider', {
                    is: (emailProvider: string) => emailProvider === 'sendgrid',
                    then: (schema) =>
                        schema.shape({
                            sendgrid_api_key: yup.string().required(t('sendgrid_api_key_required')),
                        }),
                    otherwise: (schema) => schema,
                }),
        }),
}

export const profileSchemas = {
    update: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            email: yup.string().email(t('invalid_email')).required(t('email_required')),
        }),
    changePassword: (t: TFunction) =>
        yup.object({
            oldPassword: yup.string().required(t('old_password_required')),
            newPassword: yup
                .string()
                .min(6, t('password_too_short'))
                .required(t('new_password_required')),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('newPassword')], t('passwords_must_match'))
                .required(t('confirm_password_required')),
        }),
}
export const adminSettingSchemas = {
    general: (t: TFunction) =>
        yup.object({
            app_name: yup.string().required(t('app_name_required')),
            app_email: yup.string().email(t('invalid_email')).required(t('app_email_required')),
            support_email: yup.string().email(t('invalid_email')).required(t('support_email_required')),
            document_file_limit: yup
                .number()
                .min(1)
                .max(50, t('cannot_exceed_50_mb'))
                .required(),
            audio_file_limit: yup
                .number()
                .min(1)
                .max(50, t('cannot_exceed_50_mb'))
                .required(),
            video_file_limit: yup
                .number()
                .min(1)
                .max(50, t('cannot_exceed_50_mb'))
                .required(),
            image_file_limit: yup
                .number()
                .min(1)
                .max(50, t('cannot_exceed_50_mb'))
                .required(),
            smtp_host: yup.string().nullable().optional(),
            smtp_port: yup.number().typeError(t('must_be_number')).min(1).max(65535).nullable().optional(),
            smtp_user: yup.string().nullable().optional(),
            smtp_pass: yup.string().nullable().optional(),
            mail_from_name: yup.string().nullable().optional(),
            mail_from_email: yup
                .string()
                .email(t('invalid_email'))
                .nullable()
                .optional(),
            mail_encryption: yup.string().oneOf(['ssl', 'tls']).nullable().optional(),
            multiple_file_share_limit: yup.number().min(1).max(10).required(),
            session_expiration_days: yup.number().min(1).max(30).required(),
            session_limit: yup.number().min(1).max(10).required(),
            demo_user_email: yup.string().email(t('invalid_email')).nullable().optional(),
            demo_user_password: yup.string().nullable().optional(),
            is_demo_mode: yup.boolean().optional(),
        }),
    limits: (t: TFunction) =>
        yup.object({
            default_agent_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_campaign_limit_per_day: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_flow_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_knowledgebase_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_storage_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_contact_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_sms_agent_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_sms_campaign_limit_per_day: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            default_campaign_sms_limit: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
        }),
    credits: () =>
        yup.object({
            credit_deduction_type: yup.string().oneOf(['per_call', 'per_minute']).required(),
            credits_per_call: yup.number().min(0).required(),
            credits_per_minute: yup.number().min(0).required(),
            credits_per_sms: yup.number().min(0).required(),
            free_credits_on_registration: yup.number().min(0).required(),
        }),
    storage: (t: TFunction) =>
        yup.object({
            storage_type: yup.string().oneOf(['local', 'aws']).required(t('field_required')),
            storage_limit_per_user: yup.number().typeError(t('must_be_number')).min(0, t('must_be_positive')).required(t('field_required')),
            restore_storage_on_delete: yup.boolean(),
            aws_access_key_id: yup.string().when('storage_type', {
                is: 'aws',
                then: (schema) => schema.required(t('aws_access_key_required')),
                otherwise: (schema) => schema.nullable().optional(),
            }),
            aws_secret_access_key: yup.string().when('storage_type', {
                is: 'aws',
                then: (schema) => schema.required(t('aws_secret_key_required')),
                otherwise: (schema) => schema.nullable().optional(),
            }),
            aws_region: yup.string().when('storage_type', {
                is: 'aws',
                then: (schema) => schema.required(t('aws_region_required')),
                otherwise: (schema) => schema.nullable().optional(),
            }),
            aws_bucket_name: yup.string().when('storage_type', {
                is: 'aws',
                then: (schema) => schema.required(t('aws_bucket_required')),
                otherwise: (schema) => schema.nullable().optional(),
            }),
        }),
    signupCustomization: (t: TFunction) =>
        yup.object({
            signup_agreement_enabled: yup.boolean(),
            signup_agreement_prefix_text: yup.string().when('signup_agreement_enabled', {
                is: true,
                then: (schema) => schema.required(t('field_required')),
                otherwise: (schema) => schema.optional().nullable(),
            }),
            signup_agreement_link_text: yup.string().when('signup_agreement_enabled', {
                is: true,
                then: (schema) => schema.required(t('field_required')),
                otherwise: (schema) => schema.optional().nullable(),
            }),
            signup_agreement_target_page: yup.string().when('signup_agreement_enabled', {
                is: true,
                then: (schema) => schema.required(t('field_required')),
                otherwise: (schema) => schema.optional().nullable(),
            }),
        }),
}

export const promptTemplateSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            category: yup.string().required(t('category_required')),
            content: yup.string().required(t('content_required')),
            system_prompt: yup.string().required(t('system_prompt_required')),
            welcome_message: yup.string().optional().nullable(),
            goodbye_message: yup.string().optional().nullable(),
            communication_style: yup.string().optional().nullable(),
            behavior_style: yup.string().optional().nullable(),
            is_public: yup.boolean(),
        }),
}

export const templateCategorySchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            description: yup.string().required(t('description_required')),
        }),
}

export const campaignTypeSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            description: yup.string().optional(),
            status: yup.boolean(),
        }),
}

export const campaignSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            typeId: yup.string().required(t('type_required')),
            agentId: yup.string().required(t('agent_required')),
            phoneNumberId: yup.string().required(t('phone_number_required')),
            description: yup.string().optional(),
            callSchedule: yup.object({
                enabled: yup.boolean().default(false),
                callStartTime: yup.string().when('enabled', {
                    is: true,
                    then: (schema) => schema.required(t('start_time_required')),
                    otherwise: (schema) => schema.optional(),
                }),
                callEndTime: yup.string().when('enabled', {
                    is: true,
                    then: (schema) => schema.required(t('end_time_required')),
                    otherwise: (schema) => schema.optional(),
                }),
                timeZone: yup.string().default('Asia/Kolkata'),
                dayOfWeek: yup.array().of(yup.string()).when('enabled', {
                    is: true,
                    then: (schema) => schema.min(1, t('select_at_least_one_day')),
                    otherwise: (schema) => schema.optional(),
                }),
            }).optional(),
            autoRetrySettings: yup.object({
                enabled: yup.boolean().default(false),
                maxAttempts: yup.number().min(1).default(3),
                retryInterval: yup.string().default('1 hour'),
                retryWhen: yup.array().of(yup.string()).default(['No Answer']),
            }).optional(),
        }),
}

export const smsCampaignSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            typeId: yup.string().required(t('type_required')),
            phoneNumberId: yup.string().required(t('phone_number_required')),
            smsAgentId: yup.string().required(t('sms_agent_required')),
            content: yup.string().required(t('content_required')),
            smsTemplateId: yup.string().optional(),
            SMSSchedule: yup.object({
                enabled: yup.boolean().default(false),
                callStartTime: yup.string().when('enabled', {
                    is: true,
                    then: (schema) => schema.required(t('start_time_required')),
                    otherwise: (schema) => schema.optional(),
                }),
                callEndTime: yup.string().when('enabled', {
                    is: true,
                    then: (schema) => schema.required(t('end_time_required')),
                    otherwise: (schema) => schema.optional(),
                }),
                timeZone: yup.string().default('Asia/Kolkata'),
                dayOfWeek: yup.array().of(yup.string()).when('enabled', {
                    is: true,
                    then: (schema) => schema.min(1, t('select_at_least_one_day')),
                    otherwise: (schema) => schema.optional(),
                }),
            }).optional(),
        }),
}

export const aiModelSchemas = {
    create: (t: TFunction) =>
        yup.object({
            name: yup.string().required(t('name_required')),
            display_name: yup.string().required(t('display_name_required')),
            provider: yup.string().required(t('provider_required')),
            model_id: yup.string().required(t('model_id_required')),
            api_endpoint: yup.string().url(t('invalid_url')).nullable().optional(),
            api_version: yup.string().nullable().optional(),
            status: yup.string().oneOf(['active', 'inactive']).default('active'),
            is_default: yup.boolean().default(false),
            description: yup.string().optional().nullable(),
        }),
}

export const formatDate = (date: string | number | Date | null | undefined): string => {
    if (!date) return '-'
    try {
        const d = new Date(date)
        if (isNaN(d.getTime())) return '-'
        return format(d, 'do MMM, yyyy')
    } catch {
        return '-'
    }
}

export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatDistanceToNow = (
    date: string | number | Date | null | undefined,
    options?: { addSuffix?: boolean }
): string => {
    if (!date) return '-'
    try {
        const d = new Date(date)
        if (isNaN(d.getTime())) return '-'
        return dateFnsFormatDistanceToNow(d, options)
    } catch (error) {
        console.error('Error formatting distance to now:', error)
        return '-'
    }
}