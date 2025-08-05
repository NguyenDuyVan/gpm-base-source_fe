import React, { ReactElement, useState, useEffect } from "react";
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
  Alert,
} from "reactstrap";
//Import Flatepicker
import dynamic from "next/dynamic";
import AuthProtected from "@/components/auth/AuthProtected";
import MainLayout from "@/Layouts/MainLayout";
import {
  useUpdateBlogMutation,
  CreateBlogRequest,
} from "@/api/mutations/useBlogMutation";
import { useBlogByIdQuery } from "@/api/queries/useBlogQuery";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const EditorWrapper = dynamic(() => import("@/components/core/EditorWrapper"), {
  ssr: false,
});

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
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

  // Get blog by ID query
  const { data: blog, isLoading, isError } = useBlogByIdQuery(id as string);

  // Update blog mutation
  const updateBlogMutation = useUpdateBlogMutation();

  // Set form data when blog data is loaded
  useEffect(() => {
    if (blog) {
      console.log("Blog data loaded:", blog);

      setFormData({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
      });
      setEditorContent(blog.description);
    }
  }, [blog]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      if (!id) {
        toast.error("Blog ID is missing");
        return;
      }

      await updateBlogMutation.mutateAsync({
        id: Number(id),
        ...formData,
      });

      toast.success("Blog updated successfully!");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blog data...</p>
        </div>
      ) : isError ? (
        <Alert color="danger" className="mb-0">
          Error loading blog. Please try again later.
        </Alert>
      ) : (
        <Form onSubmit={handleFormSubmit}>
          <Row className="d-flex justify-content-center">
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="blog-title-input">
                      Blog Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="blog-title-input"
                      placeholder="Enter blog title"
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
                      Slug
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="blog-slug-input"
                      placeholder="blog-slug"
                      value={formData.slug}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">
                      Auto-generated from title. Used in URLs.
                    </small>
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Blog Description</Label>
                    <EditorWrapper
                      onChange={handleEditorContent}
                      value={editorContent}
                    />
                    {touched.description && errors.description && (
                      <div className="text-danger mt-1">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              <div className="text-end mb-4">
                <Button
                  type="button"
                  color="light"
                  className="me-2"
                  onClick={() => router.push("/admin/blog")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="success"
                  className="w-sm"
                  disabled={updateBlogMutation.isPending}
                >
                  {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
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
