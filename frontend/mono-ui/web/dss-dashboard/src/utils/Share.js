import S3 from 'react-s3';
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image';
import shortenAPI from '../actions/shortenAPI';

const pdf = new jsPDF("p", "mm", "a1");
pdf.scaleFactor = 3;

export const handlePdfShareEmail = (pdf2) => {
    var ts = Math.round((new Date()).getTime() / 1000);

    let div = document.getElementById('divToPrint');
    domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
        .then(function (dataUrl) {
            var blobData = new Blob([pdf2.output('blob')], { type: 'application/pdf' })

            const config = {
              
            }
            blobData.name = "dss" + ts + ".pdf"
            S3
                .uploadFile(blobData, config)
                .then(data => {
                    shortenAPI(data.location,function(err,data){
                        // var fakeLink = document.createElement('a');
                        // fakeLink.setAttribute('href', 'mailto:?body=' + encodeURIComponent(data.data));
                        // fakeLink.click();
                        window.open(`mailto:?body=${encodeURIComponent(data.data)}`, "_blank");
                    });
                })
                .catch(err => console.error(err))
        }.bind(this))
}

export const handleImageShareEmail = (blobData) => {
    // var ts = Math.round((new Date()).getTime() / 1000);

    // let div = document.getElementById('divToPrint');
    // domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
    //     .then(function (dataUrl) {
    //         var blobData = dataURItoBlob(dataUrl);
    //         blobData.name = "dss" + ts + ".jpeg"

            const config = {
             
            }
            S3
                .uploadFile(blobData, config)
                .then(data => {
                    shortenAPI(data.location,function(err,data){
                        var fakeLink = document.createElement('a');
                        fakeLink.setAttribute('href', 'mailto:?body=' + encodeURIComponent(data.data));
                        fakeLink.setAttribute('target', '_blank');
                        fakeLink.click();
                    })
                })
                .catch(err => console.error(err))
        // }.bind(this))
}

export const handleWhatsAppImageShare = (blobData) => {
    // var ts = Math.round((new Date()).getTime() / 1000);

    // let div = document.getElementById('divToPrint');
    // domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
    //     .then(function (dataUrl) {
    //         var blobData = dataURItoBlob(dataUrl);
    // blobData.name = "dss" + ts + ".jpeg"

            const config = {
               
            }
            S3
                .uploadFile(blobData, config)
                .then(data => {
                    shortenAPI(data.location,function(err,data){
                        var fakeLink = document.createElement('a');
                        fakeLink.setAttribute('href', 'https://' + (isMobileOrTablet() ? 'api' : 'web') + '.whatsapp.com/send?text=' + encodeURIComponent(data.data));
                        fakeLink.setAttribute('data-action', 'share/whatsapp/share');
                        fakeLink.setAttribute('target', '_blank');
                        fakeLink.click();
                    })
                })
                .catch(err => console.error(err))
        // }.bind(this))
}

export const handleWhatsAppPdfShare = (pdf2) => {
    var ts = Math.round((new Date()).getTime() / 1000);

    let div = document.getElementById('divToPrint');
    domtoimage.toJpeg(div, { quality: 0.95, bgcolor: 'white' })
        .then(function (dataUrl) {
            var blobData = new Blob([pdf2.output('blob')], { type: 'application/pdf' })

            const config = {
               
            }
            blobData.name = "dss" + ts + ".pdf"
            S3
                .uploadFile(blobData, config)
                .then(data => {
                    shortenAPI(data.location,function(err,data){
                        var fakeLink = document.createElement('a');
                        fakeLink.setAttribute('href', 'https://' + (isMobileOrTablet() ? 'api' : 'web') + '.whatsapp.com/send?text=' + encodeURIComponent(data.data));
                        fakeLink.setAttribute('data-action', 'share/whatsapp/share');
                        fakeLink.setAttribute('target', '_blank');
                        fakeLink.click();
                    })
                })
                .catch(err => console.error(err))
        }.bind(this))
}

const isMobileOrTablet = () => {
    return (/(android|iphone|ipad|mobile)/i.test(navigator.userAgent));
}

const dataURItoBlob = (dataURI) => {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}