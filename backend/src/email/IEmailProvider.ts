export interface SendOptions {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IEmailProvider {
  send(options: SendOptions): Promise<SendResult>;
}
