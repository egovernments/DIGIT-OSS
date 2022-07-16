import React from 'react'
import { PieChart, Pie, Cell,Tooltip,Legend } from "recharts";

const getData = (data) => {
    const options = data.options;
    const answers = data.answers;
    const processedData = [];
    options?.map(option => processedData.push({name:option,value:0}));
    
    answers?.map((ans,index) => {
        processedData?.map((element,i) => {
            if(element.name === ans) processedData[i].value = processedData[i].value + 1
        })
    })
    return processedData;
}

const COLORS = ["#8E29BF", "#FBC02D", "#048BD0","#EA8A3B","#0BABDE","#800080","#ee82ee","#616161","#3cb371","#6a5acd"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderLegend = (props) => {
  const { payload } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column",height: "300px" }}>
      <div style={{ overflow: "auto", flex: "1" }}>
        <ul style={{ "listStyle": "disc" }}>
          {
            payload?.map((entry, index) => (
              <li key={`item-${index}`} style={{"display":"list-item","color":entry.color,"fontSize":"19px"}}>{entry.value}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

const McqChart = (props) => {
  const data = getData(props.data)
    return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend content={renderLegend} width={100} align="right" wrapperStyle={{ top: 40, right: 20,left:500, backgroundColor: '#FAFAFA', borderRadius: 3, lineHeight: '40px' }} />
    </PieChart>
  )
}

export default McqChart