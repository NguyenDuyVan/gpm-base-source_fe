import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
  const { t } = useTranslation();
  const profiledropdownData = createSelector(
    (state: any) => state.Profile,
    (user) => user.user
  );
  // Inside your component
  const user = useSelector(profiledropdownData);

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const authUSer: any = localStorage.getItem("authUser");
    if (authUSer) {
      const obj: any = JSON.parse(authUSer);
      setUserName(
        process.env.NEXT_PUBLIC_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name || obj.fullName || t("Admin") // Use || to provide a fallback
            : t("Admin")
          : process.env.NEXT_PUBLIC_DEFAULTAUTH === "firebase"
          ? obj.email || t("Admin") // Use || to provide a fallback
          : t("Admin")
      );
    }
  }, [userName, user, t]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1.src}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {" "}
                {userName || t("Admin")}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {t("Admin")}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">
            {t("Welcome Back")} {userName}!
          </h6>
          <DropdownItem className="p-0">
            <Link href="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">{t("Profile")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link href="/admin/profile/setting" className="dropdown-item">
              <span className="badge bg-success-subtle text-success mt-1 float-end">
                {t("New")}
              </span>
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">{t("Settings")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link href="/logout" className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle" data-key="t-logout">
                {t("Logout")}
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
