import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import XLSX from "xlsx";
import domtoimage from "dom-to-image";

const changeClasses=(class1,class2)=>{
  var elements = document.getElementsByClassName(class1)
  Array.prototype.map.call(elements, function(testElement){
    testElement.classList.add(class2);
    testElement.classList.remove(class1);
  });
}

const revertCss=()=>{
  changeClasses("dss-white-pre-temp",'dss-white-pre-line');
}

const applyCss=()=>{
  changeClasses('dss-white-pre-line',"dss-white-pre-temp");
}

const Download = {
  Image: (node, fileName, share, resolve = null) => {
    const saveAs = (uri, filename) => {
      const link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    };

    const element = ReactDOM.findDOMNode(node.current);
    html2canvas(element, {
      scrollY: -window.scrollY,
      scrollX: 0,
      useCORS: true,
      scale: 1.5,
    }).then((canvas) => {
      return share
        ? canvas.toBlob((blob) => resolve(new File([blob], `${fileName}.jpeg`, { type: "image/jpeg" })), "image/jpeg", 1)
        : saveAs(canvas.toDataURL("image/jpeg", 1), `${fileName}.jpeg`);
    });
  },

  Excel: (data, filename) => {
    const file = filename.substring(0,30);
    const wb = XLSX.utils.book_new();
    let ws = null;
    ws = XLSX.utils.json_to_sheet(data)
    wb.SheetNames.push(file);
    wb.Sheets[file] = ws;
    XLSX.writeFile(wb, `${file}.xlsx`);
  },

  PDF: (node, fileName, share, resolve = null) => {
    const saveAs = (uri, filename) => {
      if(window.mSewaApp && window.mSewaApp.isMsewaApp()){
        window.mSewaApp.downloadBase64File(uri, filename);
      }
      const link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    };
    const dataURItoBlob = (dataURI) => {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    };
        changeClasses('dss-white-pre-line',"dss-white-pre-temp");

  applyCss();
    const element = ReactDOM.findDOMNode(node.current);


    return domtoimage.toJpeg(element, {
      quality: 1,
      bgcolor: 'white',
      filter:node=>!node?.className?.includes?.("divToBeHidden"),
      style:{
        margin:'25px'
      }
     }).then(function (dataUrl) {
/*  to enable pdf
    var htmlImage = new Image();
      htmlImage.src = dataUrl;
      var pdf = new jsPDF( 'l', 'pt', [element.offsetWidth, element.offsetHeight] );
      pdf.setFontStyle?.("Bold");
      pdf.setFontSize?.(30);
      pdf.text?.(325, 40, 'Certificate');
      // e(imageData, format, x, y, width, height, alias, compression, rotation)
      pdf.addImage?.( htmlImage, 25, 50, 50, element.offsetWidth, element.offsetHeight );
      pdf.save?.( fileName +'.pdf' );
      */
            changeClasses("dss-white-pre-temp",'dss-white-pre-line');

     revertCss();
     var blobData = dataURItoBlob(dataUrl);
       revertCss();
       return share
       ? resolve(new File([blobData], `${fileName}.jpeg`, { type: "image/jpeg" }))
       : saveAs(dataUrl, `${fileName}.jpeg`)
        });
    

        /*
    const getPDF = (canvas) => {
      const width = canvas.width;
      const height = canvas.height;
      const o = width > height ? "l" : "p";
      const format = "a4";

      return new jsPDF(o, "mm", format);
    };

    const element = ReactDOM.findDOMNode(node.current);
    return html2canvas(element, {
      scrollY: -window.scrollY,
      scrollX: 0,
      useCORS: true,
      scale: 1.5,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }).then((canvas) => {
      const pdf = getPDF(canvas);
      const jpegImage = canvas.toDataURL("image/jpeg");
      const imgProps = pdf.getImageProperties(jpegImage);
      const margin = 0.1;
      const pageHeight = 295;
      // const pdfWidth = pdf.internal.pageSize.width * (1 - margin);
      const pdfWidth = (imgProps.width * pageHeight) / (imgProps.height * 1.2)
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const x = (pdf.internal.pageSize.width - pdfWidth) / 2;
      let position = 5;
      // let heightLeft = pdfHeight;
      pdf.addImage(jpegImage, "JPEG", x, position, pdfWidth, pdfHeight, "a", "FAST");
      // heightLeft -= pageHeight;
      // while (heightLeft > 0) {
      //   position += heightLeft - pdfHeight;
      //   pdf.addPage();
      //   pdf.addImage(jpegImage, "JPEG", x, position, pdfWidth, pdfHeight, "a", "FAST");
      //   heightLeft -= pageHeight;
      // }
      return share ? new File([pdf.output("blob")], `${fileName}.pdf`, { type: "application/pdf" }) : pdf.save(`${fileName}.pdf`);
    });
    */
  },

  IndividualChartImage: (node, fileName, share, resolve = null) => {
    const saveAs = (uri, filename) => {
      if(window.mSewaApp && window.mSewaApp.isMsewaApp()){
        window.mSewaApp.downloadBase64File(uri, filename);
      }
      const link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    };
    const dataURItoBlob = (dataURI) => {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    };
    changeClasses('dss-white-pre-line',"dss-white-pre-temp");
    const element = ReactDOM.findDOMNode(node.current);
    return domtoimage.toJpeg(element, {
      quality: 1,
      bgcolor: 'white'
     }).then(function (dataUrl) {
       var blobData = dataURItoBlob(dataUrl);
      changeClasses("dss-white-pre-temp",'dss-white-pre-line');
       return share
       ? resolve(new File([blobData], `${fileName}.jpeg`, { type: "image/jpeg" }))
       : saveAs(dataUrl, `${fileName}.jpeg`)
        });
    
  },
};
export default Download;
