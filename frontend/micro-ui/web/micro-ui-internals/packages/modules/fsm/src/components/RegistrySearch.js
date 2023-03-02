import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Label,
  SubmitBar,
  LinkLabel,
  ActionBar,
  CloseSvg,
  DatePicker,
  CardLabelError,
  Menu,
  AddIcon,
} from "@egovernments/digit-ui-react-components";
import DropdownStatus from "./inbox/DropdownStatus";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const SearchApplication = ({ onSearch, type, onClose, onTabChange, isFstpOperator, searchFields, searchParams, isInboxPage, selectedTab }) => {
  const storedSearchParams = isInboxPage ? Digit.SessionStorage.get("fsm/inbox/searchParams") : Digit.SessionStorage.get("fsm/search/searchParams");

  const { data: applicationStatuses, isFetched: areApplicationStatus } = Digit.Hooks.fsm.useApplicationStatus();

  const { t } = useTranslation();
  const history = useHistory();
  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: storedSearchParams || searchParams,
  });
  const [error, setError] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const mobileView = innerWidth <= 640;
  const FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const watchSearch = watch(["applicationNos", "mobileNumber"]);

  const onSubmitInput = (data) => {
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }
    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  function clearSearch() {
    const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
    reset(resetValues);
    if (isInboxPage) {
      Digit.SessionStorage.del("fsm/inbox/searchParams");
    } else {
      Digit.SessionStorage.del("fsm/search/searchParams");
    }
    onSearch({});
  }

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0, display: "inline" } : { marginTop: "40px", marginLeft: "16px" };
    return (
      <LinkLabel style={{ ...mobileViewStyles }} onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  const onAddClick = () => {
    setShowAddMenu(!showAddMenu);
  };

  const searchValidation = (data) => {
    return null;
  };

  function onActionSelect(action) {
    switch (action) {
      case "VENDOR":
        return history.push("/digit-ui/employee/fsm/registry/new-vendor");
      case "VEHICLE":
        return history.push("/digit-ui/employee/fsm/registry/new-vehicle");
      case "DRIVER":
        return history.push("/digit-ui/employee/fsm/registry/new-driver");
      default:
        break;
    }
  }

  const getFields = (input) => {
    switch (input.type) {
      case "date":
        return (
          <Controller
            render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
      case "status":
        return (
          <Controller
            render={(props) => (
              <DropdownStatus
                onAssignmentChange={props.onChange}
                value={props.value}
                applicationStatuses={applicationStatuses}
                areApplicationStatus={areApplicationStatus}
              />
            )}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
      default:
        return (
          <TextInput
            {...input}
            inputRef={register}
            {...register(input.name, {
              validate: searchValidation,
            })}
            watch={watch}
            shouldUpdate={true}
          />
        );
    }
  };

  return (
    <React.Fragment>
      <div className="search-container" style={{ width: "auto" }}>
        <div className="search-complaint-container">
          {(type === "mobile" || mobileView) && (
            <div className="complaint-header">
              <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
              <span
                style={{
                  position: "absolute",
                  top: "2%",
                  right: "8px",
                }}
                onClick={onClose}
              >
                <CloseSvg />
              </span>
            </div>
          )}
          <div className="search-tabs-container">
            <div>
              <button
                className={selectedTab === "VENDOR" ? "search-tab-head-selected" : "search-tab-head"}
                onClick={() => {
                  clearSearch({});
                  onTabChange("VENDOR");
                }}
              >
                {t("ES_FSM_REGISTRY_INBOX_TAB_VENDOR")}
              </button>
              <button
                className={selectedTab === "VEHICLE" ? "search-tab-head-selected" : "search-tab-head"}
                onClick={() => {
                  clearSearch({});
                  onTabChange("VEHICLE");
                }}
              >
                {t("ES_FSM_REGISTRY_INBOX_TAB_VEHICLE")}
              </button>
              <button
                className={selectedTab === "DRIVER" ? "search-tab-head-selected" : "search-tab-head"}
                onClick={() => {
                  clearSearch({});
                  onTabChange("DRIVER");
                }}
              >
                {t("ES_FSM_REGISTRY_INBOX_TAB_DRIVER")}
              </button>
            </div>
            <div className="action-bar-wrap-registry">
              <div className="search-add" onClick={onAddClick}>
                {t("ES_FSM_REGISTRY_INBOX_HEADER_ADD")}
                <div className="search-add-icon">
                  <AddIcon className="" />
                </div>
              </div>
              {showAddMenu && (
                <Menu localeKeyPrefix={"ES_FSM_ACTION_CREATE"} options={["VENDOR", "DRIVER", "VEHICLE"]} t={t} onSelect={onActionSelect} />
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmitInput)}>
            <div
              className={FSTP ? "complaint-input-container for-pt for-search" : "complaint-input-container"}
              style={{ width: "100%", gridTemplateColumns: "33.33% 66.66% 0%" }}
            >
              {searchFields?.map((input, index) => (
                <span key={index} className={index === 0 ? "complaint-input" : "mobile-input"}>
                  <Label>{input.label}</Label>
                  {getFields(input)}{" "}
                </span>
              ))}
              <div style={{ display: "flex" }}>
                {type === "desktop" && !mobileView && <SubmitBar className="submit-bar-search" label={t("ES_COMMON_SEARCH")} submit />}
                {type === "desktop" && !mobileView && <span className="clear-search">{clearAll()}</span>}
              </div>
            </div>
            {error ? <CardLabelError className="search-error-label">{t("ES_SEARCH_APPLICATION_ERROR")}</CardLabelError> : null}
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SearchApplication;
