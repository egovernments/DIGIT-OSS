function getDate(timestamp) {
  const dt = timestamp ? new Date(timestamp) : new Date();
  let dd = dt.getDate();
  let mm = dt.getMonth() + 1;
  var yyyy = dt.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

const monthNames = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

export { getDate, monthNames };
