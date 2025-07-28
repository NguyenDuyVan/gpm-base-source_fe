import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { SearchTable } from "@/components/core/Tables/ReactTables/ReactTable";
import { Card, CardHeader, CardBody } from "reactstrap";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";

const Page: NextPageWithLayout = () => {
  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">User Management</h5>
      </CardHeader>
      <CardBody>
        <SearchTable />
      </CardBody>
    </Card>
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
