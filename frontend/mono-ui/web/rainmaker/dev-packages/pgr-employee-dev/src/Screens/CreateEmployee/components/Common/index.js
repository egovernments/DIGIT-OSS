export function translate(locale_text) {
  // if (locale_text && localStorageGet(`localization_${getLocale()}`)) {
  //   var langresult = JSON.parse(localStorageGet(`localization_${getLocale()}`)).filter(function(obj) {
  //     return obj.code == locale_text;
  //   });
  //   if (langresult[0]) return Object.values(langresult[0])[1];
  //   else return localStorage.locale == 'mr_IN' ? localization_MR_Data[locale_text] || locale_text : localization_EN_Data[locale_text] || locale_text;
  // }
  return locale_text;
}

export function validate_fileupload(files, formats) {
  var filelimit = 5242880;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let filename = file.name;
    let fileext = filename
      .split(".")
      .pop()
      .toLowerCase();
    let filesize = file.size;
    if (filename.length <= 30) {
      if (formats.indexOf(fileext) >= 0 || !formats || formats.length == 0) {
        if (filesize <= filelimit) {
        } else {
          return "File size exceeds 5MB";
        }
      } else {
        return "Allowed file formats is " + formats + "";
      }
    } else {
      return "File name length should not exceed 30 characters";
    }
  }
  return true;
}

export function format_lat_long(latorlong) {
  var loc_arry = latorlong.split(",");
  var degree = parseFloat(loc_arry[0]);
  var minutes = parseFloat(loc_arry[1]);
  var seconds = parseFloat(loc_arry[2]);

  //formula is degree+((minutes*60)+seconds/3600)
  var formatted = degree + (minutes * 60 + seconds) / 3600;

  return formatted;
}

export function toLocalTime(regDate) {
  var dat = regDate.split(" ")[0];
  dat = dat.split("-")[1] + "-" + dat.split("-")[0] + "-" + dat.split("-")[2] + " " + regDate.split(" ")[1];
  dat = new Date(dat + " UTC").toString();
  return dat.substr(0, dat.indexOf("GMT"));
}

export function epochToDate(t) {
  function pad2(n) {
    return n > 9 ? n : "0" + n;
  }
  var d = new Date(Number(t));
  var year = d.getFullYear();
  var month = d.getMonth() + 1; // months start at zero
  var day = d.getDate();

  return pad2(day) + "/" + pad2(month) + "/" + year;
}

export function epochToTime(t) {
  var date_obj = new Date(Number(t));
  const hrs = date_obj.getHours();
  const mins = date_obj.getMinutes();
  let time = (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins);
  return time;
}

export function dateToEpoch(datestring) {
  let tdate = datestring.split("/");
  return new Date(tdate[2], tdate[1] - 1, tdate[0]).getTime();
}

export function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString,
  });
}
