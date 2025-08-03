import PropTypes from "prop-types";
import React, { useEffect } from "react";

//redux
import { useSelector } from "react-redux";

import { createSelector } from "reselect";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { useRouter } from "next/router";
import { useAuthHooks } from "@/components/Hooks/AuthHooks";

const Logout = () => {
  const router = useRouter();
  const { logoutUser } = useAuthHooks();

  const logoutData = createSelector(
    (state) => state.Login,
    (isUserLogout) => isUserLogout.isUserLogout
  );

  // Inside your component
  const isUserLogout = useSelector(logoutData);

  useEffect(() => {
    logoutUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isUserLogout) {
    return router.push("/login");
  }

  return <React.Fragment></React.Fragment>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

Logout.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default Logout;
