import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";


export const searchApplicationResult = {
	uiFramework: "custom-molecules",
	moduleName: "egov-wns",
	componentPath: "Table",
	visible: false,
	props: {
		columns: [
			{
				name: "Service",
				labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL",
				options: {
					filter: false,
					customBodyRender: value => (
						<span style={{ color: '#000000' }}>
							{value}
						</span>
					)
				}
			},
			{
				name: "Consumer No",
				labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
				options: {
					filter: false,
					customBodyRender: value => (
						<span style={{ color: '#000000' }}>
							{value}
						</span>
					)
				}
			},
			{ name: "Owner Name", labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL" },
			{ name: "Address", labelKey: "WS_COMMON_TABLE_COL_ADDRESS" },
			{ name: "Status", labelKey: "WS_COMMON_TABLE_COL_STATUS_LABEL" },
			{ name: "Due", labelKey: "WS_COMMON_TABLE_COL_DUE_LABEL" },
			{ name: "Due Date", labelKey: "WS_COMMON_TABLE_COL_DUE_DATE_LABEL" },
			{
				name: "Action",
				labelKey: "WS_COMMON_TABLE_COL_ACTION_LABEL",
				options: {
					filter: false,
					customBodyRender: (value, tableMeta) => (
						((value.totalAmount >= 0 || value.totalAmount < 0 ) && value.status === "Active") ? <div className="linkStyle" onClick={() => getPayDetails(tableMeta)}>
							<a>{`PAY`}</a>
						</div> : "NA"
					)
				},
			}

		],
		title: { labelKey: "WS_HOME_SEARCH_RESULTS_TABLE_HEADING", labelName: "Search Results for Water & Sewerage Connections" },
		options: {
			filter: false,
			download: false,
			responsive: "stacked",
			selectableRows: false,
			hover: true,
			rowsPerPageOptions: [10, 15, 20]
		},
		customSortColumn: {
			column: "Application Date",
			sortingFn: (data, i, sortDateOrder) => {
				const epochDates = data.reduce((acc, curr) => {
					acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
					return acc;
				}, []);
				const order = sortDateOrder === "asc" ? true : false;
				const finalData = sortByEpoch(epochDates, !order).map(item => {
					item.pop();
					return item;
				});
				return { data: finalData, currentOrder: !order ? "asc" : "desc" };
			}
		}
	}
};

const getConnectionDetails = data => {
	store.dispatch(
		setRoute(`connection-details?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}&due=${data.rowData[4]}`)
	)
}

const getPayDetails = tableMeta => {
	store.dispatch(
		setRoute(`/withoutAuth/egov-common/pay?consumerCode=${tableMeta.rowData[7].connectionNo}&tenantId=${tableMeta.rowData[7].tenantId}&businessService=${tableMeta.rowData[7].businessService}`)
	)
}