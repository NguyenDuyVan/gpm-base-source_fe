import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Input,
  Row,
  Col,
  Label,
  Badge,
} from "reactstrap";
import { Permission } from "@/types/api";
import { useAssignPermissionsMutation } from "@/api/mutations/useRoleMutation";

interface RoleModalProps {
  modal: boolean;
  toggle: () => void;
  isEdit: boolean;
  roleData?: any;
  onSubmit?: (data: any) => void;
  permissions?: Permission[];
}

const RoleModal: React.FC<RoleModalProps> = ({
  modal,
  toggle,
  isEdit,
  roleData,
  onSubmit,
  permissions = [],
}) => {
  const { t } = useTranslation();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [roleName, setRoleName] = useState("");

  // Mutation for assigning permissions
  const assignPermissionsMutation = useAssignPermissionsMutation();

  // Utility function to generate module name from apiPath
  const getModuleName = (apiPath: string): string => {
    const pathParts = apiPath
      .split("/")
      .filter((part) => part && !part.includes(":"));
    if (pathParts.length >= 3) {
      const moduleName = pathParts[2]; // e.g., "permissions" or "roles"
      return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    }
    return t("General");
  };

  // Utility function to generate permission name from apiPath and method
  const getPermissionName = (apiPath: string, method: string): string => {
    const pathParts = apiPath
      .split("/")
      .filter((part) => part && !part.includes(":"));
    if (pathParts.length >= 3) {
      const resource = pathParts[2]; // e.g., "permissions" or "roles"
      const action = method.toLowerCase();

      // Handle special cases
      if (apiPath.includes("assign-permissions")) {
        return t("Assign {{resource}} permissions", { resource });
      }

      // Standard CRUD operations
      switch (action) {
        case "get":
          return apiPath.includes("/:")
            ? t("View {{resource}}", { resource })
            : t("List {{resource}}", { resource });
        case "post":
          return t("Create {{resource}}", { resource });
        case "put":
        case "patch":
          return t("Update {{resource}}", { resource });
        case "delete":
          return t("Delete {{resource}}", { resource });
        default:
          return `${action} ${resource}`;
      }
    }
    return `${method} ${apiPath}`;
  };

  // Group permissions by module (derived from apiPath)
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      const moduleName = getModuleName(permission.apiPath);
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }

      // Add generated name if not provided
      const enhancedPermission = {
        ...permission,
        name: getPermissionName(permission.apiPath, permission.method),
        module: moduleName,
      };

      acc[moduleName].push(enhancedPermission);
      return acc;
    }, {} as Record<string, (Permission & { name: string; module: string })[]>);
  }, [permissions, t]);

  // Initialize permissions when modal opens or roleData changes
  useEffect(() => {
    if (modal) {
      if (isEdit && roleData) {
        setRoleName(roleData.name || "");
        // Get currently assigned permission IDs from rolePermissions
        const currentPermissionIds =
          roleData.rolePermissions?.map((rp: any) => rp.permission.id) || [];
        setSelectedPermissions(new Set(currentPermissionIds));
        setSelectAll(currentPermissionIds.length === permissions.length);
      } else {
        setRoleName("");
        setSelectedPermissions(new Set());
        setSelectAll(false);
      }
    }
  }, [modal, isEdit, roleData, permissions.length]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const newPermissions = new Set(selectedPermissions);
    if (checked) {
      newPermissions.add(permissionId);
    } else {
      newPermissions.delete(permissionId);
    }
    setSelectedPermissions(newPermissions);
    setSelectAll(newPermissions.size === permissions.length);
  };

  const handleModuleSelectAll = (
    modulePermissions: Permission[],
    checked: boolean
  ) => {
    const newPermissions = new Set(selectedPermissions);
    modulePermissions.forEach((permission) => {
      if (checked) {
        newPermissions.add(permission.id);
      } else {
        newPermissions.delete(permission.id);
      }
    });
    setSelectedPermissions(newPermissions);
    setSelectAll(newPermissions.size === permissions.length);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPermissionIds = new Set(permissions.map((p) => p.id));
      setSelectedPermissions(allPermissionIds);
    } else {
      setSelectedPermissions(new Set());
    }
    setSelectAll(checked);
  };

  const isModuleFullySelected = (modulePermissions: Permission[]) => {
    return modulePermissions.every((permission) =>
      selectedPermissions.has(permission.id)
    );
  };

  const isModulePartiallySelected = (modulePermissions: Permission[]) => {
    const selectedCount = modulePermissions.filter((permission) =>
      selectedPermissions.has(permission.id)
    ).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "GET":
        return "success";
      case "POST":
        return "primary";
      case "PUT":
        return "warning";
      case "PATCH":
        return "info";
      case "DELETE":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: roleName,
      description: "",
      isActive: true,
    };

    if (isEdit && roleData) {
      // For editing, first update the role, then assign permissions
      if (onSubmit) {
        onSubmit(data);
      }

      // Assign permissions to the role
      try {
        await assignPermissionsMutation.mutateAsync({
          roleId: roleData.id,
          permissionIds: Array.from(selectedPermissions),
        });
        toggle();
      } catch (error) {
        console.error("Error assigning permissions:", error);
      }
    } else {
      // For creating new role, submit the role data with selected permissions
      if (onSubmit) {
        onSubmit({
          ...data,
          selectedPermissions: Array.from(selectedPermissions),
        });
      }
      toggle();
    }
  };

  return (
    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
      <ModalHeader className="bg-light p-3" toggle={toggle}>
        {isEdit ? t("Edit Role") : t("Add Role")}
      </ModalHeader>
      <Form className="tablelist-form" onSubmit={handleSubmit}>
        <ModalBody>
          <Row className="g-3">
            <Col lg={12}>
              <div>
                <Label htmlFor="role-field" className="form-label">
                  {t("Role Name")} <span className="text-danger">*</span>
                </Label>
                <Input
                  name="role"
                  id="role-field"
                  className="form-control"
                  placeholder={t("Enter Role Name")}
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>
            </Col>
          </Row>

          {permissions.length > 0 && (
            <Row className="mt-4">
              <Col lg={12}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{t("Permissions")}</h5>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="select-all"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <Label className="form-check-label" htmlFor="select-all">
                      {t("Select All Permissions")}
                    </Label>
                  </div>
                </div>

                <div
                  className="border rounded p-3"
                  style={{ maxHeight: "500px", overflowY: "auto" }}
                >
                  {Object.entries(groupedPermissions).map(
                    ([moduleName, modulePermissions]) => (
                      <div key={moduleName} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="text-primary mb-0 border-bottom pb-2">
                            <i className="mdi mdi-folder-outline me-1"></i>
                            {moduleName}
                          </h6>
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id={`module-${moduleName}`}
                              checked={isModuleFullySelected(modulePermissions)}
                              ref={(input) => {
                                if (input) {
                                  const inputElement = input as any;
                                  inputElement.indeterminate =
                                    isModulePartiallySelected(
                                      modulePermissions
                                    );
                                }
                              }}
                              onChange={(e) =>
                                handleModuleSelectAll(
                                  modulePermissions,
                                  e.target.checked
                                )
                              }
                            />
                            <Label
                              className="form-check-label"
                              htmlFor={`module-${moduleName}`}
                            >
                              {t("Select All")} {moduleName}
                            </Label>
                          </div>
                        </div>

                        <div className="row">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="col-md-6 col-lg-4 mb-3"
                            >
                              <div className="border rounded p-3 h-100">
                                <div className="form-check mb-2">
                                  <Input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`permission-${permission.id}`}
                                    checked={selectedPermissions.has(
                                      permission.id
                                    )}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        permission.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`permission-${permission.id}`}
                                    className="form-check-label fw-medium"
                                  >
                                    {permission.name}
                                  </Label>
                                </div>
                                <div className="text-muted small mb-2">
                                  <code>{permission.apiPath}</code>
                                </div>
                                <Badge
                                  color={getMethodBadgeColor(permission.method)}
                                  className="font-size-10"
                                >
                                  {permission.method}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-3 p-2 bg-light rounded">
                  <small className="text-muted">
                    <i className="mdi mdi-information-outline me-1"></i>
                    {t("Selected")} {selectedPermissions.size} {t("of")}{" "}
                    {permissions.length} {t("permissions")}
                  </small>
                </div>
              </Col>
            </Row>
          )}

          {permissions.length === 0 && (
            <Row className="mt-4">
              <Col lg={12}>
                <div className="text-center text-muted">
                  <i className="mdi mdi-information-outline me-1"></i>
                  {t(
                    "No permissions available. Please make sure permissions are loaded."
                  )}
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-light"
              onClick={toggle}
              disabled={assignPermissionsMutation.isPending}
            >
              {t("Close")}
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={!roleName.trim() || assignPermissionsMutation.isPending}
            >
              {assignPermissionsMutation.isPending
                ? t("Processing...")
                : isEdit
                ? t("Update Role")
                : t("Add Role")}
            </button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default RoleModal;
