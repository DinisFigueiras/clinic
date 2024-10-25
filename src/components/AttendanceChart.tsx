"use client"

import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Segunda',
    clinica: 40,
    domicilio: 24,
  },
  {
    name: 'Terça',
    clinica: 30,
    domicilio: 13,
  },
  {
    name: 'Quarta',
    clinica: 20,
    domicilio: 90,
  },
  {
    name: 'Quinta',
    clinica: 27,
    domicilio: 39,
  },
  {
    name: 'Sexta',
    clinica: 18,
    domicilio: 48,
  },
  {
    name: 'Sabado',
    clinica: 23,
    domicilio: 38,
  }
];

const AttendanceChart = () => {
    return(
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Consultas</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20}/>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart width={500} height={300} data={data} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                    <YAxis axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightgray"}}/>
                    <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:"20px", paddingBottom:"40px"}}/>
                    <Bar dataKey="clinica" stackId="a" fill="#C3EBFA" legendType='circle' />
                    <Bar dataKey="domicilio" stackId="a" fill="#FAE27C" legendType='circle'radius={[10,10,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AttendanceChart