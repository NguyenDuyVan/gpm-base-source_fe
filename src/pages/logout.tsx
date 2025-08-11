import PropTypes from "prop-types";
import React from "react";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { useRouter } from "next/router";

const Logout = () => {
  const router = useRouter();

  return router.push("/login");
};

Logout.propTypes = {
  history: PropTypes.object,
};

Logout.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default Logout;
