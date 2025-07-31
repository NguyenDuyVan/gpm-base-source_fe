import React, { ReactElement } from "react";
import { Card, CardBody, Col, Input, Label, Row } from "reactstrap";
//Import Flatepicker
import dynamic from "next/dynamic";
import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";

const EditorWrapper = dynamic(() => import("@/components/core/EditorWrapper"), {
  ssr: false,
});

const Page = () => {
  return (
    <React.Fragment>
      <Row className="d-flex justify-content-center">
        <Col lg={8}>
          <Card>
            <CardBody>
              <div className="mb-3">
                <Label className="form-label" htmlFor="blog-title-input">
                  Blog Title
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="blog-title-input"
                  placeholder="Enter blog title"
                />
              </div>

              <div className="mb-3">
                <Label className="form-label" htmlFor="blog-thumbnail-img">
                  Thumbnail Image
                </Label>
                <Input
                  className="form-control"
                  id="blog-thumbnail-img"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>

              <div className="mb-3">
                <Label className="form-label">Blog Description</Label>
                <EditorWrapper />
              </div>
            </CardBody>
          </Card>

          <div className="text-end mb-4">
            <button type="submit" className="btn btn-success w-sm">
              Create
            </button>
          </div>
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
