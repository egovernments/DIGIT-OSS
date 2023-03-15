import React from "react";
import { Label } from "../../ui-atoms";
import get from "lodash/get";
import { connect } from "react-redux";
import { getLocaleLabels, appendModulePrefix, getQueryArg } from "../../ui-utils/commons";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import isEmpty from "lodash/isEmpty";
import "./index.css";


class LabelContainer extends React.Component {
	render() {
		let {
			labelName,
			labelKey,
			localePrefix,
			fieldValue,
			isVisibleLabel,
			localizationLabels,
			dynamicArray,
			checkValueForNA,
			visibility = true,
			...rest
		} = this.props;
		let translatedLabel = getLocaleLabels(
			labelName,
			labelKey,
			localizationLabels
		);

		if (dynamicArray) {
			if (dynamicArray.length > 1) {
				dynamicArray.forEach((item, index) => {
					translatedLabel = translatedLabel.replace(
						new RegExp("\\{" + index + "\\}", "gm"),
						item
					);
				});
			} else {
				let index = 0;
				translatedLabel = translatedLabel.replace(
					new RegExp("\\{" + index + "\\}", "gm"),
					dynamicArray[0]
				);
			}
		}

		if (typeof fieldValue === "boolean") {
			fieldValue = fieldValue ? getLocaleLabels("SCORE_YES", "SCORE_YES") : getLocaleLabels("SCORE_NO", "SCORE_NO");
		}
		let fieldLabel =
			typeof fieldValue === "string"
				? getLocaleLabels(
					fieldValue,

					localePrefix && localePrefix.moduleName
						? appendModulePrefix(fieldValue, localePrefix)
						: fieldValue,
					localizationLabels
				)
				: fieldValue;

		let lebelName = translatedLabel


		let labelValue = fieldValue?fieldLabel: fieldValue ;
		
		labelValue =
			checkValueForNA && typeof checkValueForNA === "function"
				? checkValueForNA(labelValue)
				: labelValue;
		
		let isMode = getQueryArg(window.location.href, "mode");
		isMode = (isMode) ? isMode.toUpperCase() : "";
		let classname = (isMode === "MODIFY" && isVisibleLabel && labelValue && labelValue !== "NA") ? "show-label" :  "hide-label" ;   
		return (
			<React.Fragment>
				<Label
					className={classname}
					data-localization={
						labelKey ? labelKey : labelName ? labelName : fieldLabel
					}
					label={lebelName}
					{...rest}
				/>
				<Label
					className={classname}
					label={labelValue}
					{...rest}
				/>

			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, ownprops) => {
	let fieldValue = "",isVisibleLabel = false;
	const { localizationLabels } = state.app;
	const { jsonPath, callBack } = ownprops;
	const { screenConfiguration } = state;
	const { preparedFinalObject } = screenConfiguration;
	if (jsonPath) {
		fieldValue = get(preparedFinalObject, jsonPath);
		let newfieldValue = get(preparedFinalObject, jsonPath.replace('Old',''))
		if(newfieldValue !== fieldValue){
			isVisibleLabel = true;
			if (callBack && typeof callBack === "function") {
				fieldValue = callBack(fieldValue);
			}
		}
	}
	return { fieldValue, isVisibleLabel, localizationLabels };
};

export default connect(
	mapStateToProps,
	{}
)(LabelContainer);
