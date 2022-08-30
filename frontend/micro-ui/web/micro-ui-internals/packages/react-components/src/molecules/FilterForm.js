import React from "react";
import { CloseSvg } from "../atoms/svgindex";
import { useTranslation } from "react-i18next";
import SubmitBar from "../atoms/SubmitBar";

const FilterFormField = ({ children, className }) => {
  return <div className={`filter-form-field ${className}`}>{children}</div>;
};

const FilterForm = ({
  onMobileExclusiveFilterPopupFormClose = () => null,
  closeButton = () => null,
  showMobileFilterFormPopup = false,
  children,
  id = "",
  onSubmit,
  handleSubmit,
  onResetFilterForm = () => null,
  className = "",
}) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isEnabledCommonModules =
    window.location.href.includes("/obps/") ||
    window.location.href.includes("/noc/") ||
    window.location.href.includes("/ws/water/bill-amendment/inbox") ||
    window.location.href.includes("/ws/sewerage/bill-amendment/inbox");

  // min-height: calc(100% - 110
  // 	px
  // 	);
  return (
    <div className={isEnabledCommonModules && !isMobile ? `filter ${className}` : `filter-form ${className}`}>
      <div className="filter-card">
        {closeButton()}
        <div className="heading" style={{ alignItems: "center", gap: ".75rem", marginBottom: "24px" }}>
          <div className="filter-label" style={{ display: "flex", alignItems: "center" }}>
            <span>
              <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                  fill="#505A5F"
                />
              </svg>
            </span>
            <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("FILTERS_FILTER_CARD_CAPTION")}:</span>
          </div>
          <div className="clearAll" onClick={onResetFilterForm}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div>
          <span className="clear-search" onClick={onResetFilterForm} style={{ border: "1px solid #e0e0e0", padding: "6px", marginBottom: "10px" }}>
            <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                fill="#505A5F"
              />
            </svg>
          </span>
          {showMobileFilterFormPopup ? (
            <span onClick={onMobileExclusiveFilterPopupFormClose} className="mobile-only">
              <CloseSvg />
            </span>
          ) : null}
        </div>
        <form id={id} onSubmit={handleSubmit(onSubmit)}>
          {children}
        </form>
        <SubmitBar className="w-fullwidth" label={t("ES_COMMON_APPLY")} submit form={id} />
      </div>
    </div>
  );
};

export { FilterForm, FilterFormField };
