import AuthProtected from "@/components/auth/AuthProtected";
import MainList from "@/components/Blogs/ListView/MainList";
import Sidepanel from "@/components/Blogs/ListView/Sidepanel";
import BreadCrumb from "@/components/Common/BreadCrumb";
import MainLayout from "@/Layouts/MainLayout";
import React, { ReactElement } from "react";
import { Row } from "reactstrap";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <BreadCrumb title="List View" pageTitle="Blogs" />
      <Row>
        <Sidepanel />

        <MainList />
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
