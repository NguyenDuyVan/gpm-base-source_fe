"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useEmailTemplateByIdQuery } from "@/api/queries/useEmailQuery";
import { useUpdateEmailTemplateMutation } from "@/api/mutations/useEmailMutation";
import { EmailContent, EmailTemplate } from "@/types/email";
import SendEmailTest from "./SendEmailTest";
import languages from "@/common/languages";

interface EmailTemplateDetailsProps {
  template: EmailTemplate;
  onBack: () => void;
}

const EmailTemplateDetails: React.FC<EmailTemplateDetailsProps> = ({
  template,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<EmailContent | null>(
    null
  );
  const [formData, setFormData] = useState({
    lang: "",
    subject: "",
    bodyHtml: "",
    bodyText: "",
  });

  // Fetch email template with contents
  const {
    data: templateWithContents,
    isLoading,
    error,
  } = useEmailTemplateByIdQuery(template.id);

  // Mutations
  const updateTemplateMutation = useUpdateEmailTemplateMutation(template.id);

  // Set first language as active tab when data loads
  React.useEffect(() => {
    if (
      templateWithContents?.contents &&
      templateWithContents.contents.length > 0 &&
      !activeTab
    ) {
      setActiveTab(templateWithContents.contents[0].lang);
    }
  }, [templateWithContents, activeTab]);

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle handlers
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
      setFormData({
        lang: "",
        subject: "",
        bodyHtml: "",
        bodyText: "",
      });
    }
  };

  const toggleEditModal = (content?: EmailContent) => {
    if (isEditModalOpen && !content) {
      setIsEditModalOpen(false);
      return;
    }

    if (content) {
      setSelectedContent(content);
      setFormData({
        lang: content.lang,
        subject: content.subject,
        bodyHtml: content.bodyHtml,
        bodyText: content.bodyText,
      });
      setIsEditModalOpen(true);
    } else {
      setIsEditModalOpen(false);
    }
  };

  const toggleDeleteModal = (content?: EmailContent) => {
    if (isDeleteModalOpen && !content) {
      setIsDeleteModalOpen(false);
      return;
    }

    if (content) {
      setSelectedContent(content);
      setIsDeleteModalOpen(true);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  // Tab toggle
  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Action handlers
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new content entry by updating the template
    const currentContents = templateWithContents?.contents || [];
    await updateTemplateMutation.mutateAsync({
      contents: [...currentContents, formData],
    });
    toggleCreateModal();
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent || !templateWithContents) return;

    const updatedContents = templateWithContents.contents.map((content) =>
      content.id === selectedContent.id ? { ...content, ...formData } : content
    );

    await updateTemplateMutation.mutateAsync({
      contents: updatedContents,
    });
    toggleEditModal();
  };

  const handleDeleteContent = async () => {
    if (!selectedContent || !templateWithContents) return;

    const updatedContents = templateWithContents.contents.map((content) =>
      content.id !== selectedContent.id
        ? content
        : {
            ...content,
            deleteAt: new Date().toISOString(),
          }
    );

    await updateTemplateMutation.mutateAsync({
      contents: updatedContents,
    });
    toggleDeleteModal();
    setSelectedContent(null);
  };

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col>
          <Button color="secondary" onClick={onBack}>
            <i className="ri-arrow-left-line align-middle me-1"></i> Back to
            Templates
          </Button>
        </Col>
      </Row>

      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col>
              <h5>Template Details: {template.key}</h5>
            </Col>
            <Col className="text-end">
              <Button color="primary" onClick={toggleCreateModal}>
                <i className="ri-add-line align-middle me-1"></i> Add Language
                Version
              </Button>
            </Col>
          </Row>

          {error && (
            <Alert color="danger">
              Error loading template details:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center my-3">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              {templateWithContents?.contents &&
              templateWithContents.contents.length > 0 ? (
                <div>
                  <Nav tabs className="nav-tabs-custom">
                    {templateWithContents.contents.map((content) => (
                      <NavItem key={content.lang}>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={activeTab === content.lang ? "active" : ""}
                          onClick={() => toggleTab(content.lang)}
                        >
                          {content.lang.toUpperCase()}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    {templateWithContents.contents.map((content) => (
                      <TabPane tabId={content.lang} key={content.lang}>
                        <Row className="mb-3">
                          <Col>
                            <h5>Subject: {content.subject}</h5>
                          </Col>
                          <Col className="text-end">
                            <Button
                              color="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => toggleEditModal(content)}
                            >
                              <i className="ri-pencil-line align-middle me-1"></i>{" "}
                              Edit
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => toggleDeleteModal(content)}
                            >
                              <i className="ri-delete-bin-line align-middle me-1"></i>{" "}
                              Delete
                            </Button>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <h6>HTML Content</h6>
                            <div className="border p-3 rounded bg-light email-content-preview">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: content.bodyHtml,
                                }}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <h6>Text Content</h6>
                            <div className="border p-3 rounded bg-light">
                              <pre style={{ whiteSpace: "pre-wrap" }}>
                                {content.bodyText}
                              </pre>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    ))}
                  </TabContent>
                </div>
              ) : (
                <Alert color="info">
                  No language versions found for this template. Click "Add
                  Language Version" to create one.
                </Alert>
              )}
            </>
          )}

          {/* Email testing section - only for system templates */}
          {template.type === "system" && templateWithContents && (
            <SendEmailTest templateKey={template.key} />
          )}
        </CardBody>
      </Card>

      {/* Create Email Content Modal */}
      <Modal isOpen={isCreateModalOpen} toggle={toggleCreateModal} size="lg">
        <ModalHeader toggle={toggleCreateModal}>
          Add Language Version
        </ModalHeader>
        <Form onSubmit={handleCreateContent}>
          <ModalBody>
            <FormGroup>
              <Label for="lang">Language</Label>
              <Input
                type="select"
                id="lang"
                name="lang"
                value={formData.lang}
                onChange={handleInputChange}
                required
                className="form-select"
                aria-label="Select language"
              >
                <option value="">Select a language</option>
                {Object.keys(languages)
                  .filter(
                    (langCode) =>
                      !templateWithContents?.contents.some(
                        (content) => content.lang === langCode
                      )
                  )
                  .map((langCode) => (
                    <option key={langCode} value={langCode}>
                      {languages[langCode as keyof typeof languages].label}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                placeholder="Email subject line"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="bodyText">Text Content</Label>
              <Input
                type="textarea"
                id="bodyText"
                name="bodyText"
                placeholder="Plain text version of the email"
                value={formData.bodyText}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="bodyHtml">HTML Content</Label>
              <Input
                type="textarea"
                id="bodyHtml"
                name="bodyHtml"
                placeholder="HTML version of the email"
                value={formData.bodyHtml}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleCreateModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={updateTemplateMutation.isPending}
            >
              {updateTemplateMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Create"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Edit Email Content Modal */}
      <Modal
        isOpen={isEditModalOpen}
        toggle={() => toggleEditModal()}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>
          Edit Language Version
        </ModalHeader>
        <Form onSubmit={handleUpdateContent}>
          <ModalBody>
            <FormGroup>
              <Label for="lang">Language</Label>
              <Input
                type="select"
                id="lang"
                name="lang"
                value={formData.lang}
                onChange={handleInputChange}
                required
                className="form-select"
                aria-label="Select language"
              >
                <option value="">Select a language</option>
                {Object.keys(languages).map((langCode) => (
                  <option key={langCode} value={langCode}>
                    {languages[langCode as keyof typeof languages].label}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                placeholder="Email subject line"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="bodyText">Text Content</Label>
              <Input
                type="textarea"
                id="bodyText"
                name="bodyText"
                placeholder="Plain text version of the email"
                value={formData.bodyText}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="bodyHtml">HTML Content</Label>
              <Input
                type="textarea"
                id="bodyHtml"
                name="bodyHtml"
                placeholder="HTML version of the email"
                value={formData.bodyHtml}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={() => toggleEditModal()}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={updateTemplateMutation.isPending}
            >
              {updateTemplateMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Email Content Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => toggleDeleteModal()}>
        <ModalHeader toggle={() => toggleDeleteModal()}>
          Delete Language Version
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the{" "}
          {selectedContent?.lang.toUpperCase()} version of this email template?
          This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => toggleDeleteModal()}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleDeleteContent}
            disabled={updateTemplateMutation.isPending}
          >
            {updateTemplateMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default EmailTemplateDetails;
