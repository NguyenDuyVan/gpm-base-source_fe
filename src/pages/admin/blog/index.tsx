import AuthProtected from "@/components/auth/AuthProtected";
import MainList from "@/components/Blogs/ListView/MainList";
import MainLayout from "@/Layouts/MainLayout";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <MainList />
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
