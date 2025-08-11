import { useAuthHooks } from "@/components/Hooks/AuthHooks";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
const NonAuthLayout = ({ children }: any) => {
  const selectLayoutState = (state: any) => state.Layout;
  const { logoutUser } = useAuthHooks();

  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutModeType: layout.layoutModeType,
    })
  );
  // Inside your component
  const { layoutModeType } = useSelector(selectLayoutProperties);
  useEffect(() => {
    logoutUser();

    if (layoutModeType === "dark") {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
    }
    return () => {
      document.body.removeAttribute("data-bs-theme");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutModeType]);
  return <div>{children}</div>;
};
export default NonAuthLayout;
