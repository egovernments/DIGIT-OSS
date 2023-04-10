import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { ifUserRoleExists } from "egov-common/ui-config/screens/specs/utils";
import { isPublicSearch } from "egov-ui-framework/ui-utils/commons";


const roleExists = ifUserRoleExists("CITIZEN");

const styles = {
  card: {
    backgroundColor: "rgb(242, 242, 242)",
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCard: {
    padding: 18,
    marginTop: 24,
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCardText: {
    padding: 8,
    color: "rgba(0, 0, 0, 0.6000000238418579)",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.65
  },
  toolTipIcon: {
    color: "rgba(0, 0, 0, 0.3799999952316284)",
    paddingLeft: 5,
    position: "relative",
    top: -2
  },
  bigheader: {
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "34px",
    fontWeight: 500,
    letterSpacing: "1.42px",
    lineHeight: "41px"
  },
  taxStyles: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "17px",
    letterSpacing: 0.67,
    fontFamily: "Roboto",
    marginBottom: 16
  },
  taxStylesLeft: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "17px",
    letterSpacing: 0.58,
    fontFamily: "Roboto",
    marginBottom: 16
  },
  cardHeader: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "18px",
    fontWeight: 400,
    letterSpacing: "0.75px",
    lineHeight: "22px",
    textAlign: "left"
  },
  message:{
    marginTop: "30px !important",
    marginBottom: "20px !important",
  }
};

function totalAmount(arr) {
  return arr
    .map(item => (item.value ? item.value : 0))
    .reduce((prev, next) => prev + next, 0);
}

function FeesEstimateCard(props) {
  let { classes, estimate, businesService } = props;

  const total = estimate.totalAmount;
  const arrears = estimate.arrears;
  const totalHeadClassName = "tl-total-amount-value " + classes.bigheader;

 
  if (estimate.fees&&estimate.fees.length>0&&estimate.fees[estimate.fees.length-1].info.labelName!="Arrears") {
    estimate.fees.push({
      info: {
        labelKey: "COMMON_ARREARS",
        labelName: "Arrears"
      },
      name: {
        labelKey: "COMMON_ARREARS",
        labelName: "Arrears"
      },
      value: arrears
    });
  }
  function getNameFromTax(name)
  {
    
    if(name=='PT_TAX'){
      let fy=" ("+getCurrentFinancialYear()+")"
    return getLocaleLabels(name,name)+fy;}
    else 
    return getLocaleLabels(name,name)
  }
  var getCurrentFinancialYear = function getCurrentFinancialYear() {
    var today = new Date();
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if (curMonth >= 3) {
      var nextYr1 = (today.getFullYear() + 1).toString();
      fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
    } else {
      var nextYr2 = today.getFullYear().toString();
      fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
    }
    return fiscalYr;
  };

  
  if(estimate.businesService==='PT')
    {
    for (let i=0;i<estimate.fees.length;i++)
      {
          if(estimate.fees[i].name.labelKey===getLocaleLabels("PT_TAX","PT_TAX"))
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_TAX';
          }
          if(estimate.fees[i].name.labelKey==='PT_TIME_INTEREST')
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_TIME_INTEREST';
          }
          if(estimate.fees[i].name.labelKey==='COMMON_ARREARS')
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_ARREARS';
          }
          if(estimate.fees[i].name.labelKey==='SWATCHATHA_TAX')
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_SWATCHATHA_TAX';
          }
          if(estimate.fees[i].name.labelKey==='PT_TIME_REBATE')
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_TIME_REBATE';
          }
          if(estimate.fees[i].name.labelKey==='PT_PROMOTIONAL_REBATE')
          {
            estimate.fees[i].name.labelKey='PT_COMMON_PAY_PROMOTIONAL_REBATE';
          }
      }
    } 

  return (
    <Grid container>
      <Grid xs={12} sm={7}>
        <LabelContainer
          labelName={estimate.header.labelName}
          labelKey={estimate.header.labelKey}
          style={styles.cardHeader}
        />
        <div style={{ marginTop: 48, maxWidth: 400 }}>
          <Grid container>
            {estimate.fees.map((fee, key) => {
              // let tooltip = fee.info ? (
              //   <Tooltip title={<LabelContainer
              //     labelName={fee.info.labelName}
              //     labelKey={fee.info.labelName}
              //   />}>
              //     <Icon className={classes.toolTipIcon}>
              //       <i class="material-icons" style={{ fontSize: 18 }}>
              //         info_circle
              //       </i>
              //     </Icon>
              //   </Tooltip>
              // ) : (
              //     ""
              //   );
              
              let textLeft = fee.name ? (
                <Grid container xs={8}>
                  <LabelContainer
                    labelName={fee.name.labelName}
                    labelKey={getNameFromTax(fee.name.labelKey)}
                    style={styles.taxStylesLeft}
                  />
                  {/*tooltip*/}                 
                </Grid> 
              ) : (
                  <Grid xs={8} />
                );
              let textRight = fee.value ? (
                <Grid xs={4} align="right">
                  <LabelContainer
                    labelName={fee.value}
                    labelKey={fee.value}
                    style={styles.taxStyles}
                  />
                </Grid>
              ) : (
                  <Grid xs={4} align="right">
                    <LabelContainer
                      labelName={0}
                      labelKey={0}
                      style={styles.taxStyles}
                    />
                  </Grid>
                );
              return (
                <Grid key={key} container>
                  {textLeft}
                  {textRight}                 
                </Grid>
              );
            })}
          </Grid>
          <Divider style={{ marginBottom: 16 }} />        
          <Grid container>
            <Grid item xs={6}>           
              <Typography variant="body2">
                <LabelContainer
                  labelName="Total Amount"
                  labelKey="TL_COMMON_TOTAL_AMT"
                />
              </Typography>            
            </Grid>
            <Grid
              item
              xs={6}
              align="right"
              style={{ paddingRight: 0 }}
              className="tl-application-table-total-value"
            >
              <Typography variant="body2">{total}</Typography>            

            </Grid>

          </Grid>
  
              
        </div>
        { ((roleExists && estimate.businesService === 'PT') || isPublicSearch())? 
                (  <Grid item xs={12} className={classes.message} >
                
              <Typography variant="body2">  <LabelContainer
                    labelName="If the amount seems to be incorrect, please reach out to the <contact no> or <email id>"
                    labelKey="pt.amount.message"
                    dynamicArray={[estimate.contactNumber, estimate.email]}
                  /></Typography>
                  <br></br>
                  <Typography variant="body2">  <LabelContainer
                    labelName="There might be an issue with PNB Bank cards, please use an alternative if possible."
                    labelKey="NOC_PAYMENT_CAP_PMT_DISCLAIMER"
                  /></Typography>
                 
                
            </Grid> ):"" }             

      </Grid>
      <Grid xs={12} sm={5}>
        <Typography
          variant="body2"
          align="right"
          className="tl-total-amount-text"
        >
          <LabelContainer
            labelName="Total Amount"
            labelKey="TL_COMMON_TOTAL_AMT"
          />
        </Typography>
        <Typography className={totalHeadClassName} align="right">
          &#8377; {total}
        </Typography>
       
        {estimate.extra && estimate.extra.length !== 0 ? (
          <Card className={classes.whiteCard}>
            {estimate.extra.map((item, key) => {
              let textLeft, textRight;
              let colLeft = item.textRight ? 6 : 12;
              let colRight = item.textLeft ? 6 : 12;
              if (item.textLeft) {
                textLeft = (
                  <Grid xs={colLeft}>
                    <Typography>{item.textLeft}</Typography>                   
                  </Grid>
                );
              } else {
                textLeft = <Grid xs={colLeft} />;
              }
              if (item.textRight) {
                textRight = (
                  <Grid xs={colRight}>
                    <Typography>{item.textRight}</Typography>
                  </Grid>
                );
              } else {
                textRight = <Grid xs={colRight} />;
              }
              return (
                <Grid container>
                  {textLeft}
                  {textRight}                                  
                </Grid>
              );
            })}
          </Card>
        ) : null}
      </Grid>
    </Grid>
  );
}

// FeesEstimateCard.propTypes = {
//   header: PropTypes.string.isRequired,
//   fees: PropTypes.array.isRequired,
//   extra: PropTypes.array.isRequired
// };

export default withStyles(styles)(FeesEstimateCard);
