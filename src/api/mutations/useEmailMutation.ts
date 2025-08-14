import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateEmailCampaignRequest,
  CreateEmailTemplateRequest,
  EmailCampaign,
  EmailTemplateWithContents,
  SendEmailRequest,
  SendBulkEmailRequest,
  UpdateEmailCampaignRequest,
  UpdateEmailTemplateRequest,
} from "@/types/email";
import {
  EMAIL_CAMPAIGNS_PATH,
  EMAIL_CAMPAIGNS_PATH_BY_ID,
  EMAIL_TEMPLATES_PATH,
  EMAIL_TEMPLATES_PATH_BY_ID,
  EMAIL_SEND_PATH,
  EMAIL_SEND_BULK_PATH,
} from "../apiPaths";
import { appDeleter, appPoster, appPutter } from "../fetcher";

// Email Template mutations
export const useCreateEmailTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmailTemplateRequest) => {
      return await appPoster<EmailTemplateWithContents>(
        EMAIL_TEMPLATES_PATH,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};

export const useUpdateEmailTemplateMutation = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEmailTemplateRequest) => {
      return await appPutter<EmailTemplateWithContents>(
        EMAIL_TEMPLATES_PATH_BY_ID(id),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["email-template", id] });
    },
  });
};

export const useDeleteEmailTemplateMutation = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await appDeleter(EMAIL_TEMPLATES_PATH_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["email-template", id] });
    },
  });
};

// Email Campaign mutations
export const useCreateEmailCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmailCampaignRequest) => {
      return await appPoster<EmailCampaign>(EMAIL_CAMPAIGNS_PATH, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
    },
  });
};

export const useUpdateEmailCampaignMutation = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEmailCampaignRequest) => {
      return await appPutter<EmailCampaign>(
        EMAIL_CAMPAIGNS_PATH_BY_ID(id),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["email-campaign", id] });
    },
  });
};

export const useDeleteEmailCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await appDeleter(EMAIL_CAMPAIGNS_PATH_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
    },
  });
};

// Email Sending mutations
export const useSendEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: SendEmailRequest) => {
      return await appPoster(EMAIL_SEND_PATH, data);
    },
  });
};

export const useSendBulkEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: SendBulkEmailRequest) => {
      return await appPoster(EMAIL_SEND_BULK_PATH, data);
    },
  });
};
