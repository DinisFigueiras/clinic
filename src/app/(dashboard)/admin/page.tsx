import AttendanceChartContainer from "@/components/AttendanceChartContainer"
import CountChartContainer from "@/components/CountChartContainer"
import CountChartContainer2 from "@/components/CountChartContainer2"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import UserCard from "@/components/Usercard"


const AdminPage = async ({searchParams}: {searchParams: Promise<{[keys: string]: string | undefined}>}) => {
    const params = await searchParams;
    return(
        <div className='p-4 flex gap-4 flex-col md:flex-row'>
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* USER CARDS */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="Utentes"/>
                    <UserCard type="Marcações"/>
                    <UserCard type="Produtos"/>
                </div>
                {/* MIDDLE CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHARTS CLINICA VS DOMICILIO */}
                    <div className="w-full lg:w-1/2 h-[450px]">
                    <CountChartContainer/>
                    </div>
                    {/* ATTENDANCE CHARTS ATIVO VS REFORMADO */}
                    <div className="w-full lg:w-1/2 h-[450px]">
                    <CountChartContainer2/>
                    </div>
                </div>
                {/* BOTTOM CHART */}
                <div className="w-full lg:w-full h-[500px]">
                    <AttendanceChartContainer/>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <EventCalendarContainer searchParams={params} />
            </div>
        </div>
    )
}

export default AdminPage
 
