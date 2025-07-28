import React from "react";
import { Container, Row } from "reactstrap";
import Sidepanel from "./Sidepanel";
import MainList from "./MainList";
import BreadCrumb from "@/components/Common/BreadCrumb";

const BlogListView = () => {
  document.title = "List View | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="List View" pageTitle="Blogs" />
          <Row>
            <Sidepanel />

            <MainList />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BlogListView;
