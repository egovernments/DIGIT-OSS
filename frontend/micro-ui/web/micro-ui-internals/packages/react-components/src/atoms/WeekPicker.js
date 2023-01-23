import React,{ useState } from 'react'
import { Calendar } from "react-date-range";
const WeekPicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    
    return (
        <Calendar onChange={item => setStartDate(item)}
             date={startDate} />
    )
}

export default WeekPicker