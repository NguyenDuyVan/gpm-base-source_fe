import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { CampaignStatus, EmailTemplate } from "@/types/email";

interface EmailCampaignFormData {
  name: string;
  templateId: number;
  scheduleAt: string;
  status: CampaignStatus;
}

interface EmailCampaignModalProps {
  isOpen: boolean;
  toggle: () => void;
  formData: EmailCampaignFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  templates: EmailTemplate[] | undefined;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

const EmailCampaignModal: React.FC<EmailCampaignModalProps> = ({
  isOpen,
  toggle,
  formData,
  handleInputChange,
  onSubmit,
  templates,
  isSubmitting,
  mode,
}) => {
  const title =
    mode === "create" ? "Create Email Campaign" : "Edit Email Campaign";
  const submitButtonText = mode === "create" ? "Create" : "Update";

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">Campaign Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Summer 2025 Promotion"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="templateId">Email Template</Label>
            <Input
              type="select"
              id="templateId"
              name="templateId"
              value={formData.templateId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a template</option>
              {templates &&
                templates.map((template: EmailTemplate) => (
                  <option key={template.id} value={template.id}>
                    {template.key}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="scheduleAt">Schedule Date</Label>
            <Input
              type="date"
              id="scheduleAt"
              name="scheduleAt"
              value={
                formData.scheduleAt
                  ? new Date(formData.scheduleAt).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              {Object.values(CampaignStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : submitButtonText}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EmailCampaignModal;
