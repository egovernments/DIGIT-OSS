import { ActionBar, Card, CardHeader, CardLabel, CardLabelDesc, CardText, DownloadIcon, Header, Loader, MultiLink, ShareIcon, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, {Fragment, useRef} from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useLocation, useParams } from "react-router-dom"

const RequiredDocuments = ({path}) => {
	//connectionNumber=WS/107/2021-22/227166&tenantId=pb.amritsar&service=WATER&connectionType=Metered
	const {search} = useLocation()
	let { state } = useLocation();
  	state = state  ? (typeof(state) === "string" ? JSON.parse(state) : state) : {};
	const history = useHistory()
	const { t } = useTranslation()
	const stateId = Digit.ULBService.getStateId();
	const fullPageRef = useRef()

	const { isLoading: BillAmendmentMDMSLoading, data: BillAmendmentMDMS } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSMDMSBillAmendment({
		tenantId: stateId
	});
	const redirectToBillAmdmentPage = () => {
		history.push(`${path}/bill-amendment${search}`, JSON.stringify({ data: state?.data }));
	}
	const handlePrint = () => Digit.Download.PDF(fullPageRef, t("ES_COMMON_WS_DOCUMENTS_REQUIRED"));

	return <>
		<div ref={fullPageRef}>
			<div className="options">
				<Header >{t("ES_COMMON_WS_DOCUMENTS_REQUIRED")}</Header>
				<div className="mrsm" style={{marginRight:"35px"}} onClick={handlePrint}>
				<DownloadIcon className="mrsm" />
				{t(`ES_WS_REQUIRED_DOCS_DOWNLOAD`)}
				</div>
			</div>
			<Card style={{ position: "relative" }} className={"employeeCard-override"}>
				{BillAmendmentMDMSLoading ? <Loader /> : 
					BillAmendmentMDMS?.map( e => {
						return <>
							<CardHeader>{t(e.code).replaceAll("_", " ")}</CardHeader>
							<CardLabel>{t(`WS_DOCS_REQ_INFO`)}</CardLabel>
							{e.allowedDocuments.allowedDocs.map((e, i) => 
								<CardLabelDesc>{i+1}. {t(`${e.documentType}`)}</CardLabelDesc>
							)}
						</>
					})
				}
			</Card>
		</div>
		<ActionBar>
			<SubmitBar label={t("WS_COMMON_BUTTON_APPLY")} onSubmit={() => redirectToBillAmdmentPage()} />
		</ActionBar>
	</>
}

export default RequiredDocuments