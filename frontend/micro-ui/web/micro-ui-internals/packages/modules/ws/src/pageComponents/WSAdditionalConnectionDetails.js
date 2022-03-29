import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, TextInput } from '@egovernments/digit-ui-react-components';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const WSAdditionalConnectionDetails = ({ t, config, onSelect, userType, formData, setError, formState, clearErrors }) => {
	const [connectionDetails, setConnectionDetails] = React.useState(formData[config?.key] || {
		connectionType: {},
		waterSource: {},
		waterSubSource: {},
	});

	const [isErrors, setIsErrors] = React.useState(false);

	const {
		formState: localFormState,
		control,
		errors,
		watch,
		trigger,
	} = useForm();

	const formValues = watch();

	React.useEffect(() => {
		trigger();
	}, []);

	React.useEffect(() => {
		const part = {};

		Object.keys(formValues).forEach((key) => part[key] = formValues[key]);

		if (!_.isEqual(part, connectionDetails)) {
			let isErrorsFound = true;

			Object.keys(formValues).map(data => {
				if (!formValues[data] && isErrorsFound) {
					isErrorsFound = false
					setIsErrors(false);
				}
			});

			if (isErrorsFound) setIsErrors(true);

			setConnectionDetails(part);
			trigger();
		}
	}, [formValues]);

	React.useEffect(() => {
		let isClear = true;

		Object.keys(connectionDetails).map(key => {
			if (!connectionDetails[key] && isClear) isClear = false
		})

		if (isClear && Object.keys(connectionDetails).length) {
			clearErrors(config?.key);
		}

		if (connectionDetails.connectionType) clearErrors(config.key, { type: "connectionType" })
		if (connectionDetails.waterSource) clearErrors(config.key, { type: "waterSource" })
		if (connectionDetails.waterSubSource) clearErrors(config.key, { type: "waterSubSource" })

		trigger();
	}, [connectionDetails]);

	React.useEffect(() => {
		if (Object.keys(localFormState.errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, localFormState.errors)) {
			setError(config.key, { type: localFormState.errors });
		}
		else if (!Object.keys(localFormState.errors).length && formState.errors[config.key] && isErrors) {
			clearErrors(config.key);
		}
	}, [localFormState.errors]);

	React.useEffect(() => {
		onSelect(config?.key, connectionDetails);
	}, [connectionDetails]);

	const [connectionTypes, setConnectionTypes] = React.useState([]);
	const [waterSourcesNSubSources, setWaterSourcesNSubSources] = React.useState([]);
	const { data: wsServiceMast } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-masters", ["waterSource", "connectionType"]);

	React.useEffect(() => {
		setConnectionTypes(wsServiceMast?.["ws-services-masters"]?.connectionType || connectionTypes)
		setWaterSourcesNSubSources(wsServiceMast?.["ws-services-masters"]?.waterSource || waterSourcesNSubSources);
	}, [wsServiceMast]);

	const waterSources = () => {
		const codes = new Set();
		const waterSources = [];

		waterSourcesNSubSources.forEach((e) => {
			const name = e.name.substring(0, e.name.indexOf('-'));
			const code = e.code.substring(0, e.code.indexOf('.'));
			const active = e.active;

			if (!codes.has(code)) {
				codes.add(code);
				waterSources.push({ name, code, active });
			}
		});

		return waterSources;
	};

	const waterSubSources = (source) => {
		const waterSubSources = [];

		waterSourcesNSubSources.forEach((e) => {
			if (e?.code?.toLowerCase().includes(source?.code?.toLowerCase())) {
				waterSubSources.push(e);
			}
		});

		return waterSubSources;
	};

	const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

	return (
		<React.Fragment>
			<LabelFieldPair>
				<CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_CONNECTION_TYPE")}*:`}</CardLabel>
				<div className="field">
					<Controller
						control={control}
						name="connectionType"
						defaultValue={connectionDetails?.connectionType}
						type="text"
						rules={{ required: t("REQUIRED_FIELD") }}
						isMandatory={true}
						render={(props) => (
							<Dropdown
								option={connectionTypes}
								selected={props.value}
								select={(value) => {
									props.onChange(value);
									setConnectionDetails({ ...connectionDetails, connectionType: value });
								}}
								optionKey="name"
								errorStyle={(localFormState.touched.connectionType && errors?.connectionType?.message) ? true : false}
								labelStyle={{ marginTop: "unset" }}
								onBlur={props.onBlur}
							/>
						)}
					/>
				</div>
			</LabelFieldPair>
			<CardLabelError style={errorStyle}>{localFormState.touched.connectionType ? errors?.connectionType?.message : ""}</CardLabelError>

			<LabelFieldPair>
				<CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_WATER_SOURCE")}*:`}</CardLabel>
				<div className="field">
					<Controller
						control={control}
						name="waterSource"
						defaultValue={connectionDetails?.waterSource}
						rules={{ required: t("REQUIRED_FIELD") }}
						type="text"
						isMandatory={true}
						render={(props) => (
							<Dropdown
								type="text"
								option={waterSources()}
								select={(value) => {
									props.onChange(value);
									setConnectionDetails({ ...connectionDetails, waterSource: value });
								}}
								selected={props.value}
								optionKey="name"
								errorStyle={(localFormState.touched.waterSource && errors?.waterSource?.message) ? true : false}
								labelStyle={{ marginTop: "unset" }}
								onBlur={props.onBlur}
							/>
						)}
					/>
				</div>
			</LabelFieldPair>
			<CardLabelError style={errorStyle}>{localFormState.touched.waterSource ? errors?.waterSource?.message : ""}</CardLabelError>

			<LabelFieldPair>
				<CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_WATER_SUB_SOURCE")}*:`}</CardLabel>
				<div className="field">
					<Controller
						control={control}
						name="waterSubSource"
						defaultValue={connectionDetails?.waterSubSource}
						rules={{ required: t("REQUIRED_FIELD") }}
						type="text"
						isMandatory={true}
						render={(props) => (
							<Dropdown
								option={waterSubSources(connectionDetails?.waterSource)}
								select={(value) => {
									props.onChange(value);
									setConnectionDetails({ ...connectionDetails, waterSubSource: value });
								}}
								selected={props.value}
								optionKey="name"
								isMandatory={true}
								errorStyle={(localFormState.touched.waterSubSource && errors?.waterSubSource?.message) ? true : false}
								labelStyle={{ marginTop: "unset" }}
								onBlur={props.onBlur}
							/>
						)}
					/>
				</div>
			</LabelFieldPair>
			<CardLabelError style={errorStyle}>{localFormState.touched.waterSubSource ? errors?.waterSubSource?.message : ""}</CardLabelError>

		</React.Fragment>
	)
}

export default WSAdditionalConnectionDetails;