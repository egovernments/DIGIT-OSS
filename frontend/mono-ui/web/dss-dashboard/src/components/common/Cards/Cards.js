import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { CardStyle as style } from './CardStyles';
import CardHeader from '@material-ui/core/CardHeader'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';
import variables from '../../../styles/variables';
import CustomInfo from '../CustomInfo';

const cardStyle = {
  backgroundColor: variables.widget_background,
  height: 'auto',
  margin: '12px 12px 12px 12px !important',
  width: '100%'
}

class Cards extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { strings } = this.props;
    const { classes, needInfo, id, title, fullW, noUnit } = this.props;
    let newClass = fullW ? classes.full : classes.redused;

    return (
      <Card id={'card' + id} style={this.props.cardStyle || cardStyle} classes={{ root: newClass }}>
        <div className={classes.headRoot}>
          {title && <CardHeader classes={{ title: classes.title, root: classes.cardheader }} title={(strings[title] || title) + (!noUnit ? '' : (' (In ' + this.props.GFilterData['Denomination'] + ')'))}
            action={
              <div style={{ paddingLeft: '4px' }}>
                <Tooltip title={strings[`TIP_${title}`] || `TIP_${title}`} classes={{ tooltip: classes.lightTooltip }} placement="top">
                  <InfoIcon style={{ color: '#96989a', verticalAlign: '-webkit-baseline-middle', paddingTop: '3px' }} />
                </Tooltip>
              </div>
            }
          >

          </CardHeader>
          }
          {needInfo && <div className={[classes.actionMenues, classes.fullw].join(' ')}><CustomInfo data={this.props} /></div>}
        </div>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography component="div">
            {this.props.children}
          </Typography>
        </CardContent>
        {/* <CardActions className={classes.actions}>
          {needInfo && this.renderMenues()}
        </CardActions> */}
      </Card>
    )

  }
}

Cards.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    GFilterData: state.GFilterData,
    strings: state.lang,
    s3FileCard: state.s3FileCard,
    s3ImageCard: state.s3ImageCard,

  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({  

  }, dispatch)
}

export default withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(Cards)));