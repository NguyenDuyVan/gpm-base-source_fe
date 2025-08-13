import React, { useEffect } from "react";
import { useRouter } from "next/router";
import NonAuthLayout from "@/Layouts/NonAuthLayout";
import { NextPageWithLayout } from "../_app";
import { Spinner } from "reactstrap";
import { URL_MANAGEMENT } from "@/constants";

const AuthCallback: NextPageWithLayout = () => {
  const router = useRouter();

  const processCallback = async () => {
    const { token, user } = router.query;

    if (!token || !user) return router.push(URL_MANAGEMENT.LOGIN);

    localStorage.setItem("accessToken", JSON.stringify(token));
    localStorage.setItem("authUser", JSON.stringify(user));

    router.push("/admin");
  };

  useEffect(() => {
    if (!router.isReady) return;
    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner color="primary" className="me-2" />
      <span>Authenticating...</span>
    </div>
  );
};

AuthCallback.getLayout = function getLayout(page: React.ReactElement) {
  return <NonAuthLayout>{page}</NonAuthLayout>;
};

export default AuthCallback;
