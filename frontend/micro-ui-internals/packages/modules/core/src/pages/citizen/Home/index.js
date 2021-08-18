import React from "react"
import { StandaloneSearchBar, Loader, RadioButtons, CardHeader } from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next";

const Home = () => {
    
    const { t } = useTranslation()
    const { data: { stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData();

    return isLoading ? <Loader/> : <div className="HomePageWrapper">
        <div className="BannerWithSearch">
            <img src={stateInfo?.bannerUrl}/>
            <div className="Search">
                <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
            </div>
        </div>

    </div>
}

export default Home