import React, { useState, useEffect, useCallback, useMemo } from "react";
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

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  methods: string[];
  category: string;
}

interface RoleModalProps {
  modal: boolean;
  toggle: () => void;
  isEdit: boolean;
  roleData?: any;
  onSubmit?: (data: any) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  modal,
  toggle,
  isEdit,
  roleData,
  onSubmit,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  // Sample API endpoints with multiple methods
  const apiEndpoints: ApiEndpoint[] = useMemo(
    () => [
      // Auth endpoints
      {
        id: "auth",
        name: "Authentication",
        url: "/auth",
        methods: ["GET", "POST"],
        category: "Authentication",
      },
      {
        id: "profile",
        name: "User Profile",
        url: "/user",
        methods: ["GET", "PUT", "PATCH"],
        category: "Authentication",
      },

      // User Management
      {
        id: "users",
        name: "User Management",
        url: "/users",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "User Management",
      },
      {
        id: "roles",
        name: "Role Management",
        url: "/roles",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "User Management",
      },

      // Products
      {
        id: "products",
        name: "Product Management",
        url: "/apps/product",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "E-commerce",
      },
      {
        id: "categories",
        name: "Product Categories",
        url: "/categories",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "E-commerce",
      },

      // Orders
      {
        id: "orders",
        name: "Order Management",
        url: "/apps/order",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "E-commerce",
      },
      {
        id: "payments",
        name: "Payment Processing",
        url: "/payments",
        methods: ["GET", "POST"],
        category: "E-commerce",
      },

      // CRM
      {
        id: "contacts",
        name: "Contact Management",
        url: "/apps/contact",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "CRM",
      },
      {
        id: "companies",
        name: "Company Management",
        url: "/apps/company",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "CRM",
      },
      {
        id: "leads",
        name: "Lead Management",
        url: "/leads",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "CRM",
      },

      // Tasks
      {
        id: "tasks",
        name: "Task Management",
        url: "/apps/task",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "Project Management",
      },
      {
        id: "projects",
        name: "Project Management",
        url: "/projects",
        methods: ["GET", "POST", "PUT", "DELETE"],
        category: "Project Management",
      },
    ],
    []
  );

  // Group endpoints by category
  const groupedEndpoints = apiEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  // Get all possible permission combinations
  const getAllPermissions = useCallback(() => {
    const permissions: string[] = [];
    apiEndpoints.forEach((endpoint) => {
      endpoint.methods.forEach((method) => {
        permissions.push(`${endpoint.id}:${method}`);
      });
    });
    return permissions;
  }, [apiEndpoints]);

  // Initialize permissions when modal opens or roleData changes
  useEffect(() => {
    if (modal) {
      if (isEdit && roleData?.permissions) {
        const permissions = new Set<string>(roleData.permissions);
        setSelectedPermissions(permissions);
        setSelectAll(permissions.size === getAllPermissions().length);
      } else {
        setSelectedPermissions(new Set());
        setSelectAll(false);
      }
    }
  }, [modal, isEdit, roleData, getAllPermissions]);

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    const newPermissions = new Set(selectedPermissions);
    if (checked) {
      newPermissions.add(permissionKey);
    } else {
      newPermissions.delete(permissionKey);
    }
    setSelectedPermissions(newPermissions);
    setSelectAll(newPermissions.size === getAllPermissions().length);
  };

  const handleEndpointSelectAll = (endpointId: string, checked: boolean) => {
    const endpoint = apiEndpoints.find((ep) => ep.id === endpointId);
    if (!endpoint) return;

    const newPermissions = new Set(selectedPermissions);
    endpoint.methods.forEach((method) => {
      const permissionKey = `${endpointId}:${method}`;
      if (checked) {
        newPermissions.add(permissionKey);
      } else {
        newPermissions.delete(permissionKey);
      }
    });
    setSelectedPermissions(newPermissions);
    setSelectAll(newPermissions.size === getAllPermissions().length);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPermissions = new Set(getAllPermissions());
      setSelectedPermissions(allPermissions);
    } else {
      setSelectedPermissions(new Set());
    }
    setSelectAll(checked);
  };

  const isEndpointFullySelected = (endpointId: string) => {
    const endpoint = apiEndpoints.find((ep) => ep.id === endpointId);
    if (!endpoint) return false;
    return endpoint.methods.every((method) =>
      selectedPermissions.has(`${endpointId}:${method}`)
    );
  };

  const isEndpointPartiallySelected = (endpointId: string) => {
    const endpoint = apiEndpoints.find((ep) => ep.id === endpointId);
    if (!endpoint) return false;
    const selectedMethods = endpoint.methods.filter((method) =>
      selectedPermissions.has(`${endpointId}:${method}`)
    );
    return (
      selectedMethods.length > 0 &&
      selectedMethods.length < endpoint.methods.length
    );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      role: formData.get("role"),
      permissions: Array.from(selectedPermissions),
    };

    if (onSubmit) {
      onSubmit(data);
    }

    toggle(); // Close modal after submit
    return false;
  };

  return (
    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
      <ModalHeader className="bg-light p-3" toggle={toggle}>
        {!!isEdit ? "Edit Role" : "Add Role"}
      </ModalHeader>
      <Form className="tablelist-form" onSubmit={handleSubmit}>
        <ModalBody>
          <Input type="hidden" id="id-field" value={roleData?.id || ""} />
          <Row className="g-3">
            <Col lg={12}>
              <div>
                <Label htmlFor="role-field" className="form-label">
                  Role Name
                </Label>
                <Input
                  name="role"
                  id="role-field"
                  className="form-control"
                  placeholder="Enter Role Name"
                  type="text"
                  defaultValue={roleData?.role || ""}
                  validate={{
                    required: { value: true },
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">API Permissions</h5>
                <div className="form-check">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="select-all"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <Label className="form-check-label" htmlFor="select-all">
                    Select All APIs & Methods
                  </Label>
                </div>
              </div>

              <div
                className="border rounded p-3"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {Object.entries(groupedEndpoints).map(
                  ([category, endpoints]) => (
                    <div key={category} className="mb-4">
                      <h6 className="text-primary mb-3 border-bottom pb-2">
                        <i className="mdi mdi-folder-outline me-1"></i>
                        {category}
                      </h6>

                      {endpoints.map((endpoint) => (
                        <div
                          key={endpoint.id}
                          className="border rounded mb-3 p-3 bg-light"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <div className="form-check me-3">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`endpoint-${endpoint.id}`}
                                  checked={isEndpointFullySelected(endpoint.id)}
                                  ref={(input) => {
                                    if (input) {
                                      const inputElement = input as any;
                                      inputElement.indeterminate =
                                        isEndpointPartiallySelected(
                                          endpoint.id
                                        );
                                    }
                                  }}
                                  onChange={(e) =>
                                    handleEndpointSelectAll(
                                      endpoint.id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`endpoint-${endpoint.id}`}
                                  className="form-check-label mb-0 fw-medium"
                                >
                                  {endpoint.name}
                                </Label>
                                <div>
                                  <code className="text-muted small">
                                    {endpoint.url}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <small className="text-muted mb-2 d-block">
                              Available Methods:
                            </small>
                            <div className="d-flex flex-wrap gap-2">
                              {endpoint.methods.map((method) => {
                                const permissionKey = `${endpoint.id}:${method}`;
                                const isSelected =
                                  selectedPermissions.has(permissionKey);

                                return (
                                  <div
                                    key={method}
                                    className="form-check form-check-inline"
                                  >
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`permission-${permissionKey}`}
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          permissionKey,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <Label
                                      htmlFor={`permission-${permissionKey}`}
                                      className="form-check-label"
                                    >
                                      <Badge
                                        color={
                                          isSelected
                                            ? getMethodBadgeColor(method)
                                            : "light"
                                        }
                                        className={`font-size-10 ${
                                          isSelected
                                            ? "text-white"
                                            : "text-muted"
                                        }`}
                                      >
                                        {method}
                                      </Badge>
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 p-2 bg-light rounded">
                <small className="text-muted">
                  <i className="mdi mdi-information-outline me-1"></i>
                  Selected {selectedPermissions.size} of{" "}
                  {getAllPermissions().length} API method permissions
                </small>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <button type="button" className="btn btn-light" onClick={toggle}>
              Close
            </button>
            <button type="submit" className="btn btn-success" id="add-btn">
              {!!isEdit ? "Update Role" : "Add Role"}
            </button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default RoleModal;
