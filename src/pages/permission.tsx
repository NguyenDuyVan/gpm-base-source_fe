import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardHeader, CardBody, Row } from "reactstrap";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useCallback, useMemo } from "react";
import TableContainer from "@/components/Common/TableContainer";
import RoleModal from "@/components/Permission/RoleModal";
import { useRolesWithPermissionsQuery } from "@/api/queries/useRoleQuery";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsMutation,
} from "@/api/mutations/useRoleMutation";
import { toast } from "react-toastify";
import { useState } from "react";
import React from "react";
import CommonModal from "@/components/Common/CommonModal";

const Page: NextPageWithLayout = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  // Fetch roles and permissions using React Query
  const { data: rolesData, isLoading, error } = useRolesWithPermissionsQuery();

  // Get roles data with fallback to empty array
  const roles = rolesData?.roles || [];
  const permissions = rolesData?.permissions || [];

  // Mutations
  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();
  const assignPermissionsMutation = useAssignPermissionsMutation();

  // Add the handleEditRole function
  const handleEditRole = useCallback((roleData: any) => {
    setIsEdit(true);
    setSelectedRole(roleData);
    setModal(true);
  }, []);

  // Add the onClickDelete function
  const onClickDelete = useCallback((roleData: any) => {
    setRoleToDelete(roleData);
    setDeleteModal(true);
  }, []);

  // Handle role deletion confirmation
  const handleDeleteRole = useCallback(async () => {
    if (roleToDelete) {
      try {
        await deleteRoleMutation.mutateAsync(roleToDelete.id);
        toast("Role deleted successfully", {
          position: "top-center",
          className: " text-success-600",
          type: "success",
        });
        setDeleteModal(false);
        setRoleToDelete(null);
      } catch (_error) {
        toast("Failed to delete role", {
          position: "top-center",
          className: " text-danger-600",
          type: "error",
        });
      }
    }
  }, [roleToDelete, deleteRoleMutation]);

  // Handle form submission
  const handleRoleSubmit = useCallback(
    async (data: any) => {
      try {
        const roleData = {
          name: data.role || data.name,
          description: data.description || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        };

        if (isEdit && selectedRole) {
          // Update existing role
          await updateRoleMutation.mutateAsync({
            id: selectedRole.id,
            ...roleData,
          });
          // Assign permissions if any are selected
          if (
            data.selectedPermissions &&
            data.selectedPermissions.length >= 0
          ) {
            await assignPermissionsMutation.mutateAsync({
              roleId: selectedRole.id,
              permissionIds: data.selectedPermissions,
            });
          }
          toast("Role updated successfully", {
            position: "top-center",
            className: " text-success-600",
            type: "success",
          });
        } else {
          // Create new role
          const newRole = await createRoleMutation.mutateAsync(roleData);
          // If permissions were selected, assign them to the new role
          if (data.selectedPermissions && data.selectedPermissions.length > 0) {
            await assignPermissionsMutation.mutateAsync({
              roleId: newRole.id,
              permissionIds: data.selectedPermissions,
            });
          }
          toast("Role created successfully", {
            position: "top-center",
            className: " text-success-600",
            type: "success",
          });
        }
        setModal(false);
      } catch (_error) {
        toast("An error occurred", {
          position: "top-center",
          className: " text-danger-600",
          type: "error",
        });
      }
    },
    [
      isEdit,
      selectedRole,
      updateRoleMutation,
      createRoleMutation,
      assignPermissionsMutation,
    ]
  );

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
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Permissions",
        accessorKey: "rolePermissions",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const rolePermissions = cellProps.row.original.rolePermissions || [];
          const uniqueModules = new Set(
            rolePermissions.map((rp: any) => rp.permission.module)
          );
          return (
            <div className="d-flex align-items-center">
              <span className="badge fs-6  bg-soft-info text-info me-2">
                {uniqueModules.size} Modules
              </span>
              <span className="badge fs-6  bg-soft-primary text-primary">
                {rolePermissions.length} Permissions
              </span>
            </div>
          );
        },
      },
      {
        header: "Description",
        accessorKey: "description",
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
    [handleEditRole, onClickDelete]
  );

  // Show loading state
  if (isLoading) {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading roles...</p>
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

  // Show error state
  if (error) {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <div className="text-center text-danger">
              <i className="ri-error-warning-line fs-1"></i>
              <p className="mt-2">Failed to load roles. Please try again.</p>
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

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
            data={roles || []}
            customPageSize={5}
            SearchPlaceholder="Search Roles..."
          />
        </CardBody>
      </Card>
      <RoleModal
        modal={modal}
        toggle={toggle}
        isEdit={isEdit}
        roleData={selectedRole}
        onSubmit={handleRoleSubmit}
        permissions={permissions}
      />

      <CommonModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        modalType="delete"
        onConfirm={handleDeleteRole}
        itemName={roleToDelete?.name}
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
