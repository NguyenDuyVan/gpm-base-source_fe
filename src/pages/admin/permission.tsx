import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardHeader, CardBody, Row, Col, Input } from "reactstrap";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useCallback, useMemo, useEffect } from "react";
import TableContainer from "@/components/Common/TableContainer";
import RoleModal from "@/components/Permission/RoleModal";
import {
  useRolesWithPermissionsQuery,
  useRolesQuery,
} from "@/api/queries/useRoleQuery";
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
import { PaginationType } from "@/types/pagination";
import { useTranslation } from "react-i18next";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  const [searchInput, setSearchInput] = useState<string>("");

  const [queryParams, setQueryParams] = useState<PaginationType>({
    page: 1,
    limit: 5,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: rolesData, isLoading, error } = useRolesQuery(queryParams);
  const { data: permissionsData } = useRolesWithPermissionsQuery();

  const roles = rolesData?.data || [];
  const permissions = permissionsData?.permissions || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== undefined) {
        setQueryParams((prev) => ({
          ...prev,
          search: searchInput || undefined,
          page: 1,
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: page + 1,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: 1,
    }));
  };

  const handleSort = (column: any, sortDirection: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: column.id || column.accessorKey,
      sortOrder: sortDirection as "asc" | "desc",
    }));
  };

  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();
  const assignPermissionsMutation = useAssignPermissionsMutation();

  const handleEditRole = useCallback((roleData: any) => {
    setIsEdit(true);
    setSelectedRole(roleData);
    setModal(true);
  }, []);

  const onClickDelete = useCallback((roleData: any) => {
    setRoleToDelete(roleData);
    setDeleteModal(true);
  }, []);

  const handleDeleteRole = useCallback(async () => {
    if (roleToDelete) {
      try {
        await deleteRoleMutation.mutateAsync(roleToDelete.id);
        toast(t("Role deleted successfully"), {
          position: "top-center",
          className: " text-success-600",
          type: "success",
        });
        setDeleteModal(false);
        setRoleToDelete(null);
      } catch (_error) {
        toast(t("Failed to delete role"), {
          position: "top-center",
          className: " text-danger-600",
          type: "error",
        });
      }
    }
  }, [roleToDelete, deleteRoleMutation, t]);

  const handleRoleSubmit = useCallback(
    async (data: any) => {
      try {
        const roleData = {
          name: data.role || data.name,
          description: data.description || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        };

        if (isEdit && selectedRole) {
          await updateRoleMutation.mutateAsync({
            id: selectedRole.id,
            ...roleData,
          });

          if (
            data.selectedPermissions &&
            data.selectedPermissions.length >= 0
          ) {
            await assignPermissionsMutation.mutateAsync({
              roleId: selectedRole.id,
              permissionIds: data.selectedPermissions,
            });
          }
          toast(t("Role updated successfully"), {
            position: "top-center",
            className: " text-success-600",
            type: "success",
          });
        } else {
          const newRole = await createRoleMutation.mutateAsync(roleData);

          if (data.selectedPermissions && data.selectedPermissions.length > 0) {
            await assignPermissionsMutation.mutateAsync({
              roleId: newRole.id,
              permissionIds: data.selectedPermissions,
            });
          }
          toast(t("Role created successfully"), {
            position: "top-center",
            className: " text-success-600",
            type: "success",
          });
        }
        setModal(false);
      } catch (_error) {
        toast(t("An error occurred"), {
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
      t,
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
        header: t("Id"),
        accessorKey: "id",
        enableColumnFilter: false,
      },
      {
        header: t("Role"),
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: t("Permissions"),
        accessorKey: "rolePermissions",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps: any) => {
          const rolePermissions = cellProps.row.original.rolePermissions || [];
          const uniqueModules = new Set(
            rolePermissions.map((rp: any) => rp.permission.module)
          );
          return (
            <div className="d-flex align-items-center">
              <span className="badge fs-6  bg-soft-info text-info me-2">
                {uniqueModules.size} {t("Modules")}
              </span>
              <span className="badge fs-6  bg-soft-primary text-primary">
                {rolePermissions.length} {t("Permissions")}
              </span>
            </div>
          );
        },
      },
      {
        header: t("Description"),
        accessorKey: "description",
        enableColumnFilter: false,
      },
      {
        header: t("Action"),
        cell: (cellProps: any) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0 ">
              <li className="list-inline-item" title={t("Edit")}>
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
              <li className="list-inline-item" title={t("Delete")}>
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
    [handleEditRole, onClickDelete, t]
  );

  if (isLoading) {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{t("Loading...")}</span>
              </div>
              <p className="mt-2">{t("Loading roles...")}</p>
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

  if (error) {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <div className="text-center text-danger">
              <i className="ri-error-warning-line fs-1"></i>
              <p className="mt-2">
                {t("Failed to load roles. Please try again.")}
              </p>
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
            <Col sm={3}>
              <div className="search-box">
                <Input
                  type="text"
                  className="form-control search"
                  placeholder={t("Search for roles...")}
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </Col>
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
                <i className="ri-add-line align-bottom me-1"></i>{" "}
                {t("Add Role")}
              </button>
            </div>
          </Row>
        </CardHeader>
        <CardBody className="pt-3">
          {isLoading ? (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t("Loading...")}</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-danger">
              <i className="ri-error-warning-line fs-1"></i>
              <p className="mt-2">
                {t("Failed to load roles. Please try again.")}
              </p>
            </div>
          ) : roles && roles.length > 0 ? (
            <TableContainer
              columns={columns || []}
              data={roles || []}
              isGlobalFilter={false}
              customPageSize={queryParams.limit}
              divClass="table-responsive table-card"
              tableClass="align-middle"
              theadClass="table-light"
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSort={handleSort}
              manualPagination
              totalCount={rolesData?.meta?.totalItems || 0}
              pageIndex={queryParams.page ? queryParams.page - 1 : 0}
              pageSize={queryParams.limit || 5}
            />
          ) : (
            <div className="text-center p-4">
              <div className="avatar-md mx-auto mb-4">
                <div className="avatar-title bg-light rounded-circle text-primary fs-24">
                  <i className="ri-shield-user-line"></i>
                </div>
              </div>
              <h5 className="mt-2">{t("No roles found")}</h5>
              <p className="text-muted">
                {searchInput
                  ? t(`No results found for "${searchInput}"`)
                  : t("Create your first role to get started.")}
              </p>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  setIsEdit(false);
                  toggle();
                }}
              >
                <i className="ri-add-line align-bottom me-1"></i>{" "}
                {t("Add New Role")}
              </button>
            </div>
          )}
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
