//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import { loginSuccess, apiError, reset_login_flag } from "./reducer";

export const socialLogin =
  (type: any, history: any) => async (dispatch: any) => {
    try {
      let response;

      if (process.env.NEXT_PUBLIC_DEFAULTAUTH === "firebase") {
        const fireBaseBackend: any = getFirebaseBackend();
        response = fireBaseBackend.socialLoginUser(type);
      }
      //  else {
      //   response = postSocialLogin(data);
      // }

      const socialdata = await response;
      if (socialdata) {
        localStorage.setItem("authUser", JSON.stringify(response));
        dispatch(loginSuccess(response));
        history("/");
      }
    } catch (error) {
      dispatch(apiError(error));
    }
  };

export const resetLoginFlag = () => async (dispatch: any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
