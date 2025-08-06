import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

interface FilterProps {
  show: boolean;
  onCloseClick: () => void;
  onFilterChange?: (filters: any) => void;
  onClearFilter?: () => void;
  initialFilterData?: any;
}

const UserFilter = ({
  show,
  onCloseClick,
  onFilterChange,
  onClearFilter,
  initialFilterData = {
    date: null,
    country: null,
    status: [],
    tags: [],
  },
}: FilterProps) => {
  // State for filter data
  const [filterData, setFilterData] = useState<any>(initialFilterData);

  // Update local state when initialFilterData changes
  useEffect(() => {
    setFilterData(initialFilterData);
  }, [initialFilterData]);

  // Handle country selection
  const handleSelectCountry = (country: any) => {
    setFilterData({
      ...filterData,
      country,
    });
  };

  // Handle date selection
  const handleDateChange = (date: Date[]) => {
    setFilterData({
      ...filterData,
      date: date.length > 0 ? date : null,
    });
  };

  // Handle checkbox changes for status
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    const updatedStatus = [...(filterData.status || [])];

    if (checked) {
      updatedStatus.push(value);
    } else {
      const index = updatedStatus.indexOf(value);
      if (index > -1) {
        updatedStatus.splice(index, 1);
      }
    }

    setFilterData({
      ...filterData,
      status: updatedStatus,
    });
  };

  // Handle checkbox changes for tags
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    const updatedTags = [...(filterData.tags || [])];

    if (checked) {
      updatedTags.push(value);
    } else {
      const index = updatedTags.indexOf(value);
      if (index > -1) {
        updatedTags.splice(index, 1);
      }
    }

    setFilterData({
      ...filterData,
      tags: updatedTags,
    });
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filterData);
    }
    onCloseClick();
  };

  // Clear filters
  const clearFilters = () => {
    const emptyFilters = {
      date: null,
      country: null,
      status: [],
      tags: [],
    };

    setFilterData(emptyFilters);

    if (onClearFilter) {
      onClearFilter();
    }
    onCloseClick();
  };

  const country = [
    {
      options: [
        { label: "Select country", value: "Select country" },
        { label: "Argentina", value: "Argentina" },
        { label: "Belgium", value: "Belgium" },
        { label: "Brazil", value: "Brazil" },
        { label: "Colombia", value: "Colombia" },
        { label: "Denmark", value: "Denmark" },
        { label: "France", value: "France" },
        { label: "Germany", value: "Germany" },
        { label: "Mexico", value: "Mexico" },
        { label: "Russia", value: "Russia" },
        { label: "Spain", value: "Spain" },
        { label: "Syria", value: "Syria" },
        { label: "United Kingdom", value: "United Kingdom" },
        {
          label: "United States of America",
          value: "United States of America",
        },
      ],
    },
  ];

  return (
    <Offcanvas
      direction="end"
      isOpen={show}
      id="offcanvasExample"
      toggle={onCloseClick}
    >
      <OffcanvasHeader className="bg-light" toggle={onCloseClick}>
        Users Filters
      </OffcanvasHeader>
      <form action="" className="d-flex flex-column justify-content-end h-100">
        <OffcanvasBody>
          <div className="mb-4">
            <Label
              htmlFor="datepicker-range"
              className="form-label text-muted text-uppercase fw-semibold mb-3"
            >
              Date
            </Label>
            <Flatpickr
              className="form-control"
              id="datepicker-publish-input"
              placeholder="Select a date"
              value={filterData.date || []}
              onChange={(selectedDates) => handleDateChange(selectedDates)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                mode: "multiple",
                dateFormat: "d.m.y",
              }}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="country-select"
              className="form-label text-muted text-uppercase fw-semibold mb-3"
            >
              Country
            </Label>

            <Select
              className="mb-0"
              value={filterData.country}
              onChange={handleSelectCountry}
              options={country}
              id="country-select"
            ></Select>
          </div>
          <div className="mb-4">
            <Label
              htmlFor="status-select"
              className="form-label text-muted text-uppercase fw-semibold mb-3"
            >
              Status
            </Label>
            <Row className="g-2">
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="newLeads"
                    value="new"
                    checked={
                      filterData.status && filterData.status.includes("new")
                    }
                    onChange={handleStatusChange}
                  />
                  <Label className="form-check-label" htmlFor="newLeads">
                    New Users
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="activeUsers"
                    value="active"
                    checked={
                      filterData.status && filterData.status.includes("active")
                    }
                    onChange={handleStatusChange}
                  />
                  <Label className="form-check-label" htmlFor="activeUsers">
                    Active Users
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="inactiveUsers"
                    value="inactive"
                    checked={
                      filterData.status &&
                      filterData.status.includes("inactive")
                    }
                    onChange={handleStatusChange}
                  />
                  <Label className="form-check-label" htmlFor="inactiveUsers">
                    Inactive Users
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="adminUsers"
                    value="admin"
                    checked={
                      filterData.status && filterData.status.includes("admin")
                    }
                    onChange={handleStatusChange}
                  />
                  <Label className="form-check-label" htmlFor="adminUsers">
                    Admin Users
                  </Label>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Label
              htmlFor="users-tags"
              className="form-label text-muted text-uppercase fw-semibold mb-3"
            >
              Tags
            </Label>
            <Row className="g-3">
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="marketing"
                    value="marketing"
                    checked={
                      filterData.tags && filterData.tags.includes("marketing")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="marketing">
                    Marketing
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="management"
                    value="management"
                    checked={
                      filterData.tags && filterData.tags.includes("management")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="management">
                    Management
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="business"
                    value="business"
                    checked={
                      filterData.tags && filterData.tags.includes("business")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="business">
                    Business
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="partner"
                    value="partner"
                    checked={
                      filterData.tags && filterData.tags.includes("partner")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="partner">
                    Partner
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="lead"
                    value="lead"
                    checked={
                      filterData.tags && filterData.tags.includes("lead")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="lead">
                    Leads
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="sale"
                    value="sale"
                    checked={
                      filterData.tags && filterData.tags.includes("sale")
                    }
                    onChange={handleTagChange}
                  />
                  <Label className="form-check-label" htmlFor="sale">
                    Sale
                  </Label>
                </div>
              </Col>
            </Row>
          </div>
        </OffcanvasBody>
        <div className="offcanvas-footer border-top p-3 text-center hstack gap-2">
          <button
            className="btn btn-light w-100"
            onClick={clearFilters}
            type="button"
          >
            Clear Filter
          </button>
          <button
            type="button"
            className="btn btn-success w-100"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </form>
    </Offcanvas>
  );
};

export default UserFilter;
