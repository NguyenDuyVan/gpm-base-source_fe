import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import firebaseAuthHelper, {
  SocialLoginData,
} from "@/helpers/firebase_auth_helper";
import { useSocialLoginMutation } from "@/api/mutations/useAuthMutation";
import { loginSuccess, apiError } from "@/slices/auth/login/reducer";

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutateAsync: socialLoginMutation } = useSocialLoginMutation();

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      const socialData: SocialLoginData = await firebaseAuthHelper.socialLogin(
        provider
      );

      const response = await socialLoginMutation(socialData);

      if (response.data) {
        localStorage.setItem("authUser", JSON.stringify(response.data.user));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );

        dispatch(loginSuccess(response.data.user));

        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Social login error:", error);
      dispatch(apiError(error.message || "Social login failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseAuthHelper.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    handleSocialLogin,
    handleLogout,
    loading,
  };
};
