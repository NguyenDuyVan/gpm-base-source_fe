import { useQuery } from "@tanstack/react-query";
import { appFetcher } from "../fetcher";
import {
  EMAIL_CAMPAIGNS_PATH,
  EMAIL_CAMPAIGNS_PATH_BY_ID,
  EMAIL_TEMPLATES_PATH,
  EMAIL_TEMPLATES_PATH_BY_ID,
  EMAIL_TEMPLATES_PATH_BY_KEY,
} from "../apiPaths";
import { EmailCampaign, EmailTemplateWithContents } from "@/types/email";

// Email Templates queries
export const useEmailTemplatesQuery = (type?: "system" | "marketing") => {
  return useQuery({
    queryKey: ["email-templates", type],
    queryFn: async () => {
      const url = type
        ? `${EMAIL_TEMPLATES_PATH}?type=${type}`
        : EMAIL_TEMPLATES_PATH;
      const response = await appFetcher<EmailTemplateWithContents[]>(url);
      return response;
    },
  });
};

export const useEmailTemplateByIdQuery = (id: number | string | null) => {
  return useQuery({
    queryKey: ["email-template", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await appFetcher<EmailTemplateWithContents>(
        EMAIL_TEMPLATES_PATH_BY_ID(id)
      );
      return response;
    },
    enabled: !!id,
  });
};

export const useEmailTemplateByKeyQuery = (key: string | null) => {
  return useQuery({
    queryKey: ["email-template-by-key", key],
    queryFn: async () => {
      if (!key) return null;
      const response = await appFetcher<EmailTemplateWithContents>(
        EMAIL_TEMPLATES_PATH_BY_KEY(key)
      );
      return response;
    },
    enabled: !!key,
  });
};

// Email Campaigns queries
export const useEmailCampaignsQuery = (status?: string) => {
  return useQuery({
    queryKey: ["email-campaigns", status],
    queryFn: async () => {
      const url = status
        ? `${EMAIL_CAMPAIGNS_PATH}?status=${status}`
        : EMAIL_CAMPAIGNS_PATH;
      const response = await appFetcher<EmailCampaign[]>(url);
      return response;
    },
  });
};

export const useEmailCampaignByIdQuery = (id: number | string | null) => {
  return useQuery({
    queryKey: ["email-campaign", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await appFetcher<EmailCampaign>(
        EMAIL_CAMPAIGNS_PATH_BY_ID(id)
      );
      return response;
    },
    enabled: !!id,
  });
};
