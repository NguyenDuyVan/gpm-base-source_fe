import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Button,
  Col,
  Row,
  Badge,
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
} from "reactstrap";
import { useRouter } from "next/router";
import { useEmailTemplatesQuery } from "@/api/queries/useEmailQuery";
import {
  useCreateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
} from "@/api/mutations/useEmailMutation";
import { EmailTemplate } from "@/types/email";
import TableContainer from "@/components/Common/TableContainer";

interface EmailSystemTabProps {
  defaultTemplateType: "system" | "marketing";
}

const EmailSystemTab = forwardRef<
  { openCreateModal: () => void },
  EmailSystemTabProps
>((props, ref) => {
  const { defaultTemplateType } = props;
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({
    key: "",
    type: defaultTemplateType,
  });

  // Expose the openCreateModal method to parent components
  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setFormData((prev) => ({ ...prev, type: defaultTemplateType, key: "" }));
      setModalMode("create");
      setIsModalOpen(true);
    },
  }));

  // Update form data when defaultTemplateType changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, type: defaultTemplateType }));
  }, [defaultTemplateType]);

  // Fetch email templates based on type
  const {
    data: templates,
    isLoading,
    error,
  } = useEmailTemplatesQuery(defaultTemplateType);

  // Mutations
  const createTemplateMutation = useCreateEmailTemplateMutation();
  const updateTemplateMutation = useUpdateEmailTemplateMutation(
    selectedTemplate?.id || 0
  );
  const deleteTemplateMutation = useDeleteEmailTemplateMutation(
    selectedTemplate?.id || 0
  );

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "type" ? (value as "system" | "marketing") : value,
    }));
  };

  // Modal toggle handlers
  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && modalMode === "create") {
      setFormData((prev) => ({ ...prev, key: "" }));
    }
  }, [isModalOpen, modalMode]);

  const toggleDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  // Action handlers
  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createTemplateMutation.mutateAsync(formData);
      } else if (modalMode === "edit" && selectedTemplate) {
        await updateTemplateMutation.mutateAsync(formData);
      }
      toggleModal();
      setSelectedTemplate(null);
    } catch (error) {
      console.error(
        `Error ${modalMode === "create" ? "creating" : "updating"} template:`,
        error
      );
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await deleteTemplateMutation.mutateAsync(selectedTemplate.id);
      toggleDeleteModal();
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleViewDetails = useCallback(
    (template: EmailTemplate) => {
      router.push(`/admin/email-template/${template.id}`);
    },
    [router]
  );

  const handleSelectForEdit = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({ key: template.key, type: template.type });
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleSelectForDelete = useCallback(
    (template: EmailTemplate) => {
      setSelectedTemplate(template);
      toggleDeleteModal();
    },
    [toggleDeleteModal]
  );

  // Define columns for TableContainer
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue(),
      },
      {
        header: "Key",
        accessorKey: "key",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue(),
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        cell: (cell: any) => <Badge color="primary">{cell.getValue()}</Badge>,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (cell: any) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        header: "Updated At",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: (cell: any) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        header: "Actions",
        id: "actions",
        cell: (cellProps: any) => {
          const template = cellProps.row.original;
          return (
            <div className="hstack gap-2">
              <Button
                color="info"
                size="sm"
                onClick={() => handleViewDetails(template)}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                color="warning"
                size="sm"
                onClick={() => handleSelectForEdit(template)}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleSelectForDelete(template)}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
      },
    ],
    [handleViewDetails, handleSelectForEdit, handleSelectForDelete]
  );

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col className="text-end">
          <Button
            color="primary"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                key: "",
                type: defaultTemplateType,
              }));
              setModalMode("create");
              setIsModalOpen(true);
            }}
          >
            <i className="ri-add-line align-middle me-1"></i> Add{" "}
            {defaultTemplateType === "system" ? "System" : "Marketing"} Template
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert color="danger">
          Error loading templates:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <TableContainer
          columns={columns}
          data={templates || []}
          manualPagination
          pageSize={20}
          customPageSize={10}
          divClass="table-responsive"
          tableClass="align-middle table-nowrap"
          theadClass="table-light"
        />
      )}

      {/* Template Modal - Used for both Create & Edit */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>
          {modalMode === "create" ? "Create" : "Edit"}{" "}
          {defaultTemplateType === "system" ? "System" : "Marketing"} Email
          Template
        </ModalHeader>
        <Form onSubmit={handleSubmitTemplate}>
          <ModalBody>
            <FormGroup>
              <Label for="key">Template Key</Label>
              <Input
                type="text"
                id="key"
                name="key"
                placeholder="e.g., auth.verify_email"
                value={formData.key}
                onChange={handleInputChange}
                required
              />
              {modalMode === "create" && (
                <small className="form-text text-muted">
                  Use a unique, descriptive key like "auth.reset_password" or
                  "marketing.welcome".
                </small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="type">Template Type</Label>
              <Input
                type="select"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="system">System</option>
                <option value="marketing">Marketing</option>
              </Input>
              {modalMode === "create" && (
                <small className="form-text text-muted">
                  System templates are for transactional emails like password
                  resets. Marketing templates are for campaigns and promotional
                  content.
                </small>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={
                modalMode === "create"
                  ? createTemplateMutation.isPending
                  : updateTemplateMutation.isPending
              }
            >
              {modalMode === "create" ? (
                createTemplateMutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  "Create"
                )
              ) : updateTemplateMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Template Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal} centered>
        <ModalHeader toggle={toggleDeleteModal}>Delete Template</ModalHeader>
        <ModalBody>
          {selectedTemplate && (
            <>
              Are you sure you want to delete the template{" "}
              <strong>{selectedTemplate.key}</strong>? This action cannot be
              undone.
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleDeleteTemplate}
            disabled={deleteTemplateMutation.isPending}
          >
            {deleteTemplateMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
});

EmailSystemTab.displayName = "EmailSystemTab";

export default EmailSystemTab;
