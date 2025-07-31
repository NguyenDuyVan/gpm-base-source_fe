import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useCallback, useMemo } from "react";
import TableContainer from "@/components/Common/TableContainer";
import RoleModal from "@/components/Permission/RoleModal";

import { useState } from "react";
import React from "react";

const Page: NextPageWithLayout = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Add the handleEditRole function
  const handleEditRole = (leadData: any) => {
    setIsEdit(true);
    setSelectedRole(leadData);
    setModal(true);
  };

  // Add the onClickDelete function
  const onClickDelete = (leadData: any) => {
    // Implement delete logic here
    // For now, just close the modal or show an alert
    alert(`Delete role: ${leadData.role}`);
  };

  // Handle form submission
  const handleRoleSubmit = (data: any) => {
    if (isEdit) {
      // Update existing role logic
      console.log("Updating role:", data);
      console.log("Role name:", data.role);
      console.log("Permissions:", data.permissions);
      console.log("Selected permissions count:", data.permissions?.length || 0);
    } else {
      // Add new role logic
      console.log("Adding new role:", data);
      console.log("Role name:", data.role);
      console.log("Permissions:", data.permissions);
      console.log("Selected permissions count:", data.permissions?.length || 0);
    }

    // Here you would typically make an API call to save the role
    // Example:
    // if (isEdit) {
    //   updateRole(selectedRole.id, data);
    // } else {
    //   createRole(data);
    // }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setSelectedRole(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const columns = useMemo(
    () => [
      {
        header: "Id",
        accessorKey: "id",
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "role",
        enableColumnFilter: false,
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const permissions = cellProps.row.original.permissions || [];
          const uniqueEndpoints = new Set(
            permissions.map((p: string) => p.split(":")[0])
          );
          return (
            <div className="d-flex align-items-center">
              <span className="badge fs-6  bg-soft-info text-info me-2">
                {uniqueEndpoints.size} APIs
              </span>
              <span className="badge fs-6  bg-soft-primary text-primary">
                {permissions.length} Methods
              </span>
            </div>
          );
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0 ">
              <li className="list-inline-item" title="Edit">
                <span
                  className="edit-item-btn"
                  onClick={() => {
                    const LeadData = cellProps.row.original;
                    handleEditRole(LeadData);
                  }}
                >
                  <i className="cursor-pointer ri-pencil-fill align-bottom text-muted"></i>
                </span>
              </li>
              <li className="list-inline-item" title="Delete">
                <span
                  className="remove-item-btn"
                  onClick={() => {
                    const LeadData = cellProps.row.original;
                    onClickDelete(LeadData);
                  }}
                >
                  <i className="cursor-pointer ri-delete-bin-fill align-bottom text-muted"></i>
                </span>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  const sortingTable = [
    {
      id: "1",
      role: "Admin",
      createdAt: "2023-01-10",
      permissions: [
        "auth:GET",
        "auth:POST",
        "profile:GET",
        "profile:PUT",
        "profile:PATCH",
        "users:GET",
        "users:POST",
        "users:PUT",
        "users:DELETE",
        "roles:GET",
        "roles:POST",
        "roles:PUT",
        "roles:DELETE",
        "products:GET",
        "products:POST",
        "products:PUT",
        "products:DELETE",
        "orders:GET",
        "orders:POST",
        "orders:PUT",
        "orders:DELETE",
        "contacts:GET",
        "contacts:POST",
        "contacts:PUT",
        "contacts:DELETE",
        "companies:GET",
        "companies:POST",
        "companies:PUT",
        "companies:DELETE",
        "tasks:GET",
        "tasks:POST",
        "tasks:PUT",
        "tasks:DELETE",
        "projects:GET",
        "projects:POST",
        "projects:PUT",
        "projects:DELETE",
      ],
    },
    {
      id: "2",
      role: "Editor",
      createdAt: "2023-02-15",
      permissions: [
        "auth:GET",
        "auth:POST",
        "profile:GET",
        "profile:PUT",
        "products:GET",
        "products:POST",
        "products:PUT",
        "orders:GET",
        "orders:POST",
        "contacts:GET",
        "contacts:POST",
        "tasks:GET",
        "tasks:POST",
      ],
    },
    {
      id: "3",
      role: "Viewer",
      createdAt: "2023-03-20",
      permissions: [
        "auth:GET",
        "auth:POST",
        "profile:GET",
        "products:GET",
        "orders:GET",
        "contacts:GET",
        "tasks:GET",
      ],
    },
    {
      id: "4",
      role: "Manager",
      createdAt: "2023-04-05",
      permissions: [
        "auth:GET",
        "auth:POST",
        "profile:GET",
        "profile:PUT",
        "users:GET",
        "products:GET",
        "products:POST",
        "products:PUT",
        "orders:GET",
        "orders:PUT",
        "contacts:GET",
        "contacts:POST",
        "contacts:PUT",
        "tasks:GET",
        "tasks:POST",
        "tasks:PUT",
      ],
    },
    {
      id: "5",
      role: "Contributor",
      createdAt: "2023-05-12",
      permissions: [
        "auth:GET",
        "auth:POST",
        "profile:GET",
        "products:GET",
        "products:POST",
        "contacts:GET",
        "contacts:POST",
        "tasks:GET",
        "tasks:POST",
      ],
    },
  ];

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0">
          <Row className="g-4 align-items-center">
            <div className="col-sm-auto ms-auto">
              <button
                type="button"
                className="btn btn-primary add-btn"
                id="create-btn"
                onClick={() => {
                  setIsEdit(false);
                  toggle();
                }}
              >
                <i className="ri-add-line align-bottom me-1"></i> Add Role
              </button>
            </div>
          </Row>
        </CardHeader>
        <CardBody>
          <TableContainer
            columns={columns || []}
            data={sortingTable || []}
            customPageSize={5}
            SearchPlaceholder="Search Products..."
          />
        </CardBody>
      </Card>
      <RoleModal
        modal={modal}
        toggle={toggle}
        isEdit={isEdit}
        roleData={selectedRole}
        onSubmit={handleRoleSubmit}
      />
    </React.Fragment>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default Page;
