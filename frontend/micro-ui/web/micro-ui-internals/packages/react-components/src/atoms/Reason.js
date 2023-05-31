import React,{Fragment} from "react";
import { useTranslation } from "react-i18next";
// TODO @Nipun localise 
const Reason = ({ headComment, otherComment, additionalComment }) => {
    const { t } = useTranslation()
    const getMarkup = () => {
        if(additionalComment) {
            return <div className="checkpoint-comments-wrap" style={{marginBottom:"1rem"}}>
                <p>{t("COMMON_CERTIFY_ONE")}</p>
                <br />
                <p>
                    <b> {t("ES_COMMON_NOTE")}</b>{t("COMMON_CERTIFY_TWO")}
                </p>
                </div>
            
        }
        else {
            return <div className="checkpoint-comments-wrap">
                <h4>{headComment}</h4>
                <p>{otherComment}</p>
            </div>
        }
    }
    return (
        getMarkup()
    );
}

export default Reason;
