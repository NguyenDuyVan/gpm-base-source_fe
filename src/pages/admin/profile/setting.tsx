import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//import images
import Link from "next/link";
import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { useAccountQuery } from "@/api/queries/useAuthQuery";
import {
  AccountUpdateData,
  PasswordUpdateData,
  useUpdateAccountMutation,
  useUpdatePasswordMutation,
} from "@/api/mutations/useAccountMutation";

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");
  const [formData, setFormData] = useState<AccountUpdateData>({
    fullName: "",
    address: "",
    phoneNumber: "",
    taxCode: "",
    isActive: true,
  });
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errorMessage: "",
  });

  // Fetch account data
  const { data: accountData, isLoading } = useAccountQuery();

  // Update mutations
  const updateAccountMutation = useUpdateAccountMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  // Load account data when available
  useEffect(() => {
    if (accountData) {
      setFormData({
        fullName: accountData.fullName || "",
        address: accountData.address || "",
        phoneNumber: accountData.phoneNumber || "",
        taxCode: accountData.taxCode || "",
        isActive: accountData.isActive,
      });
    }
  }, [accountData]);

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData({
      ...passwordData,
      [id === "oldpasswordInput"
        ? "oldPassword"
        : id === "newpasswordInput"
        ? "newPassword"
        : id === "confirmpasswordInput"
        ? "confirmPassword"
        : id]: value,
    });
  };

  // Password validation function
  const validatePassword = (password: string, confirmPassword: string) => {
    if (!password) {
      setPasswordValidation({
        isValid: false,
        errorMessage: "Password is required",
      });
      return false;
    }

    if (password.length < 8) {
      setPasswordValidation({
        isValid: false,
        errorMessage: "Password must be at least 8 characters long",
      });
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordValidation({
        isValid: false,
        errorMessage: "Passwords do not match",
      });
      return false;
    }

    setPasswordValidation({
      isValid: true,
      errorMessage: "",
    });
    return true;
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
    if (/[a-z]/.test(password)) strength += 1; // Has lowercase
    if (/[0-9]/.test(password)) strength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Has special char

    return Math.min(strength, 5); // Max strength is 5
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
        return "danger";
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "success";
      case 5:
        return "success";
      default:
        return "";
    }
  };

  // Validate passwords when they change
  useEffect(() => {
    if (passwordData.newPassword || passwordData.confirmPassword) {
      validatePassword(passwordData.newPassword, passwordData.confirmPassword);
    }
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  const handleUpdateProfile = () => {
    if (!accountData?.id) {
      toast.error("User ID not found");
      return;
    }

    updateAccountMutation.mutate(
      {
        id: accountData.id,
        ...formData,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
      }
    );
  };

  const handleUpdatePassword = () => {
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errorMessage);
      return;
    }

    updatePasswordMutation.mutate(passwordData, {
      onSuccess: () => {
        toast.success("Password updated successfully");
        // Reset password fields
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
    });
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Card className="mt-3 card-bg-fill">
          <CardHeader>
            <Nav
              className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
              role="tablist"
            >
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    tabChange("1");
                  }}
                >
                  <i className="fas fa-home"></i>
                  {t("Personal Details")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    tabChange("2");
                  }}
                  type="button"
                >
                  <i className="far fa-user"></i>
                  {t("Change Password")}
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="p-4">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {isLoading ? (
                  <div className="text-center my-5">Loading...</div>
                ) : (
                  <Form>
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="firstnameInput"
                            className="form-label"
                          >
                            {t("Full Name")}
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="phonenumberInput"
                            className="form-label"
                          >
                            {t("Phone Number")}
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            placeholder="Enter your phone number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="emailInput" className="form-label">
                            Email Address
                          </Label>
                          <Input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="Enter your email"
                            value={accountData?.email || ""}
                            disabled // Email shouldn't be editable
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="taxCodeInput" className="form-label">
                            Tax Code
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="taxCode"
                            placeholder="Enter your tax code"
                            value={formData.taxCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="JoiningdatInput"
                            className="form-label"
                          >
                            Joining Date
                          </Label>
                          <Flatpickr
                            className="form-control"
                            options={{
                              dateFormat: "d M, Y",
                            }}
                            value={selectedDate || accountData?.createdAt}
                            onChange={([date]) => setSelectedDate(date)}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Label htmlFor="address" className="form-label">
                            {t("Address")}
                          </Label>
                          <Input
                            type="textarea"
                            className="form-control"
                            id="address"
                            rows={3}
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdateProfile}
                            disabled={updateAccountMutation.isPending}
                          >
                            {updateAccountMutation.isPending
                              ? "Updating..."
                              : t("Update Profile")}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                )}
              </TabPane>

              <TabPane tabId="2">
                <Form>
                  <Row className="g-2">
                    <Col lg={4}>
                      <div>
                        <Label
                          htmlFor="oldpasswordInput"
                          className="form-label"
                        >
                          {t("Old Password")}*
                        </Label>
                        <Input
                          type="password"
                          className="form-control"
                          id="oldpasswordInput"
                          placeholder="Enter current password"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div>
                        <Label
                          htmlFor="newpasswordInput"
                          className="form-label"
                        >
                          {t("New Password")}*
                        </Label>
                        <Input
                          type="password"
                          className="form-control"
                          id="newpasswordInput"
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        {passwordData.newPassword && (
                          <div className="mt-1">
                            <div className="d-flex justify-content-between">
                              <small>Password Strength:</small>
                              <small
                                className={`text-${getPasswordStrengthColor(
                                  calculatePasswordStrength(
                                    passwordData.newPassword
                                  )
                                )}`}
                              >
                                {getPasswordStrengthLabel(
                                  calculatePasswordStrength(
                                    passwordData.newPassword
                                  )
                                )}
                              </small>
                            </div>
                            <div
                              className="progress mt-1"
                              style={{ height: "5px" }}
                            >
                              <div
                                className={`progress-bar bg-${getPasswordStrengthColor(
                                  calculatePasswordStrength(
                                    passwordData.newPassword
                                  )
                                )}`}
                                role="progressbar"
                                style={{
                                  width: `${
                                    (calculatePasswordStrength(
                                      passwordData.newPassword
                                    ) /
                                      5) *
                                    100
                                  }%`,
                                }}
                                aria-valuenow={
                                  (calculatePasswordStrength(
                                    passwordData.newPassword
                                  ) /
                                    5) *
                                  100
                                }
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div>
                        <Label
                          htmlFor="confirmpasswordInput"
                          className="form-label"
                        >
                          {t("Confirm Password")}*
                        </Label>
                        <Input
                          type="password"
                          className="form-control"
                          id="confirmpasswordInput"
                          placeholder="Confirm password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        {passwordData.newPassword &&
                          passwordData.confirmPassword &&
                          !passwordValidation.isValid && (
                            <div className="text-danger mt-1">
                              {passwordValidation.errorMessage}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="mb-3">
                        <Link
                          href="#"
                          className="link-primary text-decoration-underline"
                        >
                          Forgot Password ?
                        </Link>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleUpdatePassword}
                          disabled={updatePasswordMutation.isPending}
                        >
                          {updatePasswordMutation.isPending
                            ? "Updating..."
                            : t("Update Password")}
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
};

Settings.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default Settings;
