import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { NextPageWithLayout } from "../../_app";
import { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useEmailTemplateByIdQuery } from "@/api/queries/useEmailQuery";
import EmailTemplateDetails from "@/components/EmailManagement/EmailTemplateDetails";
import { Alert, Button, Spinner } from "reactstrap";

const EmailTemplateDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [templateId, setTemplateId] = useState<number | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        setTemplateId(parsedId);
      }
    }
  }, [id]);

  const {
    data: template,
    isLoading,
    error,
  } = useEmailTemplateByIdQuery(templateId);

  const handleBack = () => {
    router.push("/admin/email-management");
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <Alert color="danger">
          Error loading template:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      ) : !template ? (
        <div>
          <Alert color="warning">Template not found</Alert>
          <Button color="secondary" onClick={handleBack}>
            <i className="ri-arrow-left-line align-middle me-1"></i> Back to
            Email Management
          </Button>
        </div>
      ) : (
        <EmailTemplateDetails template={template} onBack={handleBack} />
      )}
    </React.Fragment>
  );
};

EmailTemplateDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default EmailTemplateDetailsPage;
