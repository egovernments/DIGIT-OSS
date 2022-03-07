import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, Legend,CartesianGrid } from 'recharts';

//using static data for now because I'm not getting proper response from checkbox 
//Need to fix that issue first, always getting ul as response in checkbox from citizen survey
//while sending the answrs from citizen null is being sent to the backend irrespective of what option is chosen
const data = [
  {
    "name": "Page A",
    "value": 4000,
  },
  {
    "name": "Page B",
    "value": 3000,
  },
  {
    "name": "Page C",
    "value": 2000,
  },
  {
    "name": "Page D",
    "value": 2780,
  },
  {
    "name": "Page E",
    "value": 1890,
  }
]

const CheckBoxChart = (props) => {
  return (
    <div style={{
  "padding": "10px",
  "width": "700px",
  "height": "260px",
  "backgroundColor": "#fafafa"}}>
    <ResponsiveContainer>
    	<BarChart 
            data={data}
            layout="vertical" 
            margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
            barCategoryGap={8}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number"  />
        <YAxis type="category" width={150} padding={{ left: 20 }} dataKey="name"/>    
       <Bar 
           dataKey="value" 
           fill="#048BD0"
           />
        <Tooltip />
      </BarChart>
     </ResponsiveContainer>
     </div>
  )
}

export default CheckBoxChart