import AttendanceChart from "@/components/AttendanceChart"
import CountChart from "@/components/CountChart"
import CountChart2 from "@/components/CountChart2"
import EventCalendar from "@/components/EventCalendar"
import UserCard from "@/components/Usercard"

const AdminPage = () => {
    return(
        <div className='p-4 flex gap-4 flex-col md:flex-row'>
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* USER CARDS */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="Número de Utentes"/>
                    <UserCard type="Número de Marcações"/>
                    <UserCard type="Número de Produtos"/>
                    <UserCard type="Unknown"/>
                </div>
                {/* MIDDLE CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHARTS CLINICA VS DOMICILIO */}
                    <div className="w-full lg:w-1/2 h-[450px]">
                    <CountChart/>
                    </div>
                    {/* ATTENDANCE CHARTS ATIVO VS REFORMADO */}
                    <div className="w-full lg:w-1/2 h-[450px]">
                    <CountChart2/>
                    </div>
                </div>
                {/* BOTTOM CHART */}
                <div className="w-full lg:w-full h-[500px]">
                    <AttendanceChart/>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <EventCalendar />
            </div>
        </div>
    )
}

export default AdminPage

 
