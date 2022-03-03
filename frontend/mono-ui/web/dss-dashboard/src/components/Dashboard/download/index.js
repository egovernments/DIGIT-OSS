import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SVG from 'react-inlinesvg';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import download from '../../../images/download.svg';
import FilterTable from './filterTable';
import ImageIcon from '@material-ui/icons/Image';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import jsPDF from 'jspdf'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { APIStatus } from '../../../actions/apiStatus'
import { downloadAsImage, printDocument } from '../../../utils/block';
import getPDFHeaderDetails from '../../../actions/getPDFHeaderDetails';


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
    // CloseButton: {
    //     display: 'flex'
    // }
}))(MenuItem);





export function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const downloadImage = () => {
        props.APITrans(true)
        downloadAsImage(props.strings[props.fileName] || props.fileName || 'dashboard').then(function (success) {
            props.APITrans(false);
            setAnchorEl(null);
        }.bind(this)).catch(function (err) {
            setAnchorEl(null);
        }.bind(this))

    }
    const renderTable = () => {
        return renderToString(<FilterTable data={props.GFilterData} name= {props.fileHeader || "Dashboard"} />)
    }

    const downloadPDF = () => {
        props.APITrans(true);        
        let pdfDetails = getPDFHeaderDetails(props.mdmsData);
        printDocument(pdfDetails.logo,pdfDetails.headerText, props.strings[props.fileName] || props.fileName || 'DSS').then(function (pdfO) {
            // let element = document.getElementById("printFtable")
            // element.parentNode.removeChild(element);
            setAnchorEl(null);
            // pdfO.save();

            try {
                // pdf.deletePage(3)
                // pdf.deletePage(2)
                // pdf.deletePage(1)
                // pdf.addPage();
            props.APITrans(false);

            } catch{ }
        }.bind(this)).catch(function (error) {
            setAnchorEl(null);
        }.bind(this))

    }
    return (        
        <div>
            <Button style={{ borderRadius: '2px', border: 'solid 1px #5b5b5b', backgroundColor: "rgba(255, 255, 255, 0)", height: '32px' }}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                // color="primary"
                onClick={handleClick}
            >
                <SVG src={download} style={{ marginRight: '10px' }} className={StyledMenuItem.CloseButton}>

                </SVG>
                <div style={{ fontFamily: 'Roboto', fontSize: '12px', fontWeight: '500', fontStretch: 'normal', fontStyle: 'normal', linHeight: 'normal', letterSpacing: 'normal', color: '#5b5b5b' }}>{props.strings['DSS_DOWNLOAD'] || 'DSS_DOWNLOAD'}</div>


            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={downloadPDF.bind(this)}>
                    <ListItemIcon>
                        <PdfIcon style={{color: '#ff0000'}}/>
                    </ListItemIcon>
                    <ListItemText  primary={props.strings['DSS_DOWNLOAD_PDF'] || 'DSS_DOWNLOAD_PDF'}  />
                </StyledMenuItem>
                <StyledMenuItem onClick={downloadImage.bind(this)}>
                    <ListItemIcon>
                        <ImageIcon style={{color: '#ff0000'}}/>
                    </ListItemIcon>
                    <ListItemText primary={props.strings['DSS_DOWNLOAD_IMAGE'] || 'DSS_DOWNLOAD_IMAGE'} />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
}


const mapStateToProps = state => ({
    GFilterData: state.GFilterData,
    mdmsData: state.mdmsData,
    strings: state.lang
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        APITrans: APIStatus,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomizedMenus);