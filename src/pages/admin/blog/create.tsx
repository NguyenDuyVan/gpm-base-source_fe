import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
  Form,
  Button,
  FormFeedback,
} from "reactstrap";
//Import Flatepicker
import dynamic from "next/dynamic";
import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import {
  useCreateBlogMutation,
  CreateBlogRequest,
} from "@/api/mutations/useBlogMutation";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const EditorWrapper = dynamic(() => import("@/components/core/EditorWrapper"), {
  ssr: false,
});

const Page = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: "",
    slug: "",
    description: "",
  });
  const [editorContent, setEditorContent] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({
    title: false,
    description: false,
  });

  const createBlogMutation = useCreateBlogMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "blog-title-input") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
      setTouched((prev) => ({ ...prev, title: true }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleEditorContent = (content: string) => {
    setEditorContent(content);
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
    setTouched((prev) => ({ ...prev, description: true }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mark all fields as touched to show validation errors
      setTouched({
        title: true,
        description: true,
      });
      return;
    }

    try {
      await createBlogMutation.mutateAsync(formData);
      toast.success(t("Blog created successfully!"));
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(t("Failed to create blog. Please try again."));
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={handleFormSubmit}>
        <Row className="d-flex justify-content-center">
          <Col lg={8}>
            <Card>
              <CardBody>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="blog-title-input">
                    {t("Blog Title")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="blog-title-input"
                    placeholder={t("Enter blog title")}
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("title")}
                    invalid={touched.title && !!errors.title}
                    required
                  />
                  {touched.title && errors.title && (
                    <FormFeedback>{errors.title}</FormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <Label className="form-label" htmlFor="blog-slug-input">
                    {t("Slug")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="blog-slug-input"
                    placeholder="blog-slug"
                    value={formData.slug}
                    readOnly
                  />
                  <small className="text-muted">
                    {t("Auto-generated from title. Used in URLs.")}
                  </small>
                </div>

                <div className="mb-3">
                  <Label className="form-label">{t("Blog Description")}</Label>
                  <EditorWrapper
                    onChange={handleEditorContent}
                    value={editorContent}
                  />
                  {touched.description && errors.description && (
                    <div className="text-danger mt-1">{errors.description}</div>
                  )}
                </div>
              </CardBody>
            </Card>

            <div className="text-end mb-4">
              <Button
                type="submit"
                color="success"
                className="w-20"
                disabled={createBlogMutation.isPending}
              >
                {createBlogMutation.isPending ? t("Creating...") : t("Create")}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthProtected>
      <MainLayout>{page}</MainLayout>
    </AuthProtected>
  );
};

export default Page;
