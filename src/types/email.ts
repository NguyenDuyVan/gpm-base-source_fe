export interface EmailTemplate {
  id: number;
  key: string;
  type: "system" | "marketing";
  createdAt: string;
  updatedAt: string;
}

export interface EmailContent {
  id: number;
  templateId: number;
  lang: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}

export enum CampaignStatus {
  DRAFT = "draft",
  READY = "ready",
  SENDING = "sending",
  SENT = "sent",
  CANCELED = "canceled",
}

export interface EmailCampaign {
  id: number;
  name: string;
  templateId: number;
  scheduleAt: string;
  status: CampaignStatus;
}

export interface EmailTemplateWithContents extends EmailTemplate {
  contents: EmailContent[];
}

// Request interfaces
export interface CreateEmailTemplateRequest {
  key: string;
  type: "system" | "marketing";
  contents?: CreateEmailContentRequest[];
}

export interface UpdateEmailTemplateRequest {
  key?: string;
  type?: "system" | "marketing";
  contents?: CreateEmailContentRequest[];
}

export interface CreateEmailContentRequest {
  templateId?: number;
  lang: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}

export interface UpdateEmailContentRequest {
  lang?: string;
  subject?: string;
  bodyHtml?: string;
  bodyText?: string;
}

export interface CreateEmailCampaignRequest {
  name: string;
  templateId: number;
  scheduleAt: string;
  status: CampaignStatus;
}

export interface UpdateEmailCampaignRequest {
  name?: string;
  templateId?: number;
  scheduleAt?: string;
  status?: CampaignStatus;
}

export interface SendEmailRequest {
  templateKey: string;
  lang: string;
  to: string;
  data?: Record<string, any>;
}

export interface SendBulkEmailRequest {
  templateKey: string;
  lang: string;
  recipients: Array<{
    to: string;
    data?: Record<string, any>;
  }>;
}
