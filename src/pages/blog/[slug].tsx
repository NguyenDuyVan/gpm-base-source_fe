import React from "react";
import { Card, CardBody, Col, Row, Spinner, Alert, Button } from "reactstrap";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { BLOGS_PATH_BY_SLUG } from "@/api/apiPaths";
import { Blog } from "@/types/api";

// Define props interface
interface BlogDetailPageProps {
  blog?: Blog;
  error?: string;
}

const BlogDetailPage = ({ blog, error }: BlogDetailPageProps) => {
  const router = useRouter();

  // Loading state is handled by SSR
  const isLoading = false;
  const isError = !!error;

  // Display loading state
  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner color="primary" />
        <p className="mt-2">Loading blog details...</p>
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="text-center my-5">
        <Alert color="danger">
          Error loading blog. Please try again.
          <p>{error?.toString()}</p>
        </Alert>
        <Button color="primary" onClick={() => router.push("/blog")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  // If blog not found
  if (!blog) {
    return (
      <div className="text-center my-5">
        <Alert color="warning">Blog not found</Alert>
        <Button color="primary" onClick={() => router.push("/blog")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content py-3">
        <Row className="d-flex justify-content-center">
          <Col lg={10}>
            <Card>
              <CardBody>
                <div className="mb-4">
                  <h2 className="mb-3">{blog.title}</h2>
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-light text-dark me-2">
                      Slug: {blog.slug}
                    </span>
                    {blog.createdAt && (
                      <span className="text-muted">
                        <i className="ri-calendar-event-line me-1"></i>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="blog-content">
                  <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

// Server-side rendering to get the slug and fetch blog data
export const getServerSideProps: GetServerSideProps<
  BlogDetailPageProps
> = async (context) => {
  try {
    // Get slug from context.params
    const { slug } = context.params || {};

    if (!slug || typeof slug !== "string") {
      return {
        props: {
          error: "Invalid slug parameter",
        },
      };
    }

    // Use node-fetch or axios on server side to fetch the blog data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api${BLOGS_PATH_BY_SLUG(slug)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("ádfadfasfd", data);

    return {
      props: {
        blog: data.data,
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);

    return {
      props: {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
};

export default BlogDetailPage;
