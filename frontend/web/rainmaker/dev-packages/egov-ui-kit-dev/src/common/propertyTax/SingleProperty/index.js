import React from "react";
import Label from "../../../utils/translationNode";
import Card from "../../../components/Card";
import Grid from "@material-ui/core/Grid";
import "./index.css";

class SingleProperty extends React.Component {
  onCardClick = (item) => {
    const { route: propertyId, tenantId } = item;
    this.props.history.push(`/property-tax/my-properties/property/${encodeURIComponent(propertyId)}/${tenantId}`);
  };

  render() {
    const { data, action, onActionClick } = this.props;
    return (
      data &&
      data.map((item) => {
        return (
          <Card
            id="pt-application-card"
            className="pt-application-card"
            textChildren={
              <div>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_PTUID" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                    {/* <Label label={item.propertyId} fontSize={14} color={"rgba(0, 0, 0, 0.87"} /> */}
                    {item.propertyId}
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_OWNERNAME" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Label label={item.name} fontSize={14} color={"rgba(0, 0, 0, 0.87"} />
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_GUARDIANNAME" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Label label={item.guardianName} fontSize={14} color={"rgba(0, 0, 0, 0.87"} />
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_EPID" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Label label={item.oldPropertyId ? item.oldPropertyId : "NA"} fontSize={14} color={"rgba(0, 0, 0, 0.87"} />
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_ADDRESS" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Label label={item.address} fontSize={14} color={"rgba(0, 0, 0, 0.87"} />
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 12 }}>
                  <Grid item xs={6}>
                    <Label label="PT_SEARCHPROPERTY_TABEL_STATUS" fontSize={14} color={"rgba(0, 0, 0, 0.60"} />
                  </Grid>
                  <Grid item xs={6}>
                  <Label label={item.status} fontSize={14} color={"rgba(0, 0, 0, 0.87"} />
                  </Grid>
                </Grid>
                
{/*                
                <div onClick={onActionClick ? onActionClick : () => this.onCardClick(item)}>
                  <Label label={action} textTransform={"uppercase"} color="#fe7a51" fontSize={14} labelStyle={{ textTransform: "uppercase" }} />
                </div> */}
              </div>
            }
          />
        );
      })
    );
  }
}

export default SingleProperty;
