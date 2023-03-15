const moment = require('moment');

let unixStartDate  = moment();

let current        = moment(unixStartDate);
let currentStartOf = moment(current).startOf('quarter');
let currentEndOf   = moment(current).  endOf('quarter').add(1, 'day');

let previous        = moment(current).subtract(1, 'quarter');
let previousStartOf = moment(previous).startOf('quarter');
let previousEndOf   = moment(previous).  endOf('quarter').add(1, 'day');


