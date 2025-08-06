import React from "react";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { useTranslation } from "react-i18next";

// Import Images
import error500 from "../../../assets/images/error500.png";

const Error500 = () => {
  const { t } = useTranslation();
  document.title = "500 Error | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="auth-page-content overflow-hidden p-0">
          <Container fluid={true}>
            <Row className="justify-content-center">
              <Col xl={4} className="text-center">
                <div className="error-500 position-relative">
                  <img
                    src={error500.src}
                    alt=""
                    className="img-fluid error-500-img error-img"
                  />
                  <h1 className="title text-muted">500</h1>
                </div>
                <div>
                  <h4>{t("Internal Server Error!")}</h4>
                  <p className="text-muted w-75 mx-auto">
                    {t(
                      "Server Error 500. We're not exactly sure what happened, but our servers say something is wrong."
                    )}
                  </p>
                  <Link href="/dashboard" className="btn btn-success">
                    <i className="mdi mdi-home me-1"></i>
                    {t("Back to home")}
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Error500;
