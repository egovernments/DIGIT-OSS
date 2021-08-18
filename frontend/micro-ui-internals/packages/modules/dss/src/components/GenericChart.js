import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardSubHeader,
  DownloadIcon,
  TextInput,
  CardCaption,
  CardLabel,
  Ellipsis,
  SearchIconSvg,
} from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const renderUnits = (denomination) => {
  switch (denomination) {
    case "Unit":
      return "";
    case "Lac":
      return "(In Lac)";
    case "Cr":
      return "(In Cr)";
  }
};

const SearchImg = () => {
  return <SearchIconSvg className="signature-img" />;
};

const GenericChart = ({ header, className, caption, children, showSearch = false, showDownload = false, onChange }) => {
  const { t } = useTranslation();

  const { value } = useContext(FilterContext);

  return (
    <Card className={`chart-item ${className}`}>
      <div className="chartHeader">
        <CardLabel style={{ fontWeight: "bold", wordBreak: "break-all" }}>{`${t(header)} ${renderUnits(value.denomination)}`}</CardLabel>
        <div className="sideContent">
          {showSearch && <TextInput className="searchInput" placeholder="Search" signature={true} signatureImg={<SearchImg />} onChange={onChange} />}
          {showDownload && <DownloadIcon className="mrlg" />}
          <Ellipsis />
        </div>
      </div>
      {caption && <CardCaption>{caption}</CardCaption>}
      {/* <div className="chart-item"> */}
      {children}
      {/* </div> */}
    </Card>
  );
};

export default GenericChart;
