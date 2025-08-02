import React from "react";
import { Col, Container, Row } from "reactstrap";

//import Components
import UpgradeAccountNotise from "./UpgradeAccountNotise";
import UsersByDevice from "./UsersByDevice";
import Widget from "./Widget";
import AudiencesMetrics from "./AudiencesMetrics";
import AudiencesSessions from "./AudiencesSessions";
import LiveUsers from "./LiveUsers";
import TopReferrals from "./TopReferrals";
import TopPages from "./TopPages";

const DashboardAnalytics = () => {
  document.title = "Analytics | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xxl={5}>
              <UpgradeAccountNotise />
              <Widget />
            </Col>
            <LiveUsers />
          </Row>
          <Row>
            <AudiencesMetrics />
            <AudiencesSessions />
          </Row>
          <Row>
            <UsersByDevice />
            <TopReferrals />
            <TopPages />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAnalytics;
