import React from "react";

const Navdata = () => {
  //state data

  const menuItems: any = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "ri-user-settings-line",
      link: "/user-management",
    },
    {
      id: "permission",
      label: "Permission",
      icon: "ri-lock-line",
      link: "/permission",
    },
    {
      id: "blog",
      label: "Blog",
      icon: "ri-article-line",
      link: "/blog",
      stateVariables: true,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
