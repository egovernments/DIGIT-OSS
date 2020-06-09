import _ from 'lodash';
import { useSelector } from "react-redux";

export function convertJs(type, value) {
    return value;
}

export default function NFormatter(props) {
    var SI_SYMBOL = ["Unit", "Lac", "Cr"];
    var GFilterData = useSelector(state => state.GFilterData);
    // const dispatch = useDispatch();
    if (props && Object.keys(props).length > 0) {
        const Rformatter = new Intl.NumberFormat('en-IN', {
            // maximumFractionDigits:0,
            useGrouping: true,
            // currencyDisplay : Intl.NumberFormatOptions
            style: 'currency',
            currency: 'INR'
        })
        switch (props.nType) {
            case "amount":
            case "Amount":

                switch (_.get(GFilterData, 'Denomination')) {
                    case SI_SYMBOL[1]:
                        return `${Rformatter.format((props.value / 100000).toFixed(2) || 0)}  ${_.get(GFilterData, 'Denomination')}`

                    case SI_SYMBOL[2]:
                        return `${Rformatter.format((props.value / 10000000).toFixed(2) || 0)}  ${_.get(GFilterData, 'Denomination')}`
                    case SI_SYMBOL[0]:
                        if (props.value <= 9999999) {
                            return `${Rformatter.format(props.value || 0)}`
                        } else {
                            let value = Rformatter.format((props.value).toFixed(2) || 0).replace('₹ ', '').replace('₹','');
                            var right = value.substring(value.length - 12, value.length);
                            var left = value.substring(0, value.length - 12).replace(',', '');
                            let newVal = '₹ ' + (left ? (left + ',') : '') + right;
                            return newVal.replace(",,", ',');
                        }
                    default:
                        return parseFloat(`${Rformatter.format(props.value || 0)}`);
                }
            case "number":
            case "Number":
                const Nformatter = new Intl.NumberFormat('en-IN');
                return Nformatter.format(Math.round(props.value));
            case "percentage":
            case "Percentage":
                const Pformatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
                return `${parseFloat(Pformatter.format(props.value) || '0').toFixed(2)} %`;
            case "text":
            case "Text":
                return props.value;
            default:
                return props.value;

        }
    } else return 0;
}