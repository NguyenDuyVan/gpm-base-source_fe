import React from "react";
import { Button, Card, CardBody, Alert } from "reactstrap";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import firebaseAuthHelper from "@/helpers/firebase_auth_helper";

const SocialAuthTest: React.FC = () => {
  const { handleSocialLogin, loading } = useSocialAuth();
  const [testResult, setTestResult] = React.useState<string>("");
  const [testLoading, setTestLoading] = React.useState(false);

  const testFirebaseConnection = async () => {
    setTestLoading(true);
    setTestResult("");

    try {
      // Test Firebase initialization
      const currentUser = firebaseAuthHelper.getCurrentUser();
      const isAuth = firebaseAuthHelper.isAuthenticated();

      setTestResult(`
        Firebase Status:
        - Current User: ${currentUser ? currentUser.email : "None"}
        - Is Authenticated: ${isAuth}
        - Firebase Auth Object: ${
          firebaseAuthHelper ? "Initialized" : "Not Initialized"
        }
      `);
    } catch (error: any) {
      setTestResult(`Error testing Firebase: ${error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const testGoogleLogin = async () => {
    try {
      await handleSocialLogin("google");
      setTestResult("Google login successful!");
    } catch (error: any) {
      setTestResult(`Google login error: ${error.message}`);
    }
  };

  const testFacebookLogin = async () => {
    try {
      await handleSocialLogin("facebook");
      setTestResult("Facebook login successful!");
    } catch (error: any) {
      setTestResult(`Facebook login error: ${error.message}`);
    }
  };

  const testLogout = async () => {
    try {
      await firebaseAuthHelper.logout();
      setTestResult("Logout successful!");
    } catch (error: any) {
      setTestResult(`Logout error: ${error.message}`);
    }
  };

  return (
    <Card className="mt-4">
      <CardBody>
        <h5>Social Authentication Test</h5>
        <p className="text-muted">
          Use this component to test your social authentication setup.
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button
            color="info"
            onClick={testFirebaseConnection}
            disabled={testLoading}
          >
            {testLoading ? "Testing..." : "Test Firebase"}
          </Button>

          <Button color="danger" onClick={testGoogleLogin} disabled={loading}>
            {loading ? "Loading..." : "Test Google Login"}
          </Button>

          <Button
            color="primary"
            onClick={testFacebookLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Test Facebook Login"}
          </Button>

          <Button color="secondary" onClick={testLogout}>
            Test Logout
          </Button>
        </div>

        {testResult && (
          <Alert color="info">
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}>
              {testResult}
            </pre>
          </Alert>
        )}

        <div className="mt-3">
          <h6>Environment Variables Check:</h6>
          <ul className="list-unstyled">
            <li>API URL: {process.env.NEXT_PUBLIC_API_URL || "❌ Not set"}</li>
            <li>
              Firebase API Key:{" "}
              {process.env.NEXT_PUBLIC_APIKEY ? "✅ Set" : "❌ Not set"}
            </li>
            <li>
              Firebase Auth Domain:{" "}
              {process.env.NEXT_PUBLIC_AUTHDOMAIN ? "✅ Set" : "❌ Not set"}
            </li>
            <li>
              Firebase Project ID:{" "}
              {process.env.NEXT_PUBLIC_PROJECTID ? "✅ Set" : "❌ Not set"}
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default SocialAuthTest;
