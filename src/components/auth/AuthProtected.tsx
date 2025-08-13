import { setAuthorization } from "@/helpers/api_helper";
import React, { useEffect } from "react";
import { useProfile } from "../Hooks/UserHooks";
import { useRouter } from "next/navigation";
import { useAuthHooks } from "../Hooks/AuthHooks";

const AuthProtected = (props: any) => {
  const { userProfile, loading, token } = useProfile();
  const { logoutUser } = useAuthHooks();
  const router = useRouter();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      logoutUser();
    }
  }, [token, userProfile, loading, logoutUser]);

  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return <>{props.children}</>;
  }

  if (!userProfile && loading && !token) {
    router.push("/auth/login");
    return null;
  }

  return <>{props.children}</>;
};

export default AuthProtected;
