import React from "react";

const Navdata = () => {
  //state data

  const menuItems: any = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/admin/",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "ri-user-settings-line",
      link: "/admin/user-management",
    },
    {
      id: "permission",
      label: "Permission",
      icon: "ri-lock-line",
      link: "/admin/permission",
    },
    {
      id: "blog",
      label: "Blog",
      icon: "ri-article-line",
      link: "/admin/blog",
      stateVariables: true,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
