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

// actions

import { createSelector } from "reselect";
import Link from "next/link";
import ParticlesAuth from "@/components/AuthenticationInner/ParticlesAuth";
import { socialLogin, resetLoginFlag } from "@/slices/auth/login/thunk";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";
import { useLoginMutation } from "@/api/mutations/useAuthMutation";
import { apiError, loginSuccess } from "@/slices/auth/login/reducer";

const Login: NextPageWithLayout = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const { mutateAsync: handleLogin } = useLoginMutation();

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
      router.push("/");
      setLoader(true);
    },
  });

  const signIn = (type: any) => {
    dispatch(socialLogin(type, router.push));
  };

  //for facebook and google authentication
  const socialResponse = (type: any) => {
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
                      <h5 className="text-primary">Chào mừng trở lại!</h5>
                      <p className="text-muted">
                        Đăng nhập để tiếp tục sử dụng GPM.
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
                            placeholder="Nhập email"
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
                            <Link
                              href="/forgot-password"
                              className="text-muted"
                            >
                              Quên mật khẩu?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Mật khẩu
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Nhập mật khẩu"
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
                            Ghi nhớ đăng nhập
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
                            Đăng nhập
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Đăng nhập bằng</h5>
                          </div>
                          <div>
                            <Link
                              href="#"
                              className="btn btn-primary btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("facebook");
                              }}
                            >
                              <i className="ri-facebook-fill fs-16" />
                            </Link>
                            <Link
                              href="#"
                              className="btn btn-danger btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("google");
                              }}
                            >
                              <i className="ri-google-fill fs-16" />
                            </Link>
                            <Button color="dark" className="btn-icon">
                              <i className="ri-github-fill fs-16"></i>
                            </Button>{" "}
                            <Button color="info" className="btn-icon">
                              <i className="ri-twitter-fill fs-16"></i>
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
