import React, { useEffect, useRef, useState } from "react";
import { Header, ResponseComposer, Loader, Modal, Card, KeyNote, SubmitBar, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory, Link, useLocation, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";
const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";
const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";

const PropertySearchResults = ({ template, header, actionButtonLabel, isMutation, onSelect, config, clearParams = () => {}, stateCode, redirectToUrl, searchQuery }) => {
  const { t } = useTranslation();
  const modalRef = useRef();
  const { mobileNumber, propertyIds, oldPropertyIds, locality, city,doorNo,name, PToffset } = Digit.Hooks.useQueryParams();
  const filters = {};
  const [modalData, setShowModal] = useState(false);

  const PrivacyInfoLabel = Digit.ComponentRegistryService.getComponent("WSInfoLabel");

  let OfsetForSearch = PToffset;
  let t1;
  let off;
  if (!isNaN(parseInt(OfsetForSearch))) {
    off = OfsetForSearch;
    t1 = parseInt(OfsetForSearch) + 5;
  } else {
    t1 = 5;
  }
  let filter1 = !isNaN(parseInt(OfsetForSearch))
    ? { limit: "5", sortOrder: "ASC", sortBy: "createdTime", offset: off }
    : { limit: "5", sortOrder: "ASC", sortBy: "createdTime", offset: "0" };

  const closeModal = () => {
    setShowModal(false);
  };
  Digit.Hooks.useClickOutside(modalRef, closeModal, modalData);

  if (mobileNumber || ( searchQuery && searchQuery.mobileNumber ) ) filters.mobileNumber = mobileNumber ? mobileNumber : searchQuery?.mobileNumber;
  if (propertyIds || ( searchQuery && searchQuery.propertyIds ) ) filters.propertyIds = propertyIds ? propertyIds : searchQuery?.propertyIds;
  if (oldPropertyIds || ( searchQuery && searchQuery.oldPropertyIds ) ) filters.oldPropertyIds = oldPropertyIds ? oldPropertyIds : searchQuery?.oldPropertyIds;
  if (locality || ( searchQuery && searchQuery.locality ) ) filters.locality = locality ? locality : searchQuery?.locality;
  if (doorNo || ( searchQuery && searchQuery.doorNo ) ) filters.doorNo = doorNo ? doorNo : searchQuery?.doorNo;
  if (name || ( searchQuery && searchQuery.name ) ) filters.name = name ? name : searchQuery?.name;
  if (locality || ( searchQuery && searchQuery.locality ) ){
    filters.limit = filter1.limit;
    filters.sortOrder = filter1.sortOrder;
    filters.sortBy = filter1.sortBy;
    filters.offset = filter1.offset;
  }
  
  const [owners, setOwners, clearOwners] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS", null);
  // const [params, setParams, ] = Digit.Hooks.useSessionStorage("PT_MUTATE_PROPERTY");
  const [lastPath, setLastPath, clearLastPath] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS_LAST_PATH", null);

  const { path, url } = useRouteMatch();
  const searchParams = Digit.Hooks.useQueryParams();
  useEffect(() => {
    setOwners([]);
    clearParams();
    setLastPath("");
  }, []);

  // const auth = !!isMutation;    /*  to enable open search set false  */
  const auth =true;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const scity = city ? city : searchQuery?.city;
  const searchArgs = scity ? { tenantId: scity, filters, auth } : { filters, auth };
  const result = Digit.Hooks.pt.usePropertySearch(searchArgs,{privacy: Digit.Utils.getPrivacyObject()});
  const consumerCode = result?.data?.Properties?.map((a) => a.propertyId).join(",");

  const fetchBillParams = mobileNumber ? { mobileNumber, consumerCode } : { consumerCode };

  const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: "PT", ...fetchBillParams, tenantId: scity },
    {
      enabled: consumerCode ? true : false,
      retry: false,
    }
  );

  const history = useHistory();

  const proceedToPay = (data) => {
    history.push(`/digit-ui/citizen/payment/my-bills/PT/${data.property_id}`, { tenantId });
  };

  if (paymentDetails.isLoading || result.isLoading) {
    return <Loader />;
  }

  if (result.error || !consumerCode) {
    return (
      <div style={{height : "150px"}}>
        <Card style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>{t("CS_PT_NO_PROPERTIES_FOUND")}</Card>
      </div>
    );
  }

  const onSubmit = (data) => {
    if (isMutation) {
      let property = result?.data?.Properties?.filter?.((e) => e.propertyId === data.property_id)[0];
      if (Number(data.total_due) > 0) {
        setShowModal(data);
      } else onSelect(config.key, { data, property });
    } else history.push(`/digit-ui/citizen/payment/my-bills/PT/${data.property_id}`, { tenantId });
  };


  const payment = {};

  paymentDetails?.data?.Bill?.forEach((element) => {
    if (element?.consumerCode) {
      payment[element?.consumerCode] = {
        total_due: element?.totalAmount,
        bil_due__date: new Date(element?.billDate).toDateString(),
      };
    }
  });

  const arr = isMutation ? result?.data?.Properties?.filter((e) => e.status === "ACTIVE") : result?.data?.Properties;

  const searchResults = arr?.map((property) => {
    let addr = property?.address || {};
   
    return {
      property_id: property?.propertyId,
      owner_name: (property?.owners || [])[0]?.name,
      property_address: [addr.doorNo || "", addr.buildingName || "", addr.street || "", t(`TENANTS_MOHALLA_${addr.locality?.code}`) || "", t(addr.tenantId) || ""]
        .filter((a) => a)
        .join(", "),
      total_due: payment[property?.propertyId]?.total_due || 0,
      bil_due__date: payment[property?.propertyId]?.bil_due__date || t("N/A"),
      status:t(property.status),
      owner_mobile: (property?.owners || [])[0]?.mobileNumber,
      privacy: {
        property_address : {
          uuid: property?.owners?.[0]?.uuid, 
          fieldName: ["doorNo" , "street" , "landmark"], 
          model: "Property",showValue: true,
          loadData: {
            serviceName: "/property-services/property/_search",
            requestBody: {},
            requestParam: { tenantId : property?.tenantId, propertyIds : property?.propertyId },
            jsonPath: "Properties[0].address.street",
            isArray: false,
            d: (res) => {
              let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
              return resultString;
            }
          },
        }
      }  };
  });
  const getUserType = () => Digit.UserService.getType();

  const getFromLocation = (state, searchParams) => {
    return state?.from || searchParams?.from || DEFAULT_REDIRECT_URL;
  };

  const sendOtpToUser = async (record) => {
    if(onSelect) {
      onSelect('cptId', { id: record.property_id }); 
    } else {
      const data = {
        mobileNumber : record?.owner_mobile,
        tenantId: stateCode,
        userType: getUserType(),
      };
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN} });
      
      if (!err) {
        // Redirect to props redirect url if exists else to link success page
        let redirectUrl = '/digit-ui/citizen/commonPt/property/link-success/'+record.property_id;
        if(redirectToUrl) {
          redirectUrl = redirectToUrl+'?propertyId='+record.property_id+'&tenantId='+tenantId;
        } 

        history.replace(`/digit-ui/citizen/commonPt/property/citizen-otp`, { from: getFromLocation(location.state, searchParams), mobileNumber: record.owner_mobile, redirectBackTo: redirectUrl });
        return;
      } else {
        history.push(`/digit-ui/citizen/`, { from: getFromLocation(location.state, searchParams), data:data });
      }
    }
  };
 
  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };
  
  return (
    <div className="static" style={{ marginTop: "16px" }}>
      <div className="static-wrapper">
        {header && (
          <Header style={{ marginLeft: "8px" }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
        { <PrivacyInfoLabel t={t} /> }
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel}
        onSubmit={sendOtpToUser} />
      </div>
      {modalData ? (
        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "319px", height: "250px", margin: "auto" }}
          formId="modal-action"
        >
          <div ref={modalRef}>
            <KeyNote
              keyValue={t("PT_AMOUNT_DUE")}
              note={`₹ ${modalData?.total_due?.toLocaleString("en-IN")}`}
              noteStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
            <p>
              {t("PT_YOU_HAVE") +
                " " +
                "₹" +
                " " +
                modalData?.total_due.toLocaleString("en-IN") +
                " " +
                t("PT_PENDING_AMOUNT") +
                " " +
                t("PT_INORDER_TO_TRANSFER")}
            </p>
            <SubmitBar
              submit={false}
              onSubmit={() => proceedToPay(modalData)}
              style={{ marginTop: "14px", width: "100%" }}
              label={t("PT_PROCEED_PAYMENT")}
            />
          </div>
        </Modal>
      ) : null}
      {!searchResults?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_PROP_FOUND_MSG")}</p>}
      {searchResults?.length !== 0 && (searchResults?.length == 5 || searchResults?.length == 50) && (locality || ( searchQuery && searchQuery.locality )) && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("PT_LOAD_MORE_MSG")}{" "}
              <span className="link">{<Link to={`/digit-ui/citizen/pt/property/search-results?mobileNumber=${mobileNumber || searchQuery.mobileNumber ?mobileNumber || searchQuery?.mobileNumber:""}&propertyIds=${propertyIds || searchQuery?.propertyIds ?propertyIds || searchQuery?.propertyIds:""}&oldPropertyIds=${oldPropertyIds || searchQuery?.oldPropertyIds?oldPropertyIds || searchQuery?.oldPropertyIds:""}&doorNo=${doorNo || searchQuery?.doorNo?doorNo || searchQuery?.doorNo:""}&name=${name || searchQuery?.name?name || searchQuery?.name:""}&city=${city?city:""}&locality=${locality || searchQuery?.locality?locality || searchQuery?.locality:""}&PToffset=${t1}`}>{t("PT_COMMON_CLICK_HERE")}</Link>}</span>
            </p>
          </div>
        )}
    </div>
  );
};

PropertySearchResults.propTypes = {
  template: PropTypes.any,
  header: PropTypes.string,
  actionButtonLabel: PropTypes.string,
};

PropertySearchResults.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null,
};

export default PropertySearchResults;
