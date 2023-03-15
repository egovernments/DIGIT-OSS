import React from "react";
import { ActionBar, RemoveableTag, CloseSvg, Loader, Localities } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";
import AssignedTo from "./AssignedTo";
import { useLocation } from "react-router-dom";

const Filter = ({ searchParams, paginationParms, onFilterChange, onSearch, removeParam, ...props }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const isFstpOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const isFstpOperatorRequest = (Digit.UserService.hasAccess("FSM_EMP_FSTPO") && location.pathname.includes("fstp-fsm-request")) || false;

  // const hideLocalityFilter = Digit.UserService.hasAccess(["FSM_CREATOR_EMP", "FSM_VIEW_EMP"]);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();

  const { data: roleStatuses, isFetched: isRoleStatusFetched } = Digit.Hooks.fsm.useMDMS(state, "DIGIT-UI", "RoleStatusMapping");

  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

  const userRoleDetails = roleStatuses?.filter((roleDetails) => userRoles.filter((role) => role === roleDetails.userRole)[0]);

  const mergedRoleDetails = userRoleDetails?.reduce(
    (merged, details) => ({
      fixed: details?.fixed && merged?.fixed,
      statuses: [...merged?.statuses, ...details?.statuses].filter((item, pos, self) => self.indexOf(item) == pos),
      zeroCheck: details?.zeroCheck || merged?.zeroCheck,
    }),
    { statuses: [] }
  );

  const selectLocality = (d) => {
    isFstpOperator ? onFilterChange({ locality: [d] }) : onFilterChange({ locality: [...searchParams?.locality, d] });
  };

  const onStatusChange = (e, type) => {
    if (e.target.checked) onFilterChange({ applicationStatus: [...searchParams?.applicationStatus, type] });
    else onFilterChange({ applicationStatus: searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const clearAll = () => {
    if (isFstpOperator) return onFilterChange();
    onFilterChange({ applicationStatus: [], locality: [] });
    // props?.onClose?.();
  };

  return (
    <React.Fragment>
      {((!DSO && !isFstpOperator && searchParams && (searchParams?.applicationStatus?.length > 0 || searchParams?.locality?.length > 0)) ||
        mergedRoleDetails?.statuses?.length > 0 ||
        isFstpOperatorRequest) && (
        <div className="filter" style={{ marginTop: isFstpOperator ? "-0px" : "revert" }}>
          <div className="filter-card">
            <div className="heading">
              <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
              <div className="clearAll" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </div>
              {props.type === "desktop" && (
                <span className="clear-search" onClick={clearAll}>
                  {t("ES_COMMON_CLEAR_ALL")}
                </span>
              )}
              {props.type === "mobile" && (
                <span onClick={props.onClose}>
                  <CloseSvg />
                </span>
              )}
            </div>
            {/* <div>
            {!DSO && !isFstpOperator && searchParams && (
              <AssignedTo onFilterChange={onFilterChange} searchParams={searchParams} paginationParms={paginationParms} tenantId={tenantId} t={t} />
            )}
            <div> */}
            {/* {GetSelectOptions(t("ES_INBOX_LOCALITY"), localities, selectedLocality, onSelectLocality, "code", onRemove, "locality", "name")} */}
            {/* </div> */}
            {/* <Status applications={props.applications} onAssignmentChange={handleAssignmentChange} fsmfilters={searchParams} /> */}
            {/* </div> */}

            {mergedRoleDetails?.statuses?.length > 0 || isFstpOperatorRequest ? (
              <div>
                <div className="filter-label">{t("ES_INBOX_LOCALITY")}</div>
                {/* <Dropdown option={localities} keepNull={true} selected={null} select={selectLocality} optionKey={"name"} /> */}
                <Localities selectLocality={selectLocality} tenantId={tenantId} boundaryType="revenue" />
                <div className="tag-container">
                  {searchParams?.locality.map((locality, index) => {
                    return (
                      <RemoveableTag
                        key={index}
                        text={locality.i18nkey}
                        onClick={() => {
                          onFilterChange({ locality: searchParams?.locality.filter((loc) => loc.code !== locality.code) });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div>
              {isRoleStatusFetched && mergedRoleDetails && props?.applications?.statuses ? (
                <Status
                  onAssignmentChange={onStatusChange}
                  fsmfilters={searchParams}
                  mergedRoleDetails={mergedRoleDetails}
                  statusMap={props?.applications?.statuses}
                />
              ) : !location.pathname.includes("fstp-fsm-request") ? (
                <Loader />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
      {props.type === "mobile" && (
        <ActionBar>
          <ApplyFilterBar
            submit={false}
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => {
              onSearch();
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default Filter;
