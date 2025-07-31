import React from "react";
import { Container } from "reactstrap";
import MainLayout from "@/Layouts/MainLayout";
import ModalDemo from "@/components/Common/ModalDemo";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";

const UIModalsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Modal Examples | Your App</title>
      </Head>
      <div className="page-content">
        <Container fluid>
          <div className="mb-4">
            <h4 className="mb-0">Modal Components</h4>
            <p className="text-muted mt-1">
              Reusable modal components for different purposes
            </p>
          </div>

          <ModalDemo />
        </Container>
      </div>
    </>
  );
};

UIModalsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default UIModalsPage;
