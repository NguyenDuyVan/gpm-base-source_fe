import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get } from "lodash";

//i18n
import i18n from "@/i18n";
import languages from "../../common/languages";
import { useUpdateLanguageMutation } from "@/api/mutations/useUserMutation";
import { useAccountQuery } from "@/api/queries/useAuthQuery";

const LanguageDropdown = () => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("");
  const { mutateAsync: updateLanguage } = useUpdateLanguageMutation();
  const { data: accountData } = useAccountQuery();

  useEffect(() => {
    const currentLanguage: any = localStorage.getItem("I18N_LANGUAGE");
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = async (lang: any) => {
    const availableLang = Object.keys(languages).includes(lang) ? lang : "en";
    //set language as i18n
    i18n.changeLanguage(availableLang);
    localStorage.setItem("I18N_LANGUAGE", availableLang);
    setSelectedLang(availableLang);

    // Call API to update user's language preference
    if (accountData) {
      await updateLanguage(availableLang);
    }
  };

  const [isLanguageDropdown, setIsLanguageDropdown] = useState<boolean>(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdown(!isLanguageDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isLanguageDropdown}
        toggle={toggleLanguageDropdown}
        className="ms-1 topbar-head-dropdown header-item"
      >
        <DropdownToggle
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
          tag="button"
        >
          <img
            src={get(languages, `${selectedLang}.flag.src`)}
            alt="Header Language"
            height="20"
            className="rounded size-6"
          />
        </DropdownToggle>
        <DropdownMenu className="notify-item language py-2">
          {Object.keys(languages).map((key) => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item  ${
                selectedLang === key ? "active" : "none"
              }`}
            >
              <div className="flex">
                <img
                  src={get(languages, `${key}.flag.src`)}
                  alt="Skote"
                  className="me-2 rounded size-4"
                  height="18"
                />
                <span className="align-middle">
                  {get(languages, `${key}.label`)}
                </span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default LanguageDropdown;
