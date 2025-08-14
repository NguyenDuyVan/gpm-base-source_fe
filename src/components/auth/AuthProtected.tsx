import React, { useEffect, useCallback } from "react";
import { useProfile } from "../Hooks/UserHooks";
import { useRouter } from "next/navigation";
import { useAuthHooks } from "../Hooks/AuthHooks";
import { URL_MANAGEMENT } from "@/constants";
import { useAccountQuery } from "@/api/queries/useAuthQuery";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/slices/auth/login/reducer";
import { useUpdateLanguageMutation } from "@/api/mutations/useUserMutation";
import { detectUserLanguage } from "@/utils/geoLocation";
import languages from "@/common/languages";

const AuthProtected = (props: any) => {
  const dispatch = useDispatch();

  const { userProfile, loading, token } = useProfile();
  const { logoutUser } = useAuthHooks();
  const router = useRouter();
  const { data: accountData } = useAccountQuery();
  const { mutateAsync: updateLanguage } = useUpdateLanguageMutation();

  // Handle language setting
  const handleSetLanguage = useCallback(async () => {
    try {
      const detectedLang = await detectUserLanguage();
      const availableLang = Object.keys(languages).includes(detectedLang)
        ? detectedLang
        : "en";

      await updateLanguage(availableLang);
    } catch (error) {
      console.error("Error setting language:", error);
    }
  }, [updateLanguage]);

  useEffect(() => {
    if (!accountData) return;
    dispatch(loginSuccess(accountData));
    if (!accountData.lang) handleSetLanguage();
  }, [accountData, dispatch, handleSetLanguage, logoutUser, updateLanguage]);

  if (process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH === "true") {
    return <>{props.children}</>;
  }

  if (!userProfile && loading && !token) {
    router.push(URL_MANAGEMENT.LOGIN);
    return null;
  }

  return <>{props.children}</>;
};

export default AuthProtected;
