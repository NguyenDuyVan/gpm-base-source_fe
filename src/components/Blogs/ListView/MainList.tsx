import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Alert, Row, Col, Input } from "reactstrap";
import CommonModal from "../../Common/CommonModal";
import { useBlogsQuery } from "@/api/queries/useBlogQuery";
import { useDeleteBlogMutation } from "@/api/mutations/useBlogMutation";
import { Blog } from "@/types/api";
import { toast } from "react-toastify";
import TableContainer from "@/components/Common/TableContainer";
import moment from "moment";
import { PaginationType } from "@/types/pagination";

const MainList = () => {
  const [queryParams, setQueryParams] = useState<PaginationType>({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [searchInput, setSearchInput] = useState<string>("");

  const { data: blogData, isLoading, isError } = useBlogsQuery(queryParams);

  const deleteBlogMutation = useDeleteBlogMutation();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== undefined) {
        setQueryParams((prev) => ({
          ...prev,
          search: searchInput || undefined,
          page: 1,
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: page + 1,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: 1,
    }));
  };

  const handleSort = (column: any, sortDirection: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: column.id || column.accessorKey,
      sortOrder: sortDirection as "asc" | "desc",
    }));
  };

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteModal(true);
  };

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

  const handleValidDate = (date: any) => {
    return moment(new Date(date)).format("DD MMM, YYYY");
  };

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            href={`/blog/${cell.row.original.slug}`}
            className="text-reset "
          >
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Slug",
        accessorKey: "slug",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Published Date",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>{cell.getValue() ? handleValidDate(cell.getValue()) : "N/A"}</>
        ),
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <ul className="list-inline gap-3 mb-0">
              <li className="list-inline-item" title="View">
                <Link
                  href={`/blog/${cellProps.row.original.slug}`}
                  className="view-item-btn"
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link
                  href={`/admin/blog/${cellProps.row.original.id}`}
                  className="edit-item-btn"
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <span
                  className="remove-item-btn"
                  onClick={() => handleDeleteClick(cellProps.row.original)}
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </span>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  if (isError) {
    return (
      <Alert color="danger">
        Failed to load blogs. Please try again later.
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <CommonModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        modalType="delete"
        onConfirm={handleDeleteBlog}
        itemName={blogToDelete?.title}
      />

      <Card>
        <CardHeader className="border-0">
          <Row className="g-4 align-items-center">
            <Col sm={3}>
              <div className="search-box">
                <Input
                  type="text"
                  className="form-control search"
                  placeholder="Search for blogs..."
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </Col>
            <div className="col-sm-auto ms-auto">
              <Link
                href="/admin/blog/create"
                className="btn btn-primary add-btn"
              >
                <i className="ri-add-line align-bottom me-1"></i> Add Blog
              </Link>
            </div>
          </Row>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : blogData?.data && blogData.data.length > 0 ? (
            <TableContainer
              columns={columns}
              data={blogData.data || []}
              isGlobalFilter={false}
              customPageSize={queryParams.limit}
              divClass="table-responsive table-card"
              tableClass="align-middle"
              theadClass="table-light"
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSort={handleSort}
              manualPagination
              totalCount={blogData.meta?.totalItems || 0}
              pageIndex={queryParams.page ? queryParams.page - 1 : 0}
              pageSize={queryParams.limit || 5}
            />
          ) : (
            <div className="text-center p-4">
              <div className="avatar-md mx-auto mb-4">
                <div className="avatar-title bg-light rounded-circle text-primary fs-24">
                  <i className="ri-file-text-line"></i>
                </div>
              </div>
              <h5 className="mt-2">No blog posts found</h5>
              <p className="text-muted">
                {searchInput
                  ? `No results found for "${searchInput}"`
                  : "Create your first blog post to get started."}
              </p>
              <Link href="/admin/blog/add" className="btn btn-success">
                <i className="ri-add-line align-bottom me-1"></i> Add New Blog
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default MainList;
