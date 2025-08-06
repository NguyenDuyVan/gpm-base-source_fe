import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Container, Row, Button, Card, CardBody } from "reactstrap";
import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

const LanguageTest: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    {t("Internationalization Test")}
                  </h4>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <strong>{t("Current Language")}:</strong>{" "}
                      {currentLang === "en" ? "English" : "Tiếng Việt"}
                    </div>

                    <Button color="primary" onClick={toggleLanguage}>
                      {t("Switch to")}{" "}
                      {currentLang === "en" ? "Tiếng Việt" : "English"}
                    </Button>

                    <div className="mt-4">
                      <h5>{t("Sample Translations")}</h5>
                      <ul className="list-group">
                        <li className="list-group-item">{t("Welcome Back")}</li>
                        <li className="list-group-item">{t("Blog")}</li>
                        <li className="list-group-item">{t("User")}</li>
                        <li className="list-group-item">{t("Permission")}</li>
                        <li className="list-group-item">{t("Settings")}</li>
                        <li className="list-group-item">{t("Refresh")}</li>
                        <li className="list-group-item">{t("Blog Title")}</li>
                        <li className="list-group-item">
                          {t("Auto-generated from title. Used in URLs.")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

LanguageTest.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default LanguageTest;
