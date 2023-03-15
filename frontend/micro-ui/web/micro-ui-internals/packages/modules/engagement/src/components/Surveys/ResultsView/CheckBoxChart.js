import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, Legend,CartesianGrid } from 'recharts';

const formObj = data => {
  
  const checkBoxData= []
  const options = data.options;
  const answers = data.answers;
  options.map(option =>{
    const obj = {}
    obj["name"]=option;
    obj["value"]=0;
    answers.map(ans =>{
        ans.map(el=>{
          if(el===option){
            obj["value"] = obj["value"] + 1
          }
        })
    })
    checkBoxData.push(obj)
  })
return checkBoxData
}
const CheckBoxChart = (props) => {
  const datav1 = formObj(props.data);
  return (
    <div style={{
  "padding": "10px",
  "width": "700px",
  "height": "260px",
  "backgroundColor": "#fafafa"}}>
    <ResponsiveContainer>
    	<BarChart 
            data={datav1}
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