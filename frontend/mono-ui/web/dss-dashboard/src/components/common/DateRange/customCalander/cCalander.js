import React from "react";
import moment from "moment";
import style from "./calanderStyle";
import shape_icon from '../../../../images/shape.svg';
import SVG from 'react-inlinesvg';
import { withStyles } from "@material-ui/core";

class CustomCalendar extends React.Component {
    weekdayshort = moment.weekdaysShort();

    state = {
        showYearTable: false,
        showMonthTable: false,
        showDateTable: true,
        dateObject: moment(),
        allmonths: moment.months(),
        selectedDay: null
    };
    daysInMonth = () => {
        return this.state.dateObject.daysInMonth();
    };
    year = () => {
        return this.state.dateObject.format("Y");
    };
    currentDay = () => {
        return this.state.dateObject.format("D");
    };
    firstDayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject)
            .startOf("month")
            .format("d"); // Day of week 0...1..5...6
        return firstDay;
    };
    month = () => {
        return this.state.dateObject.format("MMMM");
    };
    showMonth = (e, month) => {
        this.setState({
            showMonthTable: !this.state.showMonthTable,
            showDateTable: !this.state.showDateTable
        });
    };
    setMonth = month => {
        let monthNo = this.state.allmonths.indexOf(month);
        let dateObject = Object.assign({}, this.state.dateObject);
        dateObject = moment(dateObject).set("month", monthNo);
        this.setState({
            dateObject: dateObject,
            showMonthTable: !this.state.showMonthTable,
            showDateTable: !this.state.showDateTable
        });
    };
    MonthList = props => {
        let { classes } = this.props;
        let months = [];
        props.data.map(data => {
            months.push(
                <td
                    key={data}
                    className={classes.calendarMonth}
                    onClick={e => {
                        this.setMonth(data);
                    }}
                >
                    <span>{data}</span>
                </td>
            );
        });
        let rows = [];
        let cells = [];

        months.forEach((row, i) => {
            if (i % 3 !== 0 || i == 0) {
                cells.push(row);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(row);
            }
        });
        rows.push(cells);
        let monthlist = rows.map((d, i) => {
            return <tr>{d}</tr>;
        });

        return (
            <table className={classes.root}>
                <thead className={classes.tableHead}>
                    <tr>
                        <th colSpan="4">Select a Month</th>
                    </tr>
                </thead>
                <tbody>{monthlist}</tbody>
            </table>
        );
    };
    showYearTable = e => {
        this.setState({
            showYearTable: !this.state.showYearTable,
            showDateTable: !this.state.showDateTable
        });
    };

    onPrev = () => {
        let curr = "";
        if (this.state.showYearTable === true) {
            curr = "year";
        } else {
            curr = "month";
        }
        this.setState({
            dateObject: this.state.dateObject.subtract(1, curr),
            selectedDay:null
        });
    };
    onNext = () => {
        let curr = "";
        if (this.state.showYearTable === true) {
            curr = "year";
        } else {
            curr = "month";
        }
        this.setState({
            dateObject: this.state.dateObject.add(1, curr),
            selectedDay:null
        });
    };
    setYear = year => {
        let dateObject = Object.assign({}, this.state.dateObject);
        dateObject = moment(dateObject).set("year", year);
        this.setState({
            dateObject: dateObject,
            showMonthTable: !this.state.showMonthTable,
            showYearTable: !this.state.showYearTable
        });
    };
    onYearChange = e => {
        this.setYear(e.target.value);
    };
    getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format("YYYY"));
            currentDate = moment(currentDate).add(1, "year");
        }
        return dateArray;
    }
    YearTable = props => {
        let { classes } = this.props;
        let months = [];
        let nextten = moment()
            .set("year", props)
            .add("year", 12)
            .format("Y");

        let tenyear = this.getDates(props, nextten);

        tenyear.map(data => {
            months.push(
                <td
                    key={data}
                    className={classes.calendarYear}
                    onClick={e => {
                        this.setYear(data);
                    }}
                >
                    <span>{data}</span>
                </td>
            );
        });
        let rows = [];
        let cells = [];

        months.forEach((row, i) => {
            if (i % 3 !== 0 || i == 0) {
                cells.push(row);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(row);
            }
        });
        rows.push(cells);
        let yearlist = rows.map((d, i) => {
            return <tr>{d}</tr>;
        });

        return (
            <table className={classes.root}>
                <thead className={classes.tableHead}>
                    <tr>
                        <th colSpan="4">Select a Year</th>
                    </tr>
                </thead>
                <tbody>{yearlist}</tbody>
            </table>
        );
    };

    svgWrapper_back = ({ dangerouslySetInnerHTML, className }) => {
        return (
            <span
                onClick={(e) => this.onPrev()}
                dangerouslySetInnerHTML={dangerouslySetInnerHTML}
                className={className}
            />
        );
    }
    svgWrapper_next = ({ dangerouslySetInnerHTML, className }) => {
        return (
            <span
                onClick={(e) => this.onNext()}
                dangerouslySetInnerHTML={dangerouslySetInnerHTML}
                className={className}
            />
        );
    }
    onDayClick = (e, d) => {
        this.setState(
            {
                selectedDay: d
            },
            () => {
                let dateObject = moment(Object.assign({}, this.state.dateObject));
                dateObject.subtract(dateObject.get("date"),'day')
                dateObject.add(this.state.selectedDay,'day')
                this.props.selectCDate(dateObject)
            }
        );
    };
    render() {
        let { classes } = this.props;
        let weekdayshortname = this.weekdayshort.map(day => {
            return <th key={day}>{day}</th>;
        });
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={`empty-${i}`} className={classes.calendarDay + " empty"}>{<span></span>}</td>);
        }
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let currentDay = d == this.currentDay() ? classes.today : "";
            let selectedDay = d == this.state.selectedDay ? classes.selectedDay : '';
            daysInMonth.push(
                <td key={d} className={`${classes.calendarDay} ${currentDay} ${selectedDay}`}>
                    <span
                        onClick={e => {
                            this.onDayClick(e, d);
                        }}
                    >
                        {d}
                    </span>
                </td>
            );
        }
        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) {
                cells.push(row);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {                
                rows.push(cells);
            }
        });

        let daysinmonth = rows.map((d, i) => {
            return <tr key={`${d}-${i}`}>{d}</tr>;
        });

        return (
            <div className={classes.mainDiv}>
                <div className={classes.rectangle}>
                    <div className={classes.divBack} onClick={this.onPrev}>
                        <SVG src={shape_icon} className={classes.calButtonprev}>
                            back
                   </SVG>
                    </div>
                    {!this.state.showMonthTable && (
                        <span
                            onClick={e => {
                                this.showMonth();
                            }}
                            className={classes.calendarLabel}
                        >
                            {this.month()}
                        </span>
                    )}
                    <span className={classes.calendarLabel} onClick={e => this.showYearTable()}>
                        {this.year()}
                    </span>
                    <div className={classes.divNext} onClick={this.onNext}>
                        <SVG src={shape_icon} className={classes.calButtonNext}>
                            next
                   </SVG>
                    </div>
                </div>

                <div className={classes.calendarDate}>
                    {this.state.showYearTable && <this.YearTable props={this.year()} />}
                    {this.state.showMonthTable && (
                        <this.MonthList data={moment.months()} />
                    )}
                </div>

                {this.state.showDateTable && (
                    <div className={classes.calendarDate}>
                        <table className={classes.root}>
                            <thead className={classes.tableHead}>
                                <tr>{weekdayshortname}</tr>
                            </thead>
                            <tbody>{daysinmonth}</tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}
export default withStyles(style)(CustomCalendar)