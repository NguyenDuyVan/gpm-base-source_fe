import { listData } from "@/common/data";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Card, CardBody, Pagination, Table } from "reactstrap";
import CommonModal from "../../Common/CommonModal";

const MainList = () => {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPageData = 6;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentdata = useMemo(
    () => listData?.slice(indexOfFirst, indexOfLast),
    [indexOfFirst, indexOfLast]
  );

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<any>(null);

  // Handle delete button click
  const handleDeleteClick = (blog: any) => {
    setBlogToDelete(blog);
    setDeleteModal(true);
  };

  // Handle confirmation of deletion
  const handleDeleteBlog = () => {
    // Implement your delete logic here
    console.log("Deleting blog:", blogToDelete);
    // After deletion logic is complete, close the modal
    setDeleteModal(false);
    setBlogToDelete(null);
  };

  return (
    <React.Fragment>
      <div>
        <div className="row g-4 mb-3">
          <div className="col-sm-auto">
            <div>
              <Link href="/blog/create" className="btn btn-success">
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
            <div className="table-responsive table-card">
              <Table className="table-centered align-middle table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col">Views</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentdata.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ width: "75px", height: "45px" }}>
                          <img
                            src={item.image.src}
                            alt=""
                            className="img-fluid rounded object-fit-cover"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </td>
                      <td>
                        <h5 className="fs-14 fw-semibold">
                          <Link href="/blog/overview" className="text-dark">
                            {item.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-0 fs-12">
                          {item.description.substring(0, 60)}...
                        </p>
                      </td>
                      <td>
                        <span className="badge badge-soft-primary">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <i className="ri-calendar-event-line me-1 text-muted"></i>
                        {item.date}
                      </td>
                      <td>
                        <i className="ri-eye-line me-1 text-muted"></i>
                        {item.views}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {item.tags.slice(0, 2).map((tag, tagIdx) => (
                            <Link
                              href="#!"
                              key={tagIdx}
                              className="badge badge-soft-success"
                            >
                              {tag}
                            </Link>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="badge badge-soft-dark">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="hstack gap-2">
                          <Link
                            href="/blog/overview"
                            className="btn btn-sm btn-soft-info"
                            title="View"
                          >
                            <i className="ri-eye-fill"></i>
                          </Link>
                          <Link
                            href="#"
                            className="btn btn-sm btn-soft-success"
                            title="Edit"
                          >
                            <i className="ri-pencil-fill"></i>
                          </Link>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClick(item);
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
          </CardBody>
        </Card>

        <div className="row g-0 text-center text-sm-start align-items-center mb-4 mt-4">
          <div className="col-sm-6">
            <div>
              <p className="mb-sm-0 text-muted">
                Showing <span className="fw-semibold">1</span> to{" "}
                <span className="fw-semibold">6</span> of{" "}
                <span className="fw-semibold text-decoration-underline">
                  21
                </span>{" "}
                entries
              </p>
            </div>
          </div>
          <div className="col-sm-6">
            <Pagination
              perPageData={perPageData}
              data={listData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <CommonModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          modalType="delete"
          onConfirm={handleDeleteBlog}
          itemName={blogToDelete?.title}
        />
      </div>
    </React.Fragment>
  );
};

export default MainList;
