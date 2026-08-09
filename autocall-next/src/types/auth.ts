import { LoginRequest, RegisterRequest } from "./api";
export interface SubmodulePermission {
  id: string
  name: string
  read: boolean
  write: boolean
}
export interface ModulePermission {
  id: string
  module: string
  submodules: SubmodulePermission[]
}
export interface User {
  id: string
  name: string
  email: string
  role: string
  roleId?: string
  permissions: (ModulePermission | string)[]
  permissionSlugs?: string[]
  isTeamMember?: boolean
  avatar?: string | null
  isActive: boolean
  total_credits?: number
  used_credits?: number
  lastLogin?: string
  remaining_credits?: number
}

export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthInputProps {
  label: React.ReactNode;
  name: string;
  type?: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  leftIcon?: React.ReactNode;
}


export type LoginFormValues = LoginRequest;


export type RegisterFormValues = RegisterRequest & {
  confirmPassword: string
  signup_agreement?: boolean
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface VerifyOtpFormValues {
  otp: string
}

export interface ResetPasswordFormValues {
  password: string
  confirmPassword: string
}

export interface AuthPageWrapperProps {
  children: React.ReactNode;
}

export interface ProfileFormValues {
  name: string;
  email: string;
}

export interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthSplitPageProps {
  initialMode?: "login" | "register";
}

export interface RegisterFormProps {
  onSuccess?: () => void;
}

export interface RegistrationOtpModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onSuccess: () => void
}

export interface RegistrationOtpFormProps {
  email: string
  onSuccess: () => void
}

export interface OtpInputProps {
  name: string;
  label?: string;
}