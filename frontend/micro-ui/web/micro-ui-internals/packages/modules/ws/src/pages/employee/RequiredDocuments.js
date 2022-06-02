import { ActionBar, Card, CardHeader, CardLabel, CardLabelDesc, CardText, DownloadIcon, Header, Loader, MultiLink, ShareIcon, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, {Fragment, useRef} from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useLocation, useParams } from "react-router-dom"

const RequiredDocuments = ({path}) => {
	//connectionNumber=WS/107/2021-22/227166&tenantId=pb.amritsar&service=WATER&connectionType=Metered
	const {search} = useLocation()
	const history = useHistory()
	const { t } = useTranslation()
	const stateId = Digit.ULBService.getStateId();
	const fullPageRef = useRef()

	const { isLoading: BillAmendmentMDMSLoading, data: BillAmendmentMDMS } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSMDMSBillAmendment({
		tenantId: stateId
	});
	const redirectToBillAmdmentPage = () => {
		history.push(`${path}/bill-amendment${search}`);
	}
	const handlePrint= () => Digit.Download.PDF(fullPageRef, t("BILLAMENDMENT_REQ_DOCS_HEADER"));

	return <>
		<div ref={fullPageRef}>
			<div className="options">
			<Header >{t("BILLAMENDMENT_REQ_DOCS_HEADER")}</Header>
				<div className="mrsm" onClick={handlePrint}>
				<DownloadIcon className="mrsm" />
				{t(`ES_WS_REQUIRED_DOCS_DOWNLOAD`)}
				</div>
			</div>
			<Card style={{ position: "relative" }} className={"employeeCard-override"}>
				{BillAmendmentMDMSLoading ? <Loader /> : 
					BillAmendmentMDMS?.map( e => {
						return <>
							<CardHeader>{t(e.i18nKey)}</CardHeader>
							<CardLabel>{t(`${e.i18nKey}_NOTE`)}</CardLabel>
							{e.allowedDocuments.allowedDocs.map((e, i) => 
								<CardLabelDesc>{i}. {t(`WS_${e.documentType}`)}</CardLabelDesc>
							)}
						</>
					})
				}
			</Card>
		</div>
		<ActionBar>
			  <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => redirectToBillAmdmentPage()} />
		</ActionBar>
	</>
}

export default RequiredDocuments