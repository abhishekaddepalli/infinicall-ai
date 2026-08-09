export interface DialerTokenRequest {
  phoneNumberId: string;
}

export interface DialerTokenResponse {
  success: boolean;
  provider: 'twilio' | 'plivo';
  token?: string;
  username?: string;
  password?: string;
  number: string;
  message?: string;
}
