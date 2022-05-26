import React from "react";
import { ArrowLeft, ArrowLeftWhite } from "./svgindex";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = ({ history, style, isSuccessScreen, isCommonPTPropertyScreen, getBackPageNumber, className="" ,variant="black"}) => {
  const { t } = useTranslation();

  return (
    <div className={`back-btn2 ${className}`} style={style ? style : {}} onClick={() => {!isSuccessScreen ?( !isCommonPTPropertyScreen ? history.goBack() : history.go(getBackPageNumber()) ): null}}>
     {variant=="black"?( <React.Fragment><ArrowLeft />
      <p>{t("CS_COMMON_BACK")}</p></React.Fragment>):<ArrowLeftWhite />}
    </div>
  );
};
export default withRouter(BackButton);
