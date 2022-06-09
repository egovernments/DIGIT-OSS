import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SVG from 'react-inlinesvg';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import share from '../../../images/share.svg';
import DraftsIcon from '@material-ui/icons/Drafts';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import { printDocumentShare } from '../../../utils/block';
import { renderToString, } from 'react-dom/server'
import FilterTable from '../download/filterTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { APIStatus } from '../../../actions/apiStatus'
import domtoimage from 'dom-to-image';
import Variables from '../../../styles/variables'
import FileUploadAPI from '../../../actions/fileUpload/fileUpload'
import APITransport from '../../../actions/apitransport/apitransport'
import S3ImageAPI from '../../../actions/s3Image/s3Image';
import constants from '../../../actions/constants';
import shortenAPI from '../../../actions/shortenAPI';
import removeImageExtension from '../../../actions/removeImageExtension';
import getPDFHeaderDetails from '../../../actions/getPDFHeaderDetails';

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

class CustomizedShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            //logo: this.props.mdmsData['tentantLogo'][`${localStorage.getItem('tenant-id')}`],
            //pdfHeader: this.props.mdmsData['tenantName'] +" "+ this.props.mdmsData['corpName']
            // logo: this.props.globalFilter[1]['tentantLogo']['pb.abohar']

        }

    }
    // const[anchorEl, setAnchorEl] = React.useState(null);


    // const [anchorEl_email, setAnchorEl_email] = React.useState(null);
    // const [anchorEl_pdf, setAnchorEl_pdf] = React.useState(null);

    handleClick = event => {
        // setAnchorEl(event.currentTarget);
        this.setState({
            anchorEl: event.currentTarget
        })
    };

    handleClose = () => {
        this.setState({
            anchorEl: null
        })
    };    
    renderTable = () => {
        return renderToString(<FilterTable data={this.props.GFilterData} name={this.props.fileHeader || "Dashboard"} />)
    }
    filterFunc = function (node) {
        if (node.id === 'divNotToPrint') return false;
        return true;
    };

    dataURItoBlob = (dataURI) => {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    }

    shareWhatsAppPDF() {
        this.setState({
            type: 'whatsapp'
        })
        var APITransport = this.props.APITransport
        var ts = Math.round((new Date()).getTime() / 1000);
        let pdfDetails = getPDFHeaderDetails(this.props.mdmsData);
        printDocumentShare(pdfDetails.logo,pdfDetails.headerText).then(function (pdfO) {
            // setAnchorEl(null);
            let blobFile = pdfO.output('blob')
            blobFile.name = 'dss' + ts + '.pdf'
            try {
                let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD, new File([blobFile], blobFile.name, { type: "application/pdf" }));
                APITransport(fileUploadAPI)
            } catch{ }
        }).catch(function (error) {
            this.setState({
                anchorEl: null
            })
        })
    }

    shareWhatsAppImage = () => {
        this.setState({
            type: 'whatsapp'
        })
        var ts = Math.round((new Date()).getTime() / 1000);
        var APITransport = this.props.APITransport

        let div = document.getElementById('divToPrint');
        domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white', filter: this.filterFunc })
            .then(function (dataUrl) {
                var blobData = this.dataURItoBlob(dataUrl);
                blobData.name = "dss" + ts + ".jpeg";
                try {
                    let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD, new File([blobData], blobData.name, { type: "image/jpeg" }));
                    APITransport(fileUploadAPI)
                } catch{ }
            }.bind(this))

    }

    shareEmailPDF = () => {
        this.setState({
            type: 'email'
        })
        var APITransport = this.props.APITransport
        let pdfDetails = getPDFHeaderDetails(this.props.mdmsData);
        printDocumentShare(pdfDetails.logo,pdfDetails.headerText).then(function (pdfO) {
            // setAnchorEl(null);
            var ts = Math.round((new Date()).getTime() / 1000);
            let blobFile = pdfO.output('blob')
            blobFile.name = 'dss' + ts + '.pdf'
            try {
                let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD, new File([blobFile], blobFile.name, { type: "application/pdf" }));
                APITransport(fileUploadAPI)
            } catch{ }
        }).catch(function (error) {
            this.setState({
                anchorEl: null
            })
        })
    }


    shareEmailImage = () => {
        this.setState({
            type: 'email'
        })

        var ts = Math.round((new Date()).getTime() / 1000);
        let div = document.getElementById('divToPrint');
        var APITransport = this.props.APITransport

        domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white', filter: this.filterFunc })
            .then(function (dataUrl) {
                var blobData = this.dataURItoBlob(dataUrl);
                blobData.name = "dss" + ts + ".jpeg";
                try {
                    let fileUploadAPI = new FileUploadAPI(2000, 'dashboard', constants.FILE_UPLOAD, new File([blobData], blobData.name, { type: "image/jpeg" }));
                    APITransport(fileUploadAPI)
                } catch{ }
            }.bind(this))
    }

    isMobileOrTablet = () => {
        return (/(android|iphone|ipad|mobile)/i.test(navigator.userAgent));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.s3File !== this.props.s3File) {
            const { S3Transporter } = this.props
            let s3ImageAPI = new S3ImageAPI(2000, 'dashboard', constants.S3_IMAGE, this.props.s3File.files && Array.isArray(this.props.s3File.files) && this.props.s3File.files.length > 0 && this.props.s3File.files[0] && this.props.s3File.files[0].fileStoreId);
            S3Transporter(s3ImageAPI)
        }

        if (prevProps.s3Image !== this.props.s3Image) {
            let image = ''
            let fileId = this.props.s3File.files && Array.isArray(this.props.s3File.files) && this.props.s3File.files.length > 0 && this.props.s3File.files[0] && this.props.s3File.files[0].fileStoreId

            // let file = this.props.s3Image && this.props.s3Image.fileStoreIds && Array.isArray(this.props.s3Image.fileStoreIds) && this.props.s3Image.fileStoreIds.length > 0 && this.props.s3Image.fileStoreIds[0].url
            let file = this.props.s3Image && this.props.s3Image[fileId]
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
                        fakeLink.setAttribute('href', 'https://' + ( isMobileOrTablet ? 'api' : 'web') + '.whatsapp.com/send?text=' + encodeURIComponent(image));
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

    renderSharePDFMenue = (menue) => {
        return (
            <div >
                <Button style={{ borderRadius: '2px', border: 'solid 1px #5b5b5b', backgroundColor: "rgba(255, 255, 255, 0)" }}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    // color="primary"
                    onClick={this.handleClick.bind(this)}
                >
                    
                    {this.props.strings['DSS_SHARE'] || 'DSS_SHARE'}
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose.bind(this)}
                >
                    <StyledMenuItem onClick={this.shareEmailPDF.bind(this)}>
                        <ListItemIcon>
                            <DraftsIcon fontSize="small" style={{ color: Variables.email }} />
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'} />
                    </StyledMenuItem>
                    {/* <StyledMenuItem onClick={this.shareEmailImage.bind(this)}>
                        <ListItemIcon>
                            <DraftsIcon fontSize="small" style={{ color: Variables.email }} />
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                    </StyledMenuItem> */}
                    <StyledMenuItem onClick={this.shareWhatsAppPDF.bind(this)}>
                        <ListItemIcon>
                            <WhatsappIcon fontSize="small" style={{ color: Variables.whatsApp }} />
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'} />
                    </StyledMenuItem>
                    {/* <StyledMenuItem onClick={this.shareWhatsAppImage.bind(this)}>
                        <ListItemIcon>
                            <WhatsappIcon fontSize="small" style={{ color: Variables.whatsApp }} />
                        </ListItemIcon>
                        <ListItemText primary={this.props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                    </StyledMenuItem> */}
                </StyledMenu>
            </div>
        )
    }
    render() {

        return (
            <div>
                <Button
                    style={{ marginLeft: '20px', borderRadius: '2px', border: 'solid 1px #5b5b5b', backgroundColor: "rgba(255, 255, 255, 0)", height: '32px' }}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    // color="primary"
                    onClick={this.handleClick.bind(this)}
                >
                    <SVG src={share} style={{ marginRight: '10px' }} >
                        {/* className={StyledMenuItem.CloseButton} */}
                    </SVG>
                    <div style={{ fontFamily: 'Roboto', fontSize: '12px', fontWeight: '500', fontStretch: 'normal', fontStyle: 'normal', linHeight: 'normal', letterSpacing: 'normal', color: '#5b5b5b' }}>{this.props.strings['DSS_SHARE'] || 'DSS_SHARE'}</div>
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose.bind(this)}
                >
                    <StyledMenuItem>

                        {this.renderSharePDFMenue()}

                    </StyledMenuItem>

                </StyledMenu>
            </div >
        );
    }

}

const mapStateToProps = state => ({
    GFilterData: state.GFilterData,
    s3File: state.s3File,
    s3Image: state.s3Image,
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
)(CustomizedShare);