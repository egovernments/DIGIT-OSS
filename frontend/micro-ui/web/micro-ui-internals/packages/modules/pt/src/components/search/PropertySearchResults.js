import { DetailsCard, Loader, Table, Modal } from "@egovernments/digit-ui-react-components";
import React, { memo, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PropertyInvalidMobileNumber from "../../pages/citizen/MyProperties/PropertyInvalidMobileNumber";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const SearchPTID = ({ tenantId, t, payload, showToast, setShowToast,ptSearchConfig }) => {
  const history = useHistory();
  
  const [searchQuery, setSearchQuery] = useState({
    /* ...defaultValues,   to enable pagination */
    ...payload,
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateNo, setShowUpdateNo] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [ownerInvalidMobileNumberIndex, setOwnerInvalidMobileNumberIndex] = useState(0);

  const { data, isLoading, error, isSuccess, billData ,revalidate} = Digit.Hooks.pt.usePropertySearchWithDue({
    tenantId,
    filters: searchQuery,
    configs: { enabled: Object.keys(payload).length > 0 ? true : false, retry: false, retryOnMount: false, staleTime: Infinity },
  });

  const mutation = Digit.Hooks.pt.usePropertyAPI(tenantId, false);

  const UpdatePropertyNumberComponent = Digit?.ComponentRegistryService?.getComponent("EmployeeUpdateOwnerNumber");
  const { data: updateNumberConfig } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "PropertyTax", ["UpdateNumber"], {
    select: (data) => {
      return data?.PropertyTax?.UpdateNumber?.[0];
    },
    retry: false,
    enable: false,
  });

  const handleCollectTaxClick = (val) => {
    let isAtleastOneMobileNumberInvalid = false

    let { owners } = val;

    owners = owners && owners.filter(owner => owner.status == "ACTIVE");
    owners && owners.map((owner, index) => {
      let number = owner.mobileNumber;
      
      if (
          (
            (number == updateNumberConfig?.invalidNumber)
            || !number.match(updateNumberConfig?.invalidPattern) 
            && number == JSON.parse(getUserInfo()).mobileNumber
          )
        ) {
        isAtleastOneMobileNumberInvalid = true;
        setOwnerInvalidMobileNumberIndex(index);
      }
    })

    if(isAtleastOneMobileNumberInvalid) {
      setShowModal(true);
      setSelectedProperty(val);
    } else {
      revalidate();
      history.push(`/digit-ui/employee/payment/collect/PT/${val?.["propertyId"]}`)
    }

  }

  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );

  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };

  const skipNContinue = () => {
    history.push(`/digit-ui/employee/payment/collect/PT/${selectedProperty?.['propertyId']}`)
  }

  const updateMobileNumber = () => {
    const ind = ownerInvalidMobileNumberIndex;

    setShowModal(true);
    setShowUpdateNo({
      name: selectedProperty?.owners[ind]?.name,
      mobileNumber: selectedProperty?.owners[ind]?.mobileNumber,
      index: ind,
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: t("PT_COMMON_TABLE_COL_PT_ID"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`/digit-ui/employee/pt/ptsearch/property-details/${row.original["propertyId"]}`}>{row.original["propertyId"]}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("PT_COMMON_TABLE_COL_OWNER_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(`${row.original.owners.map((ob) => ob.name).join(",")}` || ""),
      },
      {
        Header: t("ES_INBOX_LOCALITY"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(t(row.original.locality) || ""),
      },
      {
        Header: t("PT_COMMON_TABLE_COL_STATUS_LABEL"),
        Cell: ({ row }) => GetCell(t(row?.original?.status || "NA")),
        disableSortBy: true,
      },
      {
        Header: t("PT_AMOUNT_DUE"),
        Cell: ({ row }) => GetCell(row?.original?.due?`₹ ${row?.original?.due}`:t("PT_NA")),
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_ACTION"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.due > 0 && Digit.Utils.didEmployeeHasRole("PT_CEMP") ? (
                <span className="link"> 
                  <a  style={{textDecoration:'none'}} onClick={() => handleCollectTaxClick(row.original)}>{t("ES_PT_COLLECT_TAX")}</a>
                </span>
              ) : null}
            </div>
          );
        },
      },
    ],
    []
  );
  let isMobile = window.Digit.Utils.browser.isMobile();

  if (isLoading) {
    showToast && setShowToast(null);
    return <Loader />;
  }
  if (error) {
    !showToast && setShowToast({ error: true, label: error?.response?.data?.Errors?.[0]?.code || error });
    return null;
  }
  const PTEmptyResultInbox = memo(Digit.ComponentRegistryService.getComponent("PTEmptyResultInbox"));
  const getData = (tableData = []) => {
    return tableData?.map((dataObj) => {
      const obj = {};
      columns.forEach((el) => {
        if (el.Cell) obj[el.Header] = el.Cell({row:{original:dataObj}});
      });
      return obj;
    });
  };

  const tableData = Object.values(data?.FormattedData || {}) || [];
  if(ptSearchConfig?.ptSearchCount&&payload.locality&&tableData&&tableData.length>ptSearchConfig.ptSearchCount){
    !showToast &&setShowToast({ error: true, label: "PT_MODIFY_SEARCH_CRITERIA" });
    return null;
  }
  return (
    <React.Fragment>
      {data?.Properties?.length === 0 ? (
        <PTEmptyResultInbox data={true}></PTEmptyResultInbox>
      ) : isMobile ? (
        <DetailsCard data={getData(tableData)} t={t} />
      ) : (
        <Table
          t={t}
          data={tableData}
          totalRecords={data?.Properties?.length}
          columns={columns}
          getCellProps={(cellInfo) => {
            return {
              style: {
                padding: "20px 18px",
                fontSize: "16px",
              },
            };
          }}
          manualPagination={false}
          disableSort={true}
        />
      )}

      {showModal ? (
        <Modal
          headerBarMain={<h1 className="heading-m">{showUpdateNo ? t("PTUPNO_HEADER") : t("PT_INVALID_MOBILE_NO")}</h1>}
          headerBarEnd={
            <CloseBtn
              onClick={() => {
                setShowModal(false);
                setShowUpdateNo(false);
              }}
            />
          }
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "50%", marginTop: "auto" }}
        >
          {showUpdateNo && (
            <UpdatePropertyNumberComponent
              showPopup={setShowModal}
              name={showUpdateNo?.name}
              UpdateNumberConfig={updateNumberConfig}
              mobileNumber={showUpdateNo?.mobileNumber}
              t={t}
              onValidation={(data, showToast) => {
                let newProp = { ...selectedProperty };
               newProp.owners[showUpdateNo?.index].mobileNumber = data.mobileNumber;
                newProp.creationReason = "UPDATE";
                newProp.workflow = null;
                let newDocObj = { ...data };
                delete newDocObj.mobileNumber;
                newProp.documents = [
                  ...newProp.documents,
                  ...Object.keys(newDocObj).map((key) => ({
                    documentType: key,
                    documentUid: newDocObj[key],
                    fileStoreId: newDocObj[key],
                  })),
                ];
                mutation.mutate(
                  {
                    Property: newProp,
                  },
                  {
                    onError: () => {},
                    onSuccess: async (successRes) => {
                      showToast();
                      setTimeout(() => {
                        window.location.reload();
                      }, 3000);
                    },
                  }
                );
              }}
            />
          )}
          {!showUpdateNo && <PropertyInvalidMobileNumber propertyId={selectedProperty?.propertyId} userType={"employee"} skipNContinue={skipNContinue} updateMobileNumber={updateMobileNumber} />}
        </Modal>
      ) : null}

    </React.Fragment>
  );
};

export default SearchPTID;
