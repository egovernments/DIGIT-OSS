import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";
import CloudDownloadSharp from '@material-ui/icons/CloudDownloadSharp';
import DraftsIcon from '@material-ui/icons/Drafts';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import domtoimage from 'dom-to-image';
import PropTypes from "prop-types";
import React from "react";
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { APIStatus } from '../../../actions/apiStatus';
import APITransport from '../../../actions/apitransport/apitransport';
import constants from '../../../actions/constants';
import FileUploadAPI from '../../../actions/fileUpload/fileUpload';
import removeImageExtension from '../../../actions/removeImageExtension';
import S3ImageAPI from '../../../actions/s3Image/s3Image';
import shortenAPI from '../../../actions/shortenAPI';
import share from '../../../images/share.svg';
import Variables from '../../../styles/variables';
import ActionButtons from '../inputs/ActionButtons';


const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing(20)
  },
  panelDetail: {
    display: "initial !important",
    padding: "0px !important"
  }
});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    PaperProps={{
      style: {
        left: '100%',
      }
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: '#fff',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#5b5b5b',
      },
    },
  },
}))(MenuItem);

class CustomInfo extends React.Component {
  constructor(props) {
    super(props);
    this.clickEvent = this.clickEvent.bind(this);
    this.state = {
      anchorEl: null,
      open: false,
    }
    this.instance = this;
  }
  clickEvent(event) {
    if (typeof this.props.cardClick === 'function') {
      this.props.cardClick('ALL', event);
    }
  }
  handleClick = (value, target, event) => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  downloadAsImage = (id, title) => {
    let { strings } = this.props;
    let div = document.getElementById('card' + id);
    this.props.APITrans(true)
    domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = (strings[title] || title) || 'image.jpeg';
        link.href = dataUrl;
        link.click();
        this.setState({ anchorEl: null });
        this.props.APITrans(false)
      }.bind(this))
  }

  shareAsImage = (shareType, id) => {
    let { strings, title } = this.props;
    let div = document.getElementById('card' + id);
    var ts = Math.round((new Date()).getTime() / 1000);
    var APITransport = this.props.APITransport

    this.setState({
      type: shareType,
      cardId: id
    })

    domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
      .then(function (dataUrl) {
        var blobData = this.dataURItoBlob(dataUrl);
        blobData.name = (strings[title] || 'image') + ts + ".jpeg"

        try {
          let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD_CARD, new File([blobData], blobData.name, { type: "image/jpeg" }));
          APITransport(fileUploadAPI)
        } catch { }
      }.bind(this))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.s3FileCard !== this.props.s3FileCard && this.state.cardId) {
      const { S3Trans } = this.props
      let s3ImageAPI = new S3ImageAPI(2000, 'dashboard', constants.S3_IMAGE_CARD, this.props.s3FileCard.files && Array.isArray(this.props.s3FileCard.files) && this.props.s3FileCard.files.length > 0 && this.props.s3FileCard.files[0] && this.props.s3FileCard.files[0].fileStoreId);
      S3Trans(s3ImageAPI)
      this.setState({
        openWhatsapp: true,
        cardId: null
      })
    }

    if (prevProps.s3ImageCard !== this.props.s3ImageCard) {
      if (this.state.openWhatsapp) {
        this.setState({
          openWhatsapp: false
        })
        let image = ''
        let fileId = this.props.s3FileCard.files && Array.isArray(this.props.s3FileCard.files) && this.props.s3FileCard.files.length > 0 && this.props.s3FileCard.files[0] && this.props.s3FileCard.files[0].fileStoreId

        let file = this.props.s3ImageCard && this.props.s3ImageCard[fileId]
        if (file) {
          if ((file.match(new RegExp("https", "g")) || []).length > 1) {
            var fileArr = file.split(',');
            if (fileArr && fileArr.length > 0) {
              image = removeImageExtension(fileArr);
            }

          } else {
            image = file
          }
          this.setState({ anchorEl: null });
          var type = this.state.type;
          var isMobileOrTablet = this.isMobileOrTablet();
          var fakeLink = document.createElement('a');
          shortenAPI(image, function (err, data) {
            if (data) {
              image = data.data;
            }
            if (image && type === 'whatsapp') {
              fakeLink.setAttribute('href', 'https://' + (isMobileOrTablet ? 'api' : 'web') + '.whatsapp.com/send?text=' + encodeURIComponent(image));
              fakeLink.setAttribute('data-action', 'share/whatsapp/share');
              fakeLink.setAttribute('target', '_blank');
              fakeLink.click();
            }
            if (image && type === 'email') {
                                  window.open(`mailto:?body=${encodeURIComponent(image)}`, "_blank");

            }
          })
        }

      }

    }

  }

  isMobileOrTablet = () => {
    return (/(android|iphone|ipad|mobile)/i.test(navigator.userAgent));
  }

  dataURItoBlob = (dataURI) => {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  handleMenuClick = event => {
    this.setState({
      open: !this.state.open
    })
  };

  handleClick2 = event => {
    this.setState({
      shareOpen: !this.state.shareOpen
    })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    })
  };
  renderMenues(id, title) {
    const { classes } = this.props;
    let { strings } = this.props;
    return (<div className={[classes.actionMenues, classes.fullw].join(' ')}>
      <ActionButtons text={strings["DSS_MORE_ACTIONS"] || "DSS_MORE_ACTIONS"} handleClick={this.handleClick} buttonType="info" target="info"></ActionButtons>

      <StyledMenu
        id="customized-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={Boolean(this.state.anchorEl)}
        onClose={this.handleClose}
      >

        <StyledMenuItem button onClick={() => this.downloadAsImage(id, title)}>
          <ListItemIcon className={classes.itemIcon}>
            <CloudDownloadSharp />
          </ListItemIcon>
          <ListItemText primary={strings["DSS_IMAGE"] || "DSS_IMAGE"} />
        </StyledMenuItem>


        <StyledMenuItem button onClick={this.handleMenuClick}>
          <ListItemIcon className={classes.itemIcon}>
            <SVG src={share} style={{ marginRight: '10px' }} >
            </SVG>
          </ListItemIcon>
          <ListItemText primary={strings["DSS_MOBILE_SHARE"] || "Share"} />
          {this.state.open ? <IconExpandLess /> : <IconExpandMore />}
        </StyledMenuItem>

        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <Divider />
          <List component="div" disablePadding>
            <StyledMenuItem button onClick={() => this.shareAsImage('email', id, title)}>
              <ListItemIcon>
                <DraftsIcon style={{ color: Variables.email }} />
              </ListItemIcon>
              <ListItemText primary={strings["DSS_MOBILE_IMAGE"] || "DSS_MOBILE_IMAGE"}/>
            </StyledMenuItem>
            <StyledMenuItem button onClick={() => this.shareAsImage('whatsapp', id, title)}>
              <ListItemIcon>
                <WhatsappIcon style={{ color: Variables.whatsApp }} />
              </ListItemIcon>
              <ListItemText  primary={strings["DSS_MOBILE_IMAGE"] || "DSS_MOBILE_IMAGE"}/>
            </StyledMenuItem>
          </List>
        </Collapse>
      </StyledMenu>
    </div>)
  }

  render() {
    let { data } = this.props;
    return (
      <div style={{ padding: '0px 7px' }}>
        {this.renderMenues(data.id, data.name)}
      </div>
    );
  }
}

CustomInfo.propTypes = {
  classes: PropTypes.object.isRequired
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
    APITrans: APIStatus,
    APITransport: APITransport,
    S3Trans: APITransport

  }, dispatch)
}
export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CustomInfo)));
