import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import Head from "next/head";

//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

// actions
import { createSelector } from "reselect";
import Link from "next/link";
import ParticlesAuth from "@/components/AuthenticationInner/ParticlesAuth";
import { resetLoginFlag } from "@/slices/auth/login/thunk";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";
import { useLoginMutation } from "@/api/mutations/useAuthMutation";
import { apiError, loginSuccess } from "@/slices/auth/login/reducer";
import { useSocialAuth } from "@/hooks/useSocialAuth";

const Login: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();
  const router = useRouter();
  const { mutateAsync: handleLogin } = useLoginMutation();
  const { handleSocialLogin, loading: socialLoading } = useSocialAuth();

  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    errorMsg: state.Login.errorMsg,
  }));
  // Inside your component
  const { user, error, errorMsg } = useSelector(loginpageData);

  const [userLogin, setUserLogin] = useState<any>([]);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserLogin({
        email: user.email,
        password: user.confirm_password,
      });
    }
  }, [user]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email,
      password: userLogin.password,
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      const { data } = await handleLogin(values, {
        onError: (error: any) => {
          dispatch(apiError(error));
        },
      });

      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      dispatch(loginSuccess(data.user));
      router.push("/admin");
      setLoader(true);
    },
  });

  const signIn = async (type: "google" | "facebook") => {
    await handleSocialLogin(type);
  };

  //for facebook and google authentication
  const socialResponse = (type: "google" | "facebook") => {
    signIn(type);
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
        setLoader(false);
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  return (
    <React.Fragment>
      <Head>
        <title>
          Đăng nhập cơ bản | Velzon - Mẫu Quản trị & Bảng điều khiển React
        </title>
      </Head>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <h2 className="text-white-50">GPM</h2>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">{t("Welcome Back")}</h5>
                      <p className="text-muted">
                        {t("Sign in to continue to GPM")}
                      </p>
                    </div>
                    {error && error ? (
                      <Alert color="danger"> {error} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder={t("Enter email")}
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

                        <div className="mb-3">
                          <div className="float-end">
                            {" "}
                            <Link
                              href="/forgot-password"
                              className="text-muted"
                            >
                              {t("Forgot password")}?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            {t("Password")}
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder={t("Enter password")}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
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
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            {t("Remember me")}
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loader && true}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {loader && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Đang tải...{" "}
                              </Spinner>
                            )}
                            {t("Sign In")}
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Đăng nhập bằng</h5>
                          </div>
                          <div>
                            <Button
                              color="primary"
                              className="btn-icon me-1"
                              disabled={socialLoading}
                              onClick={() => socialResponse("facebook")}
                            >
                              <i className="ri-facebook-fill fs-16" />
                            </Button>
                            <Button
                              color="danger"
                              className="btn-icon me-1"
                              disabled={socialLoading}
                              onClick={() => socialResponse("google")}
                            >
                              <i className="ri-google-fill fs-16" />
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Chưa có tài khoản?{" "}
                    <Link
                      href="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Đăng ký{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default Login;
