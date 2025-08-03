import { useEffect, useState } from "react";

const getLoggedinUser = (): any | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession && userProfileSession["token"];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    const token = userProfileSession && userProfileSession["token"];
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };
