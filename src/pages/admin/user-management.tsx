import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Users from "@/components/Users";
import React from "react";

const Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <Users></Users>
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
