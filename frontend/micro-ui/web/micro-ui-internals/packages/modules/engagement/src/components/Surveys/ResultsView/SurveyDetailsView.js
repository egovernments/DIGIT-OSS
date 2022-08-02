import { TextInput,Dropdown,RemoveableTag } from '@egovernments/digit-ui-react-components'
import React,{useMemo} from 'react'

const SurveyDetailsView = ({surveyTitle,surveyDesc,t}) => {
    const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const userInfo = Digit.UserService.getUser().info;
    const userUlbs = ulbs
    .filter((ulb) => userInfo?.roles?.some((role) => role?.tenantId === ulb?.code))
    const selectedTenat = useMemo(() => {
    const filtered = ulbs.filter((item) => item.code === tenantId);
    return filtered;
  }, [ulbs]);
  return (
      <div className="surveydetailsform-wrapper">
        <span className="surveyformfield">
            <label>{`${t("LABEL_FOR_ULB")} * :`}</label>
            <div style={{ display: "grid", gridAutoFlow: "row" }}>
                    <Dropdown
                    allowMultiselect={true}
                    optionKey={"i18nKey"}
                    option={userUlbs}
                    selected={selectedTenat}
                    keepNull={true}
                    disable={true}
                    t={t}
                    />
                    <RemoveableTag
                      key={"tag"}
                      text={userUlbs[0].name}
                    />
            </div>  
        </span>
    
        <span className="surveyformfield">
            <label>{t("CS_SURVEY_NAME")}</label>
            <TextInput
            name="title"
            type="text"
            disable={true}
            value={surveyTitle}
            />
        </span>
        <span className="surveyformfield">
            <label>{t("CS_SURVEY_DESCRIPTION")}</label>
            <TextInput
            name="description"
            type="text"
            disable={true}
            value={surveyDesc}
            />
        </span>
    </div>
  )
}

export default SurveyDetailsView