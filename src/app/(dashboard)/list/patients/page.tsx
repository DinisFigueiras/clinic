import FormModal from "@/components/FormModal"
import Pagination from "@/components/Paginations"
import Table from "@/components/Table"
import TableSeacrh from "@/components/TableSearch"
import { role, teachersData } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"

type Patient ={
    id:number;
    patientId:string;
    name:string;
    email?:string;
    photo:string;
    phone:string;
    subjects:string[];
    classes:string[];
    address:string;

}

//AQUI OS CAMPOS VISIVEIS NA COLUNA DE PACIENTES
const columns = [
    {
        header:"Info",
        accessor:"info"
    },
    {
        header:"Patient ID",
        accessor:"patientId",
        className:"hidden md:table-cell"
    },
    {
        header:"Subjects",
        accessor:"subjects",
        className:"hidden md:table-cell"
    },
    {
        header:"Classes",
        accessor:"classes",
        className:"hidden md:table-cell"
    },
    {
        header:"Phone",
        accessor:"Phone",
        className:"hidden lg:table-cell"
    },
    {
        header:"Address",
        accessor:"address",
        className:"hidden lg:table-cell"
    },
    {
        header:"Actions",
        accessor:"action"
    },
]

const PatientsListPage = () => {

    const renderRow =(item:Patient) => (
        <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-purple hover:cursor-pointer">
            <td className="flex items-center gap-4 p-4">
                <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.patientId}</td>
            <td className="hidden md:table-cell">{item.subjects.join(",")}</td>
            <td className="hidden md:table-cell">{item.classes.join(",")}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={'list/patients/${item.id}'}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blueSky">
                            <Image src="/view.png" alt="" width={16} height={16}/>
                        </button>
                    </Link>
                    {role === "admin" && (
                        // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple">
                        // <Image src="/delete.png" alt="" width={16} height={16}/>
                        // </button>
                        <FormModal table="patients" type="delete" id={item.id}/>
                    )}
                </div>
            </td>
        </tr>
    );

    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos os Pacientes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeacrh/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                            <Image src="/filter.png" alt="" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                            <Image src="/sort.png" alt="" width={14} height={14}/>
                        </button>
                        {role === "admin" && (
                            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                            // <Image src="/create.png" alt="" width={14} height={14}/>
                            // </button>
                            <FormModal table="patients" type="create"/>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={teachersData}/>
            {/* PAGINATION */}
            <Pagination/>
        </div>
    )
  
}

export default PatientsListPage
{/* 2:35:13 */}