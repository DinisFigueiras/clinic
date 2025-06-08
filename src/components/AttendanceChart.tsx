"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const AttendanceChart = ({data}: {data:{name: string, Clinica:number,Domicilio:number }[]
}) => {
    return(
    <div className="bg-white border border-neutral rounded-lg w-full h-full p-2">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
              <XAxis dataKey="name" axisLine={false} tickLine={false}/>
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'dataMax + 1']}/>
              <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightgray"}}/>
              <Legend
                align='left'
                verticalAlign='top'
                wrapperStyle={{paddingTop:"20px", paddingBottom:"40px"}}
                formatter={(value) => (
                    <div className="inline-block border border-black rounded px-2 py-1 font-bold">
                        {value}
                    </div>
                )}
              />
              <Bar dataKey="Clinica" stackId="a" fill="#6fb5ff" legendType='circle' />
              <Bar dataKey="Domicilio" stackId="a" fill="#ffce99" legendType='circle'/>
          </BarChart>
        </ResponsiveContainer>
    </div>
    )
}

export default AttendanceChart