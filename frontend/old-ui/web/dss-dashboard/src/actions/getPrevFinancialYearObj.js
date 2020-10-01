import _ from 'lodash';
import moment from 'moment';
export default function getPrevFinancialYearObj() {
	let FYobj = {},text="",datatext="";
	let curMonth = moment().format("MMMM");
	let checkMonth = ['January','February','March'];	
		if(_.includes(checkMonth,curMonth)){
			// it will return for 4 quarter			
				
				FYobj = {
		            title: `FY ${moment(moment().subtract(2,'year')).month(3).startOf('month').format("YY")}-${moment(moment().subtract(1,'year')).month(2).endOf('month').format("YY")}`,
		            value: {
		              startDate: moment(moment().subtract(2,'year')).month(3).startOf('month').unix(),
		              endDate: moment(moment().subtract(1,'year')).month(2).endOf('month').unix(),
		              interval: 'month'
		            }
		        }
			}
	    else{			
			
			FYobj = {
				title: `FY ${moment(moment().subtract(1,'year')).month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').format("YY")}`,
				value: {
				  startDate: moment(moment().subtract(1,'year')).month(3).startOf('month').unix(),
				  endDate: moment().month(2).endOf('month').unix(),
				  interval: 'month'
				}
			}
		
	    }	
	return FYobj;
}
