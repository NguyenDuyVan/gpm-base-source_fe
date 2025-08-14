import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Col,
  Row,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from "reactstrap";
import { useRouter } from "next/router";
import {
  useEmailCampaignsQuery,
  useEmailTemplatesQuery,
} from "@/api/queries/useEmailQuery";
import {
  useCreateEmailCampaignMutation,
  useDeleteEmailCampaignMutation,
  useUpdateEmailCampaignMutation,
} from "@/api/mutations/useEmailMutation";
import { CampaignStatus, EmailCampaign } from "@/types/email";
import TableContainer from "@/components/Common/TableContainer";
import EmailCampaignModal from "./EmailCampaignModal";

const EmailCampaignTab = () => {
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] =
    useState<EmailCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({
    name: "",
    templateId: 0,
    scheduleAt: "",
    status: CampaignStatus.DRAFT,
  });

  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  } = useEmailCampaignsQuery();

  const { data: marketingTemplates } = useEmailTemplatesQuery("marketing");

  const createCampaignMutation = useCreateEmailCampaignMutation();
  const updateCampaignMutation = useUpdateEmailCampaignMutation(
    selectedCampaign?.id || 0
  );
  const deleteCampaignMutation = useDeleteEmailCampaignMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "templateId" ? parseInt(value) : value,
    }));
  };

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && modalMode === "create") {
      setFormData({
        name: "",
        templateId: 0,
        scheduleAt: "",
        status: CampaignStatus.DRAFT,
      });
    }
  }, [isModalOpen, modalMode]);

  const toggleDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  const handleOpenCreateModal = useCallback(() => {
    setModalMode("create");
    setFormData({
      name: "",
      templateId: 0,
      scheduleAt: "",
      status: CampaignStatus.DRAFT,
    });
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((campaign: EmailCampaign) => {
    setModalMode("edit");
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      templateId: campaign.templateId,
      scheduleAt: campaign.scheduleAt,
      status: campaign.status,
    });
    setIsModalOpen(true);
  }, []);

  const handleViewCampaign = useCallback(
    (campaign: EmailCampaign) => {
      router.push(`/admin/email-campaign/${campaign.id}`);
    },
    [router]
  );

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaignMutation.mutateAsync(formData);
      toggleModal();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    try {
      await updateCampaignMutation.mutateAsync(formData);
      toggleModal();
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      await deleteCampaignMutation.mutateAsync(selectedCampaign.id);
      toggleDeleteModal();
      setSelectedCampaign(null);
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    if (modalMode === "create") {
      return handleCreateCampaign(e);
    } else {
      return handleUpdateCampaign(e);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge color="secondary">Draft</Badge>;
      case "ready":
        return <Badge color="info">Ready</Badge>;
      case "scheduled":
        return <Badge color="warning">Scheduled</Badge>;
      case "sent":
        return <Badge color="success">Sent</Badge>;
      default:
        return <Badge color="secondary">{status}</Badge>;
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Schedule",
        accessorKey: "scheduleAt",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{new Date(cell.getValue()).toLocaleDateString()}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return renderStatusBadge(cell.getValue());
        },
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="hstack gap-2">
              <Button
                color="info"
                size="sm"
                onClick={() => handleViewCampaign(cell.getValue())}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                color="warning"
                size="sm"
                onClick={() => handleOpenEditModal(cell.getValue())}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => {
                  setSelectedCampaign(cell.getValue());
                  toggleDeleteModal();
                }}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
      },
    ],
    [handleViewCampaign, handleOpenEditModal, toggleDeleteModal]
  );

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <Button
            color="info"
            onClick={() => {
              const createTemplateEvent = new CustomEvent(
                "createMarketingTemplate"
              );
              window.dispatchEvent(createTemplateEvent);
            }}
          >
            <i className="ri-mail-add-line align-middle me-1"></i> New Marketing
            Template
          </Button>
          <Button color="primary" onClick={handleOpenCreateModal}>
            <i className="ri-add-line align-middle me-1"></i> Create Email
            Campaign
          </Button>
        </Col>
      </Row>

      {campaignsError && (
        <Alert color="danger">
          Error loading campaigns:{" "}
          {campaignsError instanceof Error
            ? campaignsError.message
            : "Unknown error"}
        </Alert>
      )}

      {isLoadingCampaigns ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <TableContainer
          columns={columns}
          data={campaigns || []}
          manualPagination
          pageSize={20}
          customPageSize={10}
          divClass="table-responsive"
          tableClass="align-middle table-nowrap"
          theadClass="table-light"
        />
      )}

      {/* Shared Campaign Modal for Create and Edit */}
      <EmailCampaignModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmitForm}
        templates={marketingTemplates}
        isSubmitting={
          modalMode === "create"
            ? createCampaignMutation.isPending
            : updateCampaignMutation.isPending
        }
        mode={modalMode}
      />

      {/* Delete Campaign Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal} centered>
        <ModalHeader toggle={toggleDeleteModal}>
          Delete Email Campaign
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the campaign{" "}
          <strong>{selectedCampaign?.name}</strong>? This action cannot be
          undone.
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleDeleteCampaign}
            disabled={deleteCampaignMutation.isPending}
          >
            {deleteCampaignMutation.isPending ? (
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

export default EmailCampaignTab;
