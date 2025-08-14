import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import EmailCampaignTab from "./EmailCampaignTab";
import EmailSystemTab from "./EmailSystemTab";

const EmailManagement = () => {
  const [activeTab, setActiveTab] = useState("system");
  const systemTabRef = useRef<{ openCreateModal: () => void } | null>(null);

  // Effect to listen for the custom event from the campaign tab
  useEffect(() => {
    const handleCreateMarketingTemplate = () => {
      setActiveTab("marketing");
      // Small delay to ensure the tab has changed
      setTimeout(() => {
        if (systemTabRef.current) {
          systemTabRef.current.openCreateModal();
        }
      }, 100);
    };

    window.addEventListener(
      "createMarketingTemplate",
      handleCreateMarketingTemplate
    );

    return () => {
      window.removeEventListener(
        "createMarketingTemplate",
        handleCreateMarketingTemplate
      );
    };
  }, []);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <Nav tabs className="nav-tabs-custom nav-primary">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={activeTab === "system" ? "active" : ""}
                      onClick={() => toggleTab("system")}
                    >
                      System Emails
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={activeTab === "marketing" ? "active" : ""}
                      onClick={() => toggleTab("marketing")}
                    >
                      Marketing Emails
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={activeTab === "campaign" ? "active" : ""}
                      onClick={() => toggleTab("campaign")}
                    >
                      Campaign Management
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="mt-4">
                  <TabPane tabId="system">
                    <EmailSystemTab
                      ref={systemTabRef}
                      defaultTemplateType="system"
                    />
                  </TabPane>
                  <TabPane tabId="marketing">
                    <EmailSystemTab
                      ref={systemTabRef}
                      defaultTemplateType="marketing"
                    />
                  </TabPane>
                  <TabPane tabId="campaign">
                    <EmailCampaignTab />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default EmailManagement;
