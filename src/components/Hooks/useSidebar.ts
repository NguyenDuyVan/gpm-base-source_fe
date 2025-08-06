import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

// Define types for better type safety
interface Permission {
  apiPath: string;
  // Add other permission properties as needed
}

interface User {
  permissions: Permission[];
  isSuperAdmin: boolean;
  // Add other user properties as needed
}

interface LoginState {
  user: User;
  error: boolean;
  errorMsg: string;
}

interface RootState {
  Login: LoginState;
  // Add other state slices as needed
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  link: string;
  isShow: boolean;
  stateVariables?: boolean;
}

export const useSidebar = () => {
  // Improved selector with proper typing
  const selectLoginData = createSelector(
    (state: RootState) => state.Login,
    (login): LoginState => login
  );

  const { user } = useSelector(selectLoginData);

  // Helper function to check permissions
  const hasPermission = (apiPathPrefix: string): boolean => {
    return (
      user.isSuperAdmin ||
      !!user.permissions?.find((item: Permission) =>
        item.apiPath.startsWith(apiPathPrefix)
      )
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/admin",
      isShow: true,
    },
    {
      id: "user-management",
      label: "User",
      icon: "ri-user-settings-line",
      link: "/admin/user-management",
      isShow: hasPermission("/api/v1/users"),
    },
    {
      id: "permission",
      label: "Permission",
      icon: "ri-lock-line",
      link: "/admin/permission",
      isShow: hasPermission("/api/v1/permissions"),
    },
    {
      id: "blog",
      label: "Blog",
      icon: "ri-article-line",
      link: "/admin/blog",
      stateVariables: true,
      isShow: hasPermission("/api/v1/blogs"),
    },
  ];

  return {
    menuItems: menuItems.filter((item) => item.isShow),
  };
};
