import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import { NextPageWithLayout } from "../../_app";
import { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useEmailCampaignByIdQuery } from "@/api/queries/useEmailQuery";
import {
  Alert,
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Badge,
} from "reactstrap";

const EmailCampaignDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaignId, setCampaignId] = useState<number | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        setCampaignId(parsedId);
      }
    }
  }, [id]);

  const {
    data: campaign,
    isLoading,
    error,
  } = useEmailCampaignByIdQuery(campaignId);

  const handleBack = () => {
    router.push("/admin/email-management");
  };

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col>
          <Button color="secondary" onClick={handleBack}>
            <i className="ri-arrow-left-line align-middle me-1"></i> Back to
            Email Management
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <Alert color="danger">
          Error loading campaign:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      ) : !campaign ? (
        <Alert color="warning">Campaign not found</Alert>
      ) : (
        <Card>
          <CardHeader>
            <h4 className="mb-0">Campaign Details: {campaign.name}</h4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <p>
                  <strong>ID:</strong> {campaign.id}
                </p>
                <p>
                  <strong>Name:</strong> {campaign.name}
                </p>
                <p>
                  <strong>Template ID:</strong> {campaign.templateId}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    color={
                      campaign.status === "draft"
                        ? "secondary"
                        : campaign.status === "ready"
                        ? "info"
                        : campaign.status === "scheduled"
                        ? "warning"
                        : campaign.status === "sent"
                        ? "success"
                        : "primary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </p>
                <p>
                  <strong>Scheduled For:</strong>{" "}
                  {new Date(campaign.scheduleAt).toLocaleString()}
                </p>
              </Col>
            </Row>

            {/* Add campaign management UI here */}
            {campaign.status === "draft" && (
              <div className="mt-4">
                <Alert color="info">
                  This campaign is still in draft mode. Complete setup and mark
                  as ready when finished.
                </Alert>
              </div>
            )}

            {campaign.status === "ready" && (
              <div className="mt-4">
                <Alert color="info">
                  This campaign is ready to send. Schedule it or send it
                  immediately.
                </Alert>
              </div>
            )}

            {campaign.status === "scheduled" && (
              <div className="mt-4">
                <Alert color="warning">
                  This campaign is scheduled to be sent on{" "}
                  {new Date(campaign.scheduleAt).toLocaleString()}.
                </Alert>
              </div>
            )}

            {campaign.status === "sent" && (
              <div className="mt-4">
                <Alert color="success">
                  This campaign has been sent on{" "}
                  {new Date(campaign.scheduleAt).toLocaleString()}.
                </Alert>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  );
};

EmailCampaignDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default EmailCampaignDetailsPage;
