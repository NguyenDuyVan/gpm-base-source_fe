import React, { useState } from "react";

const Navdata = () => {
  //state data
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isUserManagement, setIsUserManagement] = useState<boolean>(false);
  const [isBlog, setIsBlog] = useState<boolean>(true);

  const menuItems: any = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/",
      stateVariables: isDashboard,
      click: function (e: any) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
      },
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "ri-user-settings-line",
      link: "/user-management",
      stateVariables: isUserManagement,
      click: function (e: any) {
        e.preventDefault();
        setIsUserManagement(!isUserManagement);
      },
    },
    {
      id: "blog",
      label: "Blog",
      icon: "ri-article-line",
      link: "/blog",
      stateVariables: isBlog,
      click: function (e: any) {
        e.preventDefault();
        setIsBlog(!isBlog);
      },
      subItems: [
        {
          id: "blog-list",
          label: "Blog List",
          link: "/blog/list",
          parentId: "blog",
        },
        {
          id: "blog-overview",
          label: "Overview",
          link: "/blog/overview",
          parentId: "blog",
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
