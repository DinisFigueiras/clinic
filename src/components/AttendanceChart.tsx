"use client"

import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Segunda',
    Clinica: 40,
    Domicilio: 24,
  },
  {
    name: 'Terça',
    Clinica: 30,
    Domicilio: 13,
  },
  {
    name: 'Quarta',
    Clinica: 20,
    Domicilio: 90,
  },
  {
    name: 'Quinta',
    Clinica: 27,
    Domicilio: 39,
  },
  {
    name: 'Sexta',
    Clinica: 18,
    Domicilio: 48,
  },
  {
    name: 'Sabado',
    Clinica: 23,
    Domicilio: 37,
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
                    <Bar dataKey="Clinica" stackId="a" fill="#C3EBFA" legendType='circle' />
                    <Bar dataKey="Domicilio" stackId="a" fill="#FAE27C" legendType='circle'radius={[10,10,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AttendanceChart