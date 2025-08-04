import React, { useState, useCallback, useMemo } from "react";
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
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/api/mutations/useUserMutation";
import { useRolesQuery } from "@/api/queries/useRoleQuery";

import TableContainer from "@/components/Common/TableContainer";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "@/components/Common/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModal from "../Common/CommonModal";
import { User } from "@/types/api";

const Users = () => {
  // React Query hooks
  const { data: users = [] } = useUsersQuery();
  const { data: roles = [] } = useRolesQuery();
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

  // Multi-select state
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setSelectedUser(null);
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

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
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
        const userData = {
          fullName: values.fullName,
          email: values.email,
          password: values.password!, // Make password required for create
          phoneNumber: values.phoneNumber,
          address: values.address,
          taxCode: values.taxCode,
          roleId: values.roleId ? Number(values.roleId) : null,
          isActive: true,
          isSuperAdmin: false,
        };

        if (isEdit && selectedUser) {
          await updateUserMutation.mutateAsync({
            id: selectedUser.id,
            ...userData,
          });
          toast.success("User updated successfully");
        } else {
          await createUserMutation.mutateAsync(userData);
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
    const date1 = moment(new Date(date)).format("DD MMM Y");
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
              value={cell.getValue()}
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
      },
      {
        header: "Role",
        accessorKey: "role.name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            <span className="badge bg-primary-subtle text-primary me-1">
              {cell.getValue() || "No Role"}
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
            <ul className="list-inline hstack gap-2 mb-0 ">
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
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleInfo}
                      >
                        <i className="ri-filter-3-line align-bottom me-1"></i>{" "}
                        Filters
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary add-btn"
                        id="create-btn"
                        onClick={() => {
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Add
                        Users
                      </button>
                    </div>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="pt-3">
                <div>
                  {users && users.length ? (
                    <TableContainer
                      columns={columns}
                      data={users || []}
                      isGlobalFilter={false}
                      customPageSize={10}
                      divClass="table-responsive table-card"
                      tableClass="align-middle"
                      theadClass="table-light"
                      isLeadsFilter={false}
                    />
                  ) : (
                    <Loader />
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
                      <Input type="hidden" id="id-field" />
                      <Row className="g-3">
                        <Col lg={12}>
                          <div className="text-center">
                            <div className="position-relative d-inline-block">
                              <div className="position-absolute bottom-0 end-0">
                                <Label
                                  htmlFor="user-image-input"
                                  className="mb-0"
                                >
                                  <div className="avatar-xs cursor-pointer">
                                    <div className="avatar-title bg-light border rounded-circle text-muted">
                                      <i className="ri-image-fill"></i>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </div>
                          </div>
                        </Col>
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
                            <Label htmlFor="phone-field" className="form-label">
                              Phone
                            </Label>
                            <Input
                              name="phone"
                              id="phone-field"
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
                              htmlFor="location-field"
                              className="form-label"
                            >
                              Location
                            </Label>
                            <Input
                              name="location"
                              id="location-field"
                              className="form-control"
                              placeholder="Enter Location"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.address || ""}
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
                                roles.find(
                                  (role) =>
                                    role.id === Number(validation.values.roleId)
                                )
                                  ? {
                                      value: validation.values.roleId,
                                      label: roles.find(
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
                              options={roles.map((role) => ({
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
                        >
                          {!!isEdit ? "Update" : "Add User"}
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

      <CrmFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
      />
    </React.Fragment>
  );
};

export default Users;
