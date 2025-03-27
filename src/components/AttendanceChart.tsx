"use client"

import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const AttendanceChart = ({data}: {data:{name: string, Clinica:number,Domicilio:number }[]
}) => {
    return(
      <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
              <XAxis dataKey="name" axisLine={false} tickLine={false}/>
              <YAxis axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightgray"}}/>
              <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:"20px", paddingBottom:"40px"}}/>
              <Bar dataKey="Clinica" stackId="a" fill="#C3EBFA" legendType='circle' />
              <Bar dataKey="Domicilio" stackId="a" fill="#FAE27C" legendType='circle'radius={[10,10,0,0]}/>
          </BarChart>
      </ResponsiveContainer>
    )
}

export default AttendanceChart