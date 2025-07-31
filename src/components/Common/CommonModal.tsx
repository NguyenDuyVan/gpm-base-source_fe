import React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

// Define modal types
export type ModalType =
  | "delete"
  | "confirm"
  | "info"
  | "warning"
  | "success"
  | "error";

interface CommonModalProps {
  isOpen: boolean;
  toggle: () => void;
  modalType: ModalType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  itemName?: string;
  icon?: React.ReactNode;
  showFooter?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  centered?: boolean;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  toggle,
  modalType = "confirm",
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  itemName,
  icon,
  showFooter = true,
  size,
  centered = true,
}) => {
  // Default values based on modal type
  const getDefaults = () => {
    const defaults: {
      title: string;
      confirmButtonText: string;
      cancelButtonText: string;
      confirmButtonColor: string;
      icon: React.ReactNode;
      message: string;
    } = {
      title: "",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "primary",
      icon: null,
      message: "",
    };

    switch (modalType) {
      case "delete":
        defaults.title = "Delete Confirmation";
        defaults.confirmButtonText = "Yes, Delete It!";
        defaults.cancelButtonText = "Cancel";
        defaults.confirmButtonColor = "danger";
        defaults.icon = (
          <i className="ri-delete-bin-line display-5 text-danger"></i>
        );
        defaults.message = itemName
          ? `Are you sure you want to delete "${itemName}"?`
          : "Are you sure you want to delete this item?";
        break;
      case "confirm":
        defaults.title = "Confirm Action";
        defaults.confirmButtonText = "Yes, Proceed";
        defaults.cancelButtonText = "Cancel";
        defaults.confirmButtonColor = "primary";
        defaults.icon = (
          <i className="ri-question-line display-5 text-warning"></i>
        );
        defaults.message = "Are you sure you want to proceed with this action?";
        break;
      case "info":
        defaults.title = "Information";
        defaults.confirmButtonText = "OK";
        defaults.confirmButtonColor = "info";
        defaults.icon = (
          <i className="ri-information-line display-5 text-info"></i>
        );
        defaults.message = "Here is some important information.";
        break;
      case "warning":
        defaults.title = "Warning";
        defaults.confirmButtonText = "I Understand";
        defaults.cancelButtonText = "Cancel";
        defaults.confirmButtonColor = "warning";
        defaults.icon = (
          <i className="ri-alert-line display-5 text-warning"></i>
        );
        defaults.message = "Please be careful with this action.";
        break;
      case "success":
        defaults.title = "Success";
        defaults.confirmButtonText = "OK";
        defaults.confirmButtonColor = "success";
        defaults.icon = (
          <i className="ri-checkbox-circle-line display-5 text-success"></i>
        );
        defaults.message = "Operation completed successfully!";
        break;
      case "error":
        defaults.title = "Error";
        defaults.confirmButtonText = "OK";
        defaults.confirmButtonColor = "danger";
        defaults.icon = (
          <i className="ri-error-warning-line display-5 text-danger"></i>
        );
        defaults.message = "An error occurred. Please try again.";
        break;
    }

    return defaults;
  };

  const defaults = getDefaults();

  // Use provided values or defaults
  const modalTitle = title || defaults.title;
  const modalMessage = message || defaults.message;
  const modalConfirmText = confirmButtonText || defaults.confirmButtonText;
  const modalCancelText = cancelButtonText || defaults.cancelButtonText;
  const modalIcon = icon || defaults.icon;
  const buttonColor = defaults.confirmButtonColor;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      toggle();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={centered}
      size={size}
      fade={true}
    >
      {modalTitle && <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>}
      <ModalBody className="py-3 px-5">
        <div className="text-center">
          {modalIcon && <div className="mb-4">{modalIcon}</div>}
          {modalMessage && (
            <div className="mt-2 fs-15 mx-4 mx-sm-5">
              <p className="text-muted mb-0">{modalMessage}</p>
            </div>
          )}
        </div>
      </ModalBody>
      {showFooter && (
        <ModalFooter>
          {modalType !== "info" &&
            modalType !== "success" &&
            modalType !== "error" && (
              <Button color="light" onClick={handleCancel}>
                {modalCancelText}
              </Button>
            )}
          <Button color={buttonColor} onClick={onConfirm}>
            {modalConfirmText}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default CommonModal;
