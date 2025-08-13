import { useState } from "react";
import { useForgotPasswordMutation } from "@/api/mutations/useAuthMutation";
import Link from "next/link";
import { Alert, Button, Form, FormFeedback, Input, Spinner } from "reactstrap";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export default function ForgotPasswordForm({
  onSuccess,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [msgError, setMsgError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const { mutateAsync: forgotPassword, isPending } =
    useForgotPasswordMutation();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("Please enter a valid email address"))
        .required(t("Please enter your email")),
    }),
    onSubmit: async (values) => {
      try {
        const response = await forgotPassword({ email: values.email });
        setSuccessMsg(
          response.message ||
            t("Password reset instructions sent to your email")
        );
        setMsgError("");
        onSuccess?.();
      } catch (error: any) {
        setMsgError(error.message || t("Failed to send reset instructions"));
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
        <Input
          id="email"
          name="email"
          className="form-control"
          placeholder={t("Enter your email")}
          type="email"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.email || ""}
          invalid={!!(validation.touched.email && validation.errors.email)}
        />
        {validation.touched.email && validation.errors.email ? (
          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
        ) : null}
        <div className="mt-2">
          <p className="text-muted">
            {t(
              "Enter your email and we'll send you instructions to reset your password."
            )}
          </p>
        </div>
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
              {t("Sending...")}
            </>
          ) : (
            t("Send Reset Link")
          )}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="mb-0">
          {t("Wait, I remember my password...")}{" "}
          <Link
            href="/auth/login"
            className="fw-semibold text-primary text-decoration-underline"
          >
            {" "}
            {t("Click here")}
          </Link>{" "}
        </p>
      </div>
    </Form>
  );
}
