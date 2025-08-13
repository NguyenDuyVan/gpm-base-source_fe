import React from "react";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import ParticlesAuth from "@/components/AuthenticationInner/ParticlesAuth";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { NextPageWithLayout } from "../_app";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useRouter } from "next/router";
import Link from "next/link";

const ResetPassword: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = router.query;

  if (!token || typeof token !== "string") {
    return (
      <ParticlesAuth>
        <div className="auth-page-content">
          <Head>
            <title>{t("Reset Password")} | GPM</title>
          </Head>
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link href="/" className="d-inline-block auth-logo">
                      <img src="/next.svg" alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">
                    {t("GPM Admin & Dashboard")}
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">
                        {t("Invalid Reset Link")}
                      </h5>
                      <Alert color="danger" className="mt-4">
                        {t(
                          "The password reset link is invalid or has expired."
                        )}
                      </Alert>
                      <div className="mt-4">
                        <Link
                          href="/auth/forgot-password"
                          className="btn btn-primary"
                        >
                          {t("Request New Link")}
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    );
  }

  return (
    <>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Head>
            <title>{t("Reset Password")} | GPM</title>
          </Head>
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link href="/" className="d-inline-block auth-logo">
                      <img src="/next.svg" alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">
                    {t("GPM Admin & Dashboard")}
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">{t("Reset Password")}</h5>
                      <p className="text-muted">
                        {t("Create a new password for your account")}
                      </p>

                      <div className="p-2 mt-4">
                        <ResetPasswordForm token={token} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </>
  );
};

ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default ResetPassword;
