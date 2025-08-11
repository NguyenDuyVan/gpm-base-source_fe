import { useLogoutMutation } from "@/api/mutations/useAuthMutation";
import { logoutUserSuccess, apiError } from "@/slices/auth/login/reducer";
import { useDispatch } from "react-redux";

export const useAuthHooks = () => {
  const { mutateAsync: logout } = useLogoutMutation();
  const dispatch: any = useDispatch();

  const logoutUser = async () => {
    try {
      localStorage.removeItem("authUser");

      if (!localStorage.getItem("accessToken")) return;
      await logout();
      localStorage.removeItem("accessToken");

      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(apiError(error));
    }
  };

  return { logoutUser };
};
