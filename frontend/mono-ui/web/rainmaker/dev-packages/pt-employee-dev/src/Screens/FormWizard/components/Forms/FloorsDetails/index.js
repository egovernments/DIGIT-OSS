import React from "react";
import { Card, ToolTipUi } from "components";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import CustomSelectForm from "../CustomSelectForm";
import GenericForm from "egov-ui-kit/common/GenericForm";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";

class FloorDetails extends React.Component {
  state = {
    floors: this.cacheFloors ? this.cacheFloors : [],
  };

  componentDidMount() {
    this.configureFloors(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.noFloors !== this.props.noFloors) {
      this.configureFloors(nextProps);
    }
  }

  configureFloors = (props) => {
    const { noFloors, componentDetails, disabled, form } = props;
    let updatedFloors = [...Array(parseInt(noFloors))].map((item, key) => {
      let units = [];

      const unitKeys = Object.keys(form).filter((item) => {
        return item.startsWith(`${componentDetails.copyName}_${key}_unit_`);
      });

      if (unitKeys.length === 0) {
        const formKey = `${componentDetails.copyName}_${key}_unit_0`;
        units.push({
          component: formHoc({ ...componentDetails, copyName: formKey, disabled, isCoreConfiguration: true })(GenericForm),
          formKey: formKey,
        });
      } else {
        unitKeys.forEach((formKey, ind) => {
          units.push({
            component: formHoc({ ...componentDetails, copyName: formKey, disabled, isCoreConfiguration: true })(GenericForm),
            formKey: formKey,
          });
        });
      }
      return {
        floorId: key,
        floorDropDown: formHoc({
          formKey: "customSelect",
          makeCopy: true,
          copyName: "customSelect_" + key,
          path: "PropertyTaxPay",
          disabled,
          isCoreConfiguration: true,
        })(CustomSelectForm),
        units,
      };
    });
    this.setState({
      floors: noFloors > 0 ? [...updatedFloors] : [],
    });
  };

  renderFloors = (floors, noFloors) => {
    const { renderUnits } = this;
    const { disabled } = this.props;

    return floors.map((floor, key) => {
      const { floorId, floorDropDown: FloorDropDown, units } = floor;
      return (
        <Card
          key={key}
          textChildren={
            <div>
              <FloorDropDown noFloors={noFloors} disabled={disabled} />
              <div className={`col-xs-12`}>{renderUnits(units, floorId)}</div>
            </div>
          }
        />
      );
    });
  };

  handleAddUnit = (floorIndex) => {
    const { componentDetails, form } = this.props;
    let { floors } = this.state;
    const unitKeys = Object.keys(form).filter((key) => {
      return key.startsWith(`floorDetails_${floorIndex}_unit_`);
    });
    const index = parseInt(unitKeys[unitKeys.length - 1].split("unit_")[1]);
    const formKey = `${componentDetails.copyName}_${floorIndex}_unit_${index + 1}`;
    floors[floorIndex].units.push({
      component: formHoc({ ...componentDetails, copyName: formKey, isCoreConfiguration: true })(GenericForm),
      formKey: formKey,
    });
    this.setState({
      floors,
    });
  };

  handleRemoveUnit = (floorIndex, unitIndex, formKey) => {
    let { floors } = this.state;
    floors[floorIndex].units.splice(unitIndex, 1);
    this.props.removeForm(formKey);
    this.setState({
      floors,
    });
  };

  renderUnits = (units, floorId) => {
    const { disabled } = this.props;
    const { handleAddUnit, handleRemoveUnit } = this;
    return (
      <div>
        {units.map((unit, key) => {
          const Unit = unit.component;
          return (
            <Unit
              key={key}
              className={"grayout"}
              handleRemoveItem={key !== 0 ? (!disabled ? () => handleRemoveUnit(floorId, key, unit.formKey) : undefined) : undefined}
              disabled={disabled}
              formName={
                <div style={{ display: "flex" }}>
                  <Label label="PT_UNIT" />
                  <Label label="-" />
                  <Label label={`${key + 1}`} />
                </div>
              }
            />
          );
        })}
        {!disabled && (
          <div className="pt-add-owner-btn" onClick={() => handleAddUnit(floorId)} style={{ color: "#fe7a51", float: "right", cursor: "pointer" }}>
            <Label label="+" color="#fe7a51" containerStyle={{ marginRight: 5 }} />
            <Label label="PT_ADD_UNIT" color="#fe7a51" />
            <ToolTipUi id={"form-wizard-tooltip"} title={"PT_FLOOR_DETAILS_ADD_ONE_MORE_UNIT_INFO"} style={{ fontSize: 24 }} />
          </div>
        )}
      </div>
    );
  };

  render() {
    const { renderFloors } = this;
    const { floors } = this.state;
    const { noFloors } = this.props;
    return <div>{renderFloors(floors, noFloors)}</div>;
  }
}

const mapStateToProps = ({ form }) => {
  let { plotDetails } = form;
  let noFloors = parseInt(get(plotDetails, "fields.floorCount.value")) || 0;
  return { noFloors, form };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeForm: (formKey) => dispatch(removeForm(formKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorDetails);
