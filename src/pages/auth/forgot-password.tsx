import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import ParticlesAuth from "@/components/AuthenticationInner/ParticlesAuth";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { NextPageWithLayout } from "../_app";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

const ForgotPassword: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Head>
            <title>{t("Forgot Password")} | GPM</title>
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
                      <h5 className="text-primary">{t("Forgot Password?")}</h5>
                      <p className="text-muted">
                        {t("Reset password with GPM")}
                      </p>

                      <div className="p-2 mt-4">
                        <ForgotPasswordForm />
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

ForgotPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default ForgotPassword;
