import React, { useEffect, useRef, useState } from "react";
import { Header, ResponseComposer, Loader, Modal, Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


const PropertySearchResults = ({ template, header, actionButtonLabel, isMutation, onSelect, config, clearParams = () => {} }) => {
  const { t } = useTranslation();
  const modalRef = useRef();
  const { mobileNumber, propertyIds, oldPropertyIds, locality, city,doorNo,name } = Digit.Hooks.useQueryParams();
  const filters = {};
  const [modalData, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };
  Digit.Hooks.useClickOutside(modalRef, closeModal, modalData);

  if (mobileNumber) filters.mobileNumber = mobileNumber;
  if (propertyIds) filters.propertyIds = propertyIds;
  if (oldPropertyIds) filters.oldPropertyIds = oldPropertyIds;
  if (locality) filters.locality = locality;
  if (doorNo) filters.doorNo = doorNo;
  if (name) filters.name = name;

  const [owners, setOwners, clearOwners] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS", null);
  // const [params, setParams, ] = Digit.Hooks.useSessionStorage("PT_MUTATE_PROPERTY");
  const [lastPath, setLastPath, clearLastPath] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS_LAST_PATH", null);

  useEffect(() => {
    setOwners([]);
    clearParams();
    setLastPath("");
  }, []);

  // const auth = !!isMutation;    /*  to enable open search set false  */
  const auth =true;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchArgs = city ? { tenantId: city, filters, auth } : { filters, auth };
  const result = Digit.Hooks.pt.usePropertySearch(searchArgs);
  const consumerCode = result?.data?.Properties?.map((a) => a.propertyId).join(",");

  const fetchBillParams = mobileNumber ? { mobileNumber, consumerCode } : { consumerCode };

  const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: "PT", ...fetchBillParams, tenantId: city },
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
    return <div>{t("CS_PT_NO_PROPERTIES_FOUND")}</div>;
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
      property_address: [addr.doorNo || "", addr.buildingName || "", addr.street || "", addr.locality?.name || "", addr.city || ""]
        .filter((a) => a)
        .join(", "),
      total_due: payment[property?.propertyId]?.total_due || 0,
      bil_due__date: payment[property?.propertyId]?.bil_due__date || t("N/A"),
    };
  });

  return (
    <div className="static" style={{ marginTop: "16px" }}>
      <div className="static-wrapper">
        {header && (
          <Header style={{ marginLeft: "8px" }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
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
