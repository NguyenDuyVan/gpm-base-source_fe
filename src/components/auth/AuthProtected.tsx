import { setAuthorization } from "@/helpers/api_helper";
import { logoutUser } from "@/slices/auth/login/thunk";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useProfile } from "../Hooks/UserHooks";
import { redirect } from "next/navigation";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return <>{props.children}</>;
  }

  if (!userProfile && loading && !token) {
    return redirect("/login");
  }

  return <>{props.children}</>;
};

export default AuthProtected;
