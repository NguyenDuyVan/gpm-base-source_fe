import PropTypes from "prop-types";
import React, { useEffect } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";

import { createSelector } from "reselect";
import { useRouter } from "next/router";
import { logoutUser } from "@/slices/thunks";
import NonAuthLayout from "@/Layouts/NonAuthLayout";

const Logout = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();

  const logoutData = createSelector(
    (state) => state.Login,
    (isUserLogout) => isUserLogout.isUserLogout
  );

  // Inside your component
  const isUserLogout = useSelector(logoutData);

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
    router.push("/login");
    return;
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
