import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Modal,
  Form,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";

// Import React Query hooks
import { useUsersQuery } from "@/api/queries/useUserQuery";
import { useRolesQuery } from "@/api/queries/useRoleQuery";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/api/mutations/useUserMutation";

import TableContainer from "@/components/Common/TableContainer";
import UserFilter from "./Filter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "@/components/Common/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModal from "../Common/CommonModal";
import { User } from "@/types/api";
import { PaginationType } from "@/types/pagination";

const Users = () => {
  // Query params state
  const [queryParams, setQueryParams] = useState<PaginationType>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Search state
  const [searchInput, setSearchInput] = useState<string>("");

  // Filter state
  const [filterData, setFilterData] = useState<any>({
    date: null,
    country: null,
    status: [],
    tags: [],
  });

  // React Query hooks
  const { data: userData, isLoading } = useUsersQuery(queryParams);
  const { data: roleData } = useRolesQuery();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  // Component state
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [isInfoDetails, setIsInfoDetails] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Multi-select state
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setSelectedUser(null);
      setShowPassword(false); // Reset password visibility when closing modal
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete User
  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUserMutation.mutateAsync(selectedUser.id);
        toast.success("User deleted successfully");
        setDeleteModal(false);
      } catch (_error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const onClickDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: (selectedUser && selectedUser.fullName) || "",
      email: (selectedUser && selectedUser.email) || "",
      phoneNumber: (selectedUser && selectedUser.phoneNumber) || "",
      address: (selectedUser && selectedUser.address) || "",
      taxCode: (selectedUser && selectedUser.taxCode) || "",
      roleId: (selectedUser && selectedUser.roleId) || "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Please Enter Full Name"),
      email: Yup.string().email("Invalid email").required("Please Enter Email"),
      phoneNumber: Yup.string().required("Please Enter Phone Number"),
      password: isEdit
        ? Yup.string().optional()
        : Yup.string().required("Please Enter Password"),
    }),
    onSubmit: async (values) => {
      try {
        const userData: any = {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          taxCode: values.taxCode,
          roleId: values.roleId ? Number(values.roleId) : null,
        };

        // Only include password if it's not edit mode or if password is provided in edit mode
        if (!isEdit || (isEdit && values.password)) {
          userData.password = values.password!;
        }

        if (isEdit && selectedUser) {
          await updateUserMutation.mutateAsync({
            id: selectedUser.id,
            ...userData,
          });
          toast.success("User updated successfully");
        } else {
          await createUserMutation.mutateAsync({
            ...userData,
            password: values.password!, // Password is required for new users
          });
          toast.success("User created successfully");
        }

        validation.resetForm();
        toggle();
      } catch (_error) {
        toast.error(isEdit ? "Failed to update user" : "Failed to create user");
      }
    },
  });

  // Update Data
  const handleUserClick = useCallback(
    (user: User) => {
      setSelectedUser(user);
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const handleValidDate = (date: any) => {
    const date1 = moment(new Date(date)).format("DD/MM/YYYY");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".usersCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteCheckbox = () => {
    const ele: any = document.querySelectorAll(".usersCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Delete Multiple Users
  const deleteMultiple = async () => {
    const checkall: any = document.getElementById("checkBoxAll");
    try {
      for (const element of selectedCheckBoxDelete) {
        await deleteUserMutation.mutateAsync(Number(element.value));
      }
      toast.success("Users deleted successfully");
      setIsMultiDeleteButton(false);
      checkall.checked = false;
    } catch (_error) {
      toast.error("Failed to delete users");
    }
  };

  // Column configuration
  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            className="form-check-input"
            id="checkBoxAll"
            onClick={() => checkedAll()}
          />
        ),
        cell: (cell: any) => {
          return (
            <input
              type="checkbox"
              className="usersCheckBox form-check-input"
              value={cell.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
        enableSorting: false,
      },
      {
        header: "Name",
        accessorKey: "fullName",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar-xs">
                  <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                    {cell.getValue().charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 ms-2 name">{cell.getValue()}</div>
            </div>
          </>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "N/A",
      },
      {
        header: "Role",
        accessorKey: "role",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <>
            <span
              className={`badge ${
                cell.getValue()?.name
                  ? "bg-secondary-subtle text-secondary"
                  : "bg-primary-subtle text-primary"
              }`}
            >
              {cell.getValue()?.name || "N/A"}
            </span>
          </>
        ),
      },
      {
        header: "Create Date",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>{cell.getValue() ? handleValidDate(cell.getValue()) : "N/A"}</>
        ),
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="Edit">
                <span
                  className="edit-item-btn"
                  onClick={() => {
                    const userData = cellProps.row.original;
                    handleUserClick(userData);
                  }}
                >
                  <i className="cursor-pointer ri-pencil-fill align-bottom text-muted"></i>
                </span>
              </li>
              <li className="list-inline-item" title="Delete">
                <span
                  className="remove-item-btn"
                  onClick={() => {
                    const userData = cellProps.row.original;
                    onClickDelete(userData);
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
    [handleUserClick, checkedAll]
  );

  // Update search params when search input changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== undefined) {
        setQueryParams((prev) => ({
          ...prev,
          search: searchInput || undefined,
          page: 1, // Reset to first page on new search
        }));
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle filter changes from the Filter component
  const handleFilterChange = (filters: any) => {
    setFilterData(filters);

    // Convert filter data to API query format
    const apiFilters: Record<string, any> = { isActive: true };

    // Add date filter if selected
    if (filters.date && filters.date.length) {
      apiFilters.dateRange = filters.date
        .map((date: Date) => moment(date).format("YYYY-MM-DD"))
        .join(",");
    }

    // Add country filter if selected
    if (filters.country && filters.country.value !== "Select country") {
      apiFilters.country = filters.country.value;
    }

    // Add status filters
    if (filters.status && filters.status.length) {
      apiFilters.status = filters.status.join(",");
    }

    // Add tag filters
    if (filters.tags && filters.tags.length) {
      apiFilters.tags = filters.tags.join(",");
    }

    setQueryParams((prev) => ({
      ...prev,
      filters: apiFilters,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilterData({
      date: null,
      country: null,
      status: [],
      tags: [],
    });

    setQueryParams((prev) => ({
      ...prev,
      filters: { isActive: true },
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: page + 1, // Add 1 because the API expects 1-based page numbers but TableContainer uses 0-based
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: 1, // Reset to first page when changing page size
    }));
  };

  // Handle sorting
  const handleSort = (column: any, sortDirection: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: column.id || column.accessorKey,
      sortOrder: sortDirection as "asc" | "desc",
    }));
  };

  return (
    <React.Fragment>
      <div>
        <CommonModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          modalType="delete"
          onConfirm={handleDeleteUser}
        />

        <CommonModal
          isOpen={deleteModalMulti}
          toggle={() => setDeleteModalMulti(false)}
          modalType="delete"
          onConfirm={deleteMultiple}
        />

        <Row>
          <Col lg={12}>
            <Card id="usersList">
              <CardHeader className="border-0">
                <Row className="g-4 align-items-center">
                  <Col sm={3}>
                    <div className="search-box">
                      <Input
                        type="text"
                        className="form-control search"
                        placeholder="Search for..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <div className="col-sm-auto ms-auto">
                    <div className="hstack gap-2">
                      {isMultiDeleteButton && (
                        <button
                          className="btn btn-soft-danger"
                          id="remove-actions"
                          onClick={() => setDeleteModalMulti(true)}
                        >
                          <i className="ri-delete-bin-2-line"></i>
                        </button>
                      )}
                      {/* <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleInfo}
                      >
                        <i className="ri-filter-3-line align-bottom me-1"></i>{" "}
                        Filters
                      </button> */}
                      <button
                        type="button"
                        className="btn btn-primary add-btn"
                        id="create-btn"
                        onClick={() => {
                          setIsEdit(false);
                          setSelectedUser(null);
                          toggle();
                        }}
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Add
                        User
                      </button>
                    </div>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="pt-3">
                <div>
                  {isLoading ? (
                    <Loader />
                  ) : userData?.data && userData?.data.length ? (
                    <TableContainer
                      columns={columns}
                      data={userData.data || []}
                      isGlobalFilter={false}
                      customPageSize={10}
                      divClass="table-responsive table-card"
                      tableClass="align-middle"
                      theadClass="table-light"
                      isLeadsFilter={false}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      onSort={handleSort}
                      manualPagination
                      totalCount={userData?.meta?.totalItems || 0}
                      pageIndex={queryParams.page ? queryParams.page - 1 : 0}
                      pageSize={queryParams.limit || 10}
                    />
                  ) : (
                    <div className="text-center py-4">
                      <p>No users found</p>
                    </div>
                  )}
                </div>

                <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                  <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {!!isEdit ? "Edit User" : "Add User"}
                  </ModalHeader>
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <ModalBody>
                      <Row className="g-3">
                        <Col lg={12}>
                          <div>
                            <Label
                              htmlFor="fullName-field"
                              className="form-label"
                            >
                              Full Name
                            </Label>
                            <Input
                              name="fullName"
                              id="fullName-field"
                              className="form-control"
                              placeholder="Enter Full Name"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.fullName || ""}
                              invalid={
                                validation.touched.fullName &&
                                validation.errors.fullName
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.fullName &&
                            validation.errors.fullName ? (
                              <FormFeedback type="invalid">
                                {validation.errors.fullName}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div>
                            <Label htmlFor="email-field" className="form-label">
                              Email
                            </Label>
                            <Input
                              name="email"
                              id="email-field"
                              className="form-control"
                              placeholder="Enter Email"
                              type="email"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div>
                            <Label
                              htmlFor="password-field"
                              className="form-label"
                            >
                              Password{" "}
                              {!isEdit && (
                                <span className="text-danger">*</span>
                              )}
                            </Label>
                            <div className="position-relative">
                              <Input
                                name="password"
                                id="password-field"
                                className="form-control"
                                placeholder={
                                  isEdit
                                    ? "Leave blank to keep current"
                                    : "Enter Password"
                                }
                                type={showPassword ? "text" : "password"}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.password || ""}
                                invalid={
                                  validation.touched.password &&
                                  validation.errors.password
                                    ? true
                                    : false
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                style={{ zIndex: 3 }}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <i
                                  className={`ri-${
                                    showPassword ? "eye-off" : "eye"
                                  }-line`}
                                ></i>
                              </button>
                            </div>
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div>
                            <Label
                              htmlFor="phoneNumber-field"
                              className="form-label"
                            >
                              Phone Number
                            </Label>
                            <Input
                              name="phoneNumber"
                              id="phoneNumber-field"
                              className="form-control"
                              placeholder="Enter Phone Number"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.phoneNumber || ""}
                              invalid={
                                validation.touched.phoneNumber &&
                                validation.errors.phoneNumber
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.phoneNumber &&
                            validation.errors.phoneNumber ? (
                              <FormFeedback type="invalid">
                                {validation.errors.phoneNumber}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div>
                            <Label
                              htmlFor="address-field"
                              className="form-label"
                            >
                              Address
                            </Label>
                            <Input
                              name="address"
                              id="address-field"
                              className="form-control"
                              placeholder="Enter Address"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.address || ""}
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div>
                            <Label
                              htmlFor="taxCode-field"
                              className="form-label"
                            >
                              Tax Code
                            </Label>
                            <Input
                              name="taxCode"
                              id="taxCode-field"
                              className="form-control"
                              placeholder="Enter Tax Code"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.taxCode || ""}
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div>
                            <Label htmlFor="role-field" className="form-label">
                              Role
                            </Label>
                            <Select
                              name="roleId"
                              id="role-field"
                              value={
                                roleData?.data.find(
                                  (role) =>
                                    role.id === Number(validation.values.roleId)
                                )
                                  ? {
                                      value: validation.values.roleId,
                                      label: roleData?.data.find(
                                        (role) =>
                                          role.id ===
                                          Number(validation.values.roleId)
                                      )?.name,
                                    }
                                  : null
                              }
                              onChange={(selectedOption: any) => {
                                validation.setFieldValue(
                                  "roleId",
                                  selectedOption?.value || ""
                                );
                              }}
                              options={roleData?.data.map((role) => ({
                                value: role.id,
                                label: role.name,
                              }))}
                              isClearable
                              placeholder="Select Role"
                              className="mb-0"
                            />
                          </div>
                        </Col>
                      </Row>
                    </ModalBody>
                    <ModalFooter>
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setModal(false);
                          }}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success"
                          id="add-btn"
                          disabled={
                            createUserMutation.isPending ||
                            updateUserMutation.isPending
                          }
                        >
                          {createUserMutation.isPending ||
                          updateUserMutation.isPending ? (
                            <>
                              <i className="spinner-border spinner-border-sm me-1"></i>
                              {!!isEdit ? "Updating..." : "Adding..."}
                            </>
                          ) : (
                            <>{!!isEdit ? "Update User" : "Add User"}</>
                          )}
                        </button>
                      </div>
                    </ModalFooter>
                  </Form>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <UserFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilters}
        initialFilterData={filterData}
      />
    </React.Fragment>
  );
};

export default Users;
