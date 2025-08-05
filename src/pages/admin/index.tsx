import AuthProtected from "@/components/auth/AuthProtected";
import BreadCrumb from "@/components/Common/BreadCrumb";
import UpgradeAccountNotise from "@/components/DashboardAnalytics/UpgradeAccountNotise";
import Widget from "@/components/DashboardAnalytics/Widget";
import React, { ReactElement } from "react";
import { Col, Row } from "reactstrap";
import MainLayout from "../../Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <BreadCrumb title="Analytics" pageTitle="Dashboards" />
      <Row>
        <Col>
          <UpgradeAccountNotise />
          <Widget />
        </Col>
      </Row>
    </React.Fragment>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default Page;
