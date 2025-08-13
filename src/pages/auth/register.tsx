import React, { useEffect } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";

import { useTranslation } from "react-i18next";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";
import ParticlesAuth from "@/components/AuthenticationInner/ParticlesAuth";
import Link from "next/link";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import Head from "next/head";
import { NextPageWithLayout } from "../_app";
import { useRegisterMutation } from "@/api/mutations/useAuthMutation";
import { URL_MANAGEMENT } from "@/constants";

const Register: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // React Query mutation
  const registerMutation = useRegisterMutation();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      first_name: "",
      password: "",
      confirm_password: "",
      address: "",
      phoneNumber: "",
      taxCode: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      first_name: Yup.string().required("Please Enter Your Full Name"),
      password: Yup.string().required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""])
        .required("Confirm Password is required"),
      address: Yup.string(),
      phoneNumber: Yup.string(),
      taxCode: Yup.string(),
    }),
    onSubmit: (values) => {
      // Create the registration data object according to API requirements
      const registrationData = {
        email: values.email,
        password: values.password,
        fullName: values.first_name,
        address: values.address,
        phoneNumber: values.phoneNumber,
        taxCode: values.taxCode,
      };

      // Use the React Query mutation
      registerMutation.mutate(registrationData, {
        onSuccess: () => {
          toast("Registration successful! Redirecting to login page...", {
            position: "top-right",
            hideProgressBar: false,
            className: "bg-success text-white",
            progress: undefined,
            toastId: "",
          });
          setTimeout(() => router.push(URL_MANAGEMENT.LOGIN), 3000);
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "Registration failed. Please try again.",
            {
              position: "top-right",
              hideProgressBar: false,
              progress: undefined,
              toastId: "",
            }
          );
        },
      });
    },
  });

  // Display success message and redirect to login page on successful registration
  useEffect(() => {
    if (registerMutation.isSuccess) {
      const redirectTimer = setTimeout(() => {
        router.push(URL_MANAGEMENT.LOGIN);
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [registerMutation.isSuccess, router]);

  return (
    <NonAuthLayout>
      <Head>
        <title>Sign Up | GPM</title>
      </Head>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={8}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">
                        {t("Create New Account")}
                      </h5>
                      <p className="text-muted">
                        {t("Get your free GPM account now")}
                      </p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {registerMutation.isSuccess ? (
                          <>
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Registration successful! Redirecting to the login
                              page...
                            </Alert>
                          </>
                        ) : null}

                        {registerMutation.isError ? (
                          <Alert color="danger">
                            <div>
                              {(registerMutation.error as any)?.message ||
                                "Registration failed. Please try again."}
                            </div>
                          </Alert>
                        ) : null}
                        <Row>
                          <Col xs={12} md={6} className="mt-3">
                            <Label htmlFor="useremail" className="form-label">
                              Email <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              className="form-control"
                              placeholder="Enter email address"
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
                                <div>{validation.errors.email}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>

                          <Col xs={12} md={6} className="mt-3">
                            <Label htmlFor="username" className="form-label">
                              Full Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="first_name"
                              type="text"
                              placeholder="Enter your full name"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.first_name || ""}
                              invalid={
                                validation.touched.first_name &&
                                validation.errors.first_name
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.first_name &&
                            validation.errors.first_name ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.first_name}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>

                          <Col xs={12} md={6} className="mt-3">
                            <Label
                              htmlFor="userpassword"
                              className="form-label"
                            >
                              Password <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="password"
                              type="password"
                              placeholder="Enter Password"
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
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.password}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>

                          <Col xs={12} md={6} className="mt-3">
                            <Label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
                              Confirm Password{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="confirm_password"
                              type="password"
                              placeholder="Confirm Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.confirm_password || ""}
                              invalid={
                                validation.touched.confirm_password &&
                                validation.errors.confirm_password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.confirm_password &&
                            validation.errors.confirm_password ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.confirm_password}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>
                          <Col xs={12} md={6} className="mt-3">
                            <Label htmlFor="phoneNumber" className="form-label">
                              Phone Number
                            </Label>
                            <Input
                              name="phoneNumber"
                              type="text"
                              placeholder="Enter your phone number"
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
                                <div>{validation.errors.phoneNumber}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>

                          <Col xs={12} md={6} className="mt-3">
                            <Label htmlFor="taxCode" className="form-label">
                              Tax Code
                            </Label>
                            <Input
                              name="taxCode"
                              type="text"
                              placeholder="Enter your tax code"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.taxCode || ""}
                              invalid={
                                validation.touched.taxCode &&
                                validation.errors.taxCode
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.taxCode &&
                            validation.errors.taxCode ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.taxCode}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>

                          <Col xs={12} className="mt-3">
                            <Label htmlFor="address" className="form-label">
                              Address
                            </Label>
                            <Input
                              name="address"
                              type="text"
                              placeholder="Enter your address"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.address || ""}
                              invalid={
                                validation.touched.address &&
                                validation.errors.address
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.address &&
                            validation.errors.address ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.address}</div>
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </Row>

                        <div className="mb-4">
                          <p className="mb-0 fs-12 text-muted fst-italic">
                            By registering you agree to the GPM
                            <Link
                              href="#"
                              className="text-primary text-decoration-underline fst-normal fw-medium"
                            >
                              {" "}
                              Terms of Use
                            </Link>
                          </p>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            className="w-100"
                            type="submit"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            )}
                            Sign Up
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">
                              Create account with
                            </h5>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-primary btn-icon waves-effect waves-light"
                            >
                              <i className="ri-facebook-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-danger btn-icon waves-effect waves-light"
                            >
                              <i className="ri-google-fill fs-16"></i>
                            </button>{" "}
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    {t("Already have an account")} ?{" "}
                    <Link
                      href={URL_MANAGEMENT.LOGIN}
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      {t("Signin")}{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </NonAuthLayout>
  );
};

Register.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default Register;
