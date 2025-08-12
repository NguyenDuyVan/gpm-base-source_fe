import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  AuthProvider,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/config/firebase";

export interface SocialLoginData {
  idToken: string;
  provider: "google" | "facebook";
  uid: string;
  email: string;
  fullName: string;
  photoURL?: string;
}

class FirebaseAuthHelper {
  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
    });
  }

  /**
   * Social login with Google or Facebook
   * Returns the data needed for backend authentication
   */
  async socialLogin(
    providerType: "google" | "facebook"
  ): Promise<SocialLoginData> {
    try {
      let provider: AuthProvider;

      if (providerType === "google") {
        provider = googleProvider;
      } else if (providerType === "facebook") {
        provider = facebookProvider;
      } else {
        throw new Error(`Unsupported provider: ${providerType}`);
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        throw new Error("No user returned from authentication");
      }

      // Get the ID token
      const idToken = await user.getIdToken();

      // Extract user information
      const socialLoginData: SocialLoginData = {
        idToken,
        provider: providerType,
        uid: user.uid,
        email: user.email || "",
        fullName: user.displayName || "",
        photoURL: user.photoURL || undefined,
      };

      return socialLoginData;
    } catch (error: any) {
      console.error("Social login error:", error);
      throw new Error(this._handleError(error));
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      sessionStorage.removeItem("authUser");
      localStorage.removeItem("authUser");
      localStorage.removeItem("accessToken");
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(this._handleError(error));
    }
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Get the current user's ID token
   */
  async getCurrentUserIdToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Handle Firebase auth errors
   */
  private _handleError(error: any): string {
    if (error.code) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          return "Authentication was cancelled by user";
        case "auth/popup-blocked":
          return "Authentication popup was blocked by browser";
        case "auth/account-exists-with-different-credential":
          return "An account already exists with the same email address but different sign-in credentials";
        case "auth/auth-domain-config-required":
          return "Authentication domain configuration is required";
        case "auth/cancelled-popup-request":
          return "Authentication request was cancelled";
        case "auth/operation-not-allowed":
          return "This authentication method is not enabled";
        case "auth/unauthorized-domain":
          return "This domain is not authorized for OAuth operations";
        default:
          return error.message || "An authentication error occurred";
      }
    }
    return error.message || "An unknown error occurred";
  }
}

// Create a singleton instance
const firebaseAuthHelper = new FirebaseAuthHelper();

export default firebaseAuthHelper;
