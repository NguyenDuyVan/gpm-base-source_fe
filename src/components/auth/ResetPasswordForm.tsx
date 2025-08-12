import { useState } from "react";
import { useResetPasswordMutation } from "@/api/mutations/useAuthMutation";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  Input,
  Label,
  Spinner,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export default function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [msgError, setMsgError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, t("Password must be at least 8 characters"))
        .required(t("Please enter your password")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("Passwords do not match"))
        .required(t("Please confirm your password")),
    }),
    onSubmit: async (values) => {
      try {
        const response = await resetPassword({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        setSuccessMsg(response.message || t("Password reset successful"));
        setMsgError("");
        onSuccess?.();

        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        setMsgError(error.message || t("Failed to reset password"));
        setSuccessMsg("");
      }
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      {msgError && <Alert color="danger">{msgError}</Alert>}
      {successMsg && <Alert color="success">{successMsg}</Alert>}

      <div className="mb-3 text-left">
        <Label className="form-label" htmlFor="password">
          {t("New Password")}
        </Label>
        <InputGroup>
          <Input
            id="password"
            name="password"
            className="form-control"
            placeholder={t("Enter your new password")}
            type={showPassword ? "text" : "password"}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.password || ""}
            invalid={
              !!(validation.touched.password && validation.errors.password)
            }
          />
          <InputGroupText
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i
              className={`mdi ${
                showPassword ? "mdi-eye-off-outline" : "mdi-eye-outline"
              }`}
            ></i>
          </InputGroupText>
          {validation.touched.password && validation.errors.password ? (
            <FormFeedback type="invalid">
              {validation.errors.password}
            </FormFeedback>
          ) : null}
        </InputGroup>
      </div>

      <div className="mb-3 text-left">
        <Label className="form-label" htmlFor="confirmPassword">
          {t("Confirm Password")}
        </Label>
        <InputGroup>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            placeholder={t("Confirm your new password")}
            type={showConfirmPassword ? "text" : "password"}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.confirmPassword || ""}
            invalid={
              !!(
                validation.touched.confirmPassword &&
                validation.errors.confirmPassword
              )
            }
          />
          <InputGroupText
            className="cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <i
              className={`mdi ${
                showConfirmPassword ? "mdi-eye-off-outline" : "mdi-eye-outline"
              }`}
            ></i>
          </InputGroupText>
          {validation.touched.confirmPassword &&
          validation.errors.confirmPassword ? (
            <FormFeedback type="invalid">
              {validation.errors.confirmPassword}
            </FormFeedback>
          ) : null}
        </InputGroup>
      </div>

      <div className="text-center mt-4">
        <Button
          color="primary"
          className="w-100"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner size="sm" className="me-2" />
              {t("Resetting...")}
            </>
          ) : (
            t("Reset Password")
          )}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="mb-0">
          {t("Already reset your password?")}{" "}
          <Link
            href="/login"
            className="fw-semibold text-primary text-decoration-underline"
          >
            {" "}
            {t("Sign In")}
          </Link>{" "}
        </p>
      </div>
    </Form>
  );
}
