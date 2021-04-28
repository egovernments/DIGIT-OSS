const moment = require('moment');

let unixStartDate  = moment();

let current        = moment(unixStartDate);
let currentStartOf = moment(current).startOf('quarter');
let currentEndOf   = moment(current).  endOf('quarter').add(1, 'day');

let previous        = moment(current).subtract(1, 'quarter');
let previousStartOf = moment(previous).startOf('quarter');
let previousEndOf   = moment(previous).  endOf('quarter').add(1, 'day');

/*console.log(
  'current ', 
  currentStartOf.format('DD-MM-YYYY'),
  currentEndOf  .format('DD-MM-YYYY')
)

console.log(
  'previous', 
  previousStartOf.format('DD-MM-YYYY'),
  previousEndOf  .format('DD-MM-YYYY')
)*/

console.log(
	'Current FY',
	moment().month(3).startOf('month').format("YY"),
	'-',
	moment().month(2).endOf('month').add(1, 'years').format("YY")
);

console.log(
	'Previous FY',
	moment(moment().subtract(2,'year')).month(3).startOf('month').format("YY"),
	'-',
	moment(moment().subtract(1,'year')).month(2).endOf('month').format("YY")
);



console.log(
	'Previous FY',
	
	moment().month(3).startOf('month').format("YY"),
	'-',
	moment().month(2).endOf('month').add(1, 'years').format("YY")
);

