import _ from 'lodash';
import moment from 'moment';
export default function getFinancialYearObj(onlyText,yearObj) {
	let FYobj = {},text="";
	let curMonth = moment().format("MMMM");
	let checkMonth = ['January','February','March'];	
	if(onlyText){
		if(_.includes(checkMonth,curMonth)){
		    // it will return for 4 quarter
	    	text = `FY ${moment(moment().subtract(1,'year')).month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').format("YY")}`;
		}else{
	    	text = `FY ${moment().month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').add(1, 'years').format("YY")}`;
		}
		return text;
	}else{
		yearObj = (yearObj)?yearObj:false;
		if(_.includes(checkMonth,curMonth)){
			// it will return for 4 quarter			
			if(yearObj){
				FYobj = []
				FYobj.push({
		            title: `FY ${moment(moment().subtract(2,'year')).month(3).startOf('month').format("YY")}-${moment(moment().subtract(1,'year')).month(2).endOf('month').format("YY")}`,
		            value: {
		              startDate: moment(moment().subtract(2,'year')).month(3).startOf('month').unix(),
		            //   endDate: moment(moment().subtract(1,'year')).month(2).endOf('month').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        })
				FYobj.push({
		            title: `FY ${moment(moment().subtract(1,'year')).month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').format("YY")}`,
		            value: {
		              startDate: moment(moment().subtract(1,'year')).month(3).startOf('month').unix(),
		            //   endDate: moment().month(2).endOf('month').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        })
			}else{
				FYobj = {
		            title: `FY ${moment(moment().subtract(1,'year')).month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').format("YY")}`,
		            value: {
		              startDate: moment(moment().subtract(1,'year')).month(3).startOf('month').unix(),
		            //   endDate: moment().month(2).endOf('month').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        }
		    }
	    }else{
	    	// it will return for 1,2,3 quarter


	    	if(yearObj){
				FYobj = []
				FYobj.push({
		            title: `FY ${moment(moment().subtract(1,'year')).month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').format("YY")}`,
		            value: {
		              startDate: moment(moment().subtract(1,'year')).month(3).startOf('month').unix(),
		            //   endDate: moment().month(2).endOf('month').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        })
				FYobj.push({
		            title: `FY ${moment().month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').add(1, 'years').format("YY")}`,
		            value: {
		              startDate: moment().month(3).startOf('month').unix(),
		            //   endDate: moment().month(2).endOf('month').add(1, 'years').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        })
			}else{
		        FYobj = {
		            title: `FY ${moment().month(3).startOf('month').format("YY")}-${moment().month(2).endOf('month').add(1, 'years').format("YY")}`,
		            value: {
		              startDate: moment().month(3).startOf('month').unix(),
		            //   endDate: moment().month(2).endOf('month').add(1, 'years').unix(),
					endDate: moment().endOf('day').unix(),

		              interval: 'month'
		            }
		        }
		    }
	    }
	}

	return FYobj;
}
