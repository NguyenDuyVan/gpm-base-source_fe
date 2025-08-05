import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Card, CardBody, Pagination, Table, Alert } from "reactstrap";
import CommonModal from "../../Common/CommonModal";
import { useBlogsQuery } from "@/api/queries/useBlogQuery";
import { useDeleteBlogMutation } from "@/api/mutations/useBlogMutation";
import { Blog } from "@/types/api";
import { toast } from "react-toastify";

const MainList = () => {
  // Fetch blogs using the query
  const { data: blogs, isLoading, isError } = useBlogsQuery();

  // Delete blog mutation
  const deleteBlogMutation = useDeleteBlogMutation();

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPageData = 6;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentdata = useMemo(
    () => blogs?.slice(indexOfFirst, indexOfLast) || [],
    [blogs, indexOfFirst, indexOfLast]
  );

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  // Handle delete button click
  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteModal(true);
  };

  // Handle confirmation of deletion
  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlogMutation.mutateAsync(blogToDelete.id);
      toast.success("Blog deleted successfully!");
      setDeleteModal(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <div>
        <div className="row g-4 mb-3">
          <div className="col-sm-auto">
            <div>
              <Link href="/admin/blog/create" className="btn btn-success">
                <i className="ri-add-line align-bottom me-1"></i> Add New
              </Link>
            </div>
          </div>
          <div className="col-sm">
            <div className="d-flex justify-content-sm-end gap-2">
              <div className="search-box ms-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <i className="ri-search-line search-icon"></i>
              </div>

              <select
                className="form-control w-md"
                defaultValue="Yesterday"
                style={{ width: "152px" }}
              >
                <option value="All">All</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Month">This Month</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        <Card>
          <CardBody>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : isError ? (
              <Alert color="danger" className="mb-0">
                Error loading blogs. Please try again later.
              </Alert>
            ) : blogs && blogs.length > 0 ? (
              <div className="table-responsive table-card">
                <Table className="table-centered align-middle table-nowrap mb-0">
                  <thead className="text-muted table-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Title</th>
                      <th scope="col">Slug</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentdata.map((blog: Blog) => (
                      <tr key={blog.id}>
                        <td>{blog.id}</td>
                        <td>
                          <h5 className="fs-14 fw-semibold">
                            <Link
                              href={`/admin/blog/${blog.id}`}
                              className="text-dark"
                            >
                              {blog.title}
                            </Link>
                          </h5>
                          <p className="text-muted mb-0 fs-12">
                            {blog.description.substring(0, 60)}...
                          </p>
                        </td>
                        <td>
                          <span>{blog.slug}</span>
                        </td>
                        <td>
                          <i className="ri-calendar-event-line me-1 text-muted"></i>
                          {new Date(blog.createdAt || "").toLocaleDateString()}
                        </td>
                        <td>
                          <div className="hstack gap-2">
                            <Link
                              href={`/blog/${blog.slug}`}
                              className="btn btn-sm btn-soft-info"
                              title="View"
                            >
                              <i className="ri-eye-fill"></i>
                            </Link>
                            <Link
                              href={`/admin/blog/${blog.id}`}
                              className="btn btn-sm btn-soft-success"
                              title="Edit"
                            >
                              <i className="ri-pencil-fill"></i>
                            </Link>
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(blog);
                              }}
                              className="btn btn-sm btn-soft-danger"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-2-fill"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert color="info" className="mb-0">
                No blogs found. Create a new blog to get started.
              </Alert>
            )}
          </CardBody>
        </Card>

        {blogs && blogs.length > 0 && (
          <div className="row g-0 text-center text-sm-start align-items-center mb-4 mt-4">
            <div className="col-sm-6">
              <div>
                <p className="mb-sm-0 text-muted">
                  Showing{" "}
                  <span className="fw-semibold">{indexOfFirst + 1}</span> to{" "}
                  <span className="fw-semibold">
                    {Math.min(indexOfLast, blogs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="fw-semibold text-decoration-underline">
                    {blogs.length}
                  </span>{" "}
                  entries
                </p>
              </div>
            </div>
            <div className="col-sm-6">
              <Pagination
                perPageData={perPageData}
                data={blogs}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <CommonModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          modalType="delete"
          onConfirm={handleDeleteBlog}
          itemName={blogToDelete?.title}
          isLoading={deleteBlogMutation.isPending}
        />
      </div>
    </React.Fragment>
  );
};

export default MainList;
