import { setAuthorization } from "@/helpers/api_helper";
import { logoutUser } from "@/slices/auth/login/thunk";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useProfile } from "../Hooks/UserHooks";
import { useRouter } from "next/navigation";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (!userProfile && loading && !token) {
    router.push("/login");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

export default AuthProtected;
