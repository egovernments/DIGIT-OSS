import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ImageIcon from '@material-ui/icons/Image';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import jsPDF from 'jspdf'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { APIStatus } from '../../actions/apiStatus'
import MenuIcon from '@material-ui/icons/MoreVert';
import FilterIcon from '@material-ui/icons/FilterList';
import Divider from '@material-ui/core/Divider';
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import SVG from 'react-inlinesvg';
import download from '../../images/download.svg';
import share from '../../images/share.svg';
import { renderToString, } from 'react-dom/server'
import FilterTable from '../Dashboard/download/filterTable';
import { downloadAsImage, printDocumentShare, printDocument } from '../../utils/block';
import DraftsIcon from '@material-ui/icons/Drafts';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import domtoimage from 'dom-to-image';
import Variables from '../../styles/variables'
import FileUploadAPI from '../../actions/fileUpload/fileUpload'
import APITransport from '../../actions/apitransport/apitransport'
import S3ImageAPI from '../../actions/s3Image/s3Image';
import constants from '../../actions/constants';
import shortenAPI from '../../actions/shortenAPI';
import removeImageExtension from '../../actions/removeImageExtension';
import getPDFHeaderDetails from '../../actions/getPDFHeaderDetails';

const pdf = new jsPDF("p", "mm", "a1");
pdf.scaleFactor = 3;

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
            horizontal: 'center',
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

class CustomizedMenus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false,
            shareOpen: false
        }

    }
    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget
        })
    };
    filterFunc = function (node) {
        if (node.id == 'divNotToPrint') return false;
        return true;
    };
    handleClick1 = event => {
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

    downloadImage = () => {
        this.props.APITrans(true)
        downloadAsImage(this.props.strings[this.props.fileName] || this.props.fileName).then(function (success) {
            this.props.APITrans(false)
        }.bind(this)).catch(function (err) {
            this.setState({
                anchorEl: null
            })

        }.bind(this))

    }

    renderTable = () => {
        return renderToString(<FilterTable data={this.props.GFilterData} name={this.props.fileHeader || "Dashboard"} />)
    }

    downloadPDF = () => {
        let pdfDetails = getPDFHeaderDetails(this.props.mdmsData);
        printDocument(pdfDetails.logo,pdfDetails.headerText, this.props.strings[this.props.fileName] || this.props.fileName || 'DSS').then(function (pdfO) {
            try {
                this.props.APITrans(false)
            } catch{ }
        }).catch(function (error) {
            this.setState({
                anchorEl: null
            })
        })
    }

    shareWhatsAppPDF() {
        this.setState({
            type: 'whatsapp'
        })
        var APITransport = this.props.APITransport
        let pdfDetails = getPDFHeaderDetails(this.props.mdmsData);
        printDocumentShare(pdfDetails.logo,pdfDetails.headerText).then(function (pdfO) {
            try {
                let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD_MOBILE, pdfO.output('blob'));
                APITransport(fileUploadAPI)
            } catch{ }
        }).catch(function (error) {
            this.setState({
                anchorEl: null
            })
        })
    }

    shareWhatsAppImage() {
        this.setState({
            type: 'whatsapp'
        })
        var ts = Math.round((new Date()).getTime() / 1000);
        var APITransport = this.props.APITransport

        let div = document.getElementById('divToPrint');
        domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white', filter: this.filterFunc })
            .then(function (dataUrl) {
                var blobData = this.dataURItoBlob(dataUrl);
                blobData.name = "dss" + ts + ".jpeg"

                try {
                    let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD_MOBILE, new File([blobData], blobData.name, { type: "image/jpeg" }));
                    APITransport(fileUploadAPI)
                } catch{ }
            }.bind(this))
    }

    shareEmailPDF() {
        this.setState({
            type: 'email'
        })
        var APITransport = this.props.APITransport
        let pdfDetails = getPDFHeaderDetails(this.props.mdmsData);
        printDocumentShare(pdfDetails.logo,pdfDetails.headerText).then(function (pdfO) {            
            try {
                let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD_MOBILE, pdfO.output('blob'));
                APITransport(fileUploadAPI)
            } catch{ }
        }).catch(function (error) {
            this.setState({
                anchorEl: null
            })
        })
    }

    shareEmailImage() {
        this.setState({
            type: 'email'
        })

        var ts = Math.round((new Date()).getTime() / 1000);
        let div = document.getElementById('divToPrint');
        var APITransport = this.props.APITransport

        domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white', filter: this.filterFunc })
            .then(function (dataUrl) {
                var blobData = this.dataURItoBlob(dataUrl);
                blobData.name = "dss" + ts + ".jpeg"

                try {
                    let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD_MOBILE, new File([blobData], blobData.name, { type: "image/jpeg" }));
                    APITransport(fileUploadAPI)
                } catch{ }
            }.bind(this))
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

    componentDidUpdate(prevProps) {
        if (prevProps.s3FileMobile != this.props.s3FileMobile) {
            const { S3Transporter } = this.props
            let s3ImageAPI = new S3ImageAPI(2000, 'dashboard', constants.S3_IMAGE_MOBILE, this.props.s3FileMobile.files && Array.isArray(this.props.s3FileMobile.files) && this.props.s3FileMobile.files.length > 0 && this.props.s3FileMobile.files[0] && this.props.s3FileMobile.files[0].fileStoreId);
            S3Transporter(s3ImageAPI)
        }

        if (prevProps.s3ImageMobile != this.props.s3ImageMobile) {
            let image = ''
            let fileId = this.props.s3FileMobile.files && Array.isArray(this.props.s3FileMobile.files) && this.props.s3FileMobile.files.length > 0 && this.props.s3FileMobile.files[0] && this.props.s3FileMobile.files[0].fileStoreId

            let file = this.props.s3ImageMobile && this.props.s3ImageMobile[fileId]

            if (file) {
                if ((file.match(new RegExp("https", "g")) || []).length > 1) {
                    var fileArr =  file.split(',');

                    if(fileArr && fileArr.length>0) {
                        image = removeImageExtension(fileArr);
                    }

                } else {
                    image = file
                }

                var fakeLink = document.createElement('a');
                var type = this.state.type;
                var isMobileOrTablet = this.isMobileOrTablet();
                 shortenAPI(image,function(err,data){
                    if(data){
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

    render() {
        return (
            <div style={{ paddingLeft: '10px' }}>
                <Button style={{ borderRadius: '2px', backgroundColor: this.props.bgColor, color: this.props.color }}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={this.handleClick}
                >
                    {this.props.type === 'filter' &&
                        <FilterIcon></FilterIcon>
                    }

                    {this.props.type === 'download' &&
                        <MenuIcon></MenuIcon>
                    }

                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >

                    <StyledMenuItem button onClick={this.handleClick1}>
                        <ListItemIcon style={{ width: '10px' }}>
                            <SVG src={download} style={{ marginRight: '10px' }}>
                            </SVG>
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_DOWNLOAD'] || 'DSS_DOWNLOAD'} />
                        {this.state.open ? <IconExpandLess /> : <IconExpandMore />}
                    </StyledMenuItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <Divider />
                        <List component="div" disablePadding>
                            <StyledMenuItem button onClick={this.downloadImage.bind(this)}>
                                <ListItemIcon>
                                    <ImageIcon style={{ color: '#ff0000' }} />
                                </ListItemIcon>
                                <ListItemText primary={this.props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                            </StyledMenuItem>
                            <StyledMenuItem button onClick={this.downloadPDF.bind(this)}>
                                <ListItemIcon>
                                    <PdfIcon style={{ color: '#ff0000' }} />
                                </ListItemIcon>
                                <ListItemText  primary={this.props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'}  />
                            </StyledMenuItem>
                        </List>
                    </Collapse>

                    <StyledMenuItem button onClick={this.handleClick2}>
                        <ListItemIcon style={{ margin: '0px', padding: '0px' }}>
                            <SVG src={share} style={{ marginRight: '10px' }}>

                            </SVG>
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_SHARE'] || 'DSS_SHARE'} />
                        {this.state.shareOpen ? <IconExpandLess /> : <IconExpandMore />}
                    </StyledMenuItem>
                    <Collapse in={this.state.shareOpen} timeout="auto" unmountOnExit>
                        <Divider />
                        <List component="div" disablePadding>
                            <StyledMenuItem button onClick={this.shareEmailPDF.bind(this)}>
                                <ListItemIcon>
                                    <DraftsIcon style={{ color: Variables.email }} />
                                </ListItemIcon>
                                <ListItemText primary={this.props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'} />
                            </StyledMenuItem>
                            <StyledMenuItem button onClick={this.shareEmailImage.bind(this)}>
                                <ListItemIcon>
                                    <DraftsIcon style={{ color: Variables.email }} />
                                </ListItemIcon>
                                <ListItemText primary={this.props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                            </StyledMenuItem>
                            <StyledMenuItem button onClick={this.shareWhatsAppPDF.bind(this)}>
                                <ListItemIcon>
                                    <WhatsappIcon style={{ color: Variables.whatsApp }} />
                                </ListItemIcon>
                                <ListItemText  primary={this.props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'}  />
                            </StyledMenuItem>
                            <StyledMenuItem button onClick={this.shareWhatsAppImage.bind(this)}>
                                <ListItemIcon>
                                    <WhatsappIcon style={{ color: Variables.whatsApp }} />
                                </ListItemIcon>
                                <ListItemText primary={this.props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                            </StyledMenuItem>

                        </List>
                    </Collapse>
                </StyledMenu>

            </div >
        );
    }
}

const mapStateToProps = state => ({
    GFilterData: state.GFilterData,
    s3FileMobile: state.s3FileMobile,
    s3ImageMobile: state.s3ImageMobile,
    mdmsData: state.mdmsData,
    strings: state.lang
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        APITrans: APIStatus,
        APITransport: APITransport,
        S3Transporter: APITransport
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomizedMenus);