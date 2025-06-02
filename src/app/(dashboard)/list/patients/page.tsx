import FormModal from "@/components/FormModal"
import FormModal2 from "@/components/FormModal2"
import Pagination from "@/components/Paginations"
import Table from "@/components/Table"
import TableSeacrh from "@/components/TableSearch"
import TableSeacrh2 from "@/components/TableSearch2"
import { role } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Patient, Prisma } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

// type Patient ={
//     id:number;
//     patientId:string;
//     name:string;
//     email?:string;
//     photo:string;
//     phone:string;
//     subjects:string[];
//     classes:string[];
//     address:string;

// }



//AQUI OS CAMPOS VISIVEIS NA COLUNA DE PACIENTES
const columns = [
    {
        header:"Informação",
        accessor:"info"
    },
    {
        header:"ID",
        accessor:"patientId",
        className:"hidden md:table-cell"
    },
    {
        header:"NIF",
        accessor:"nif",
        className:"hidden md:table-cell"
    },
    {
        header:"Estado",
        accessor:"state",
        className:"hidden md:table-cell"
    },
    {
        header:"Atendimento",
        accessor:"attendance",
        className:"hidden lg:table-cell"
    },
    {
        header:"Telemovel",
        accessor:"phone",
        className:"hidden lg:table-cell"
    },
    {
        header:"Cidade",
        accessor:"city",
        className:"hidden lg:table-cell"
    },
    {
        header:"Ações",
        accessor:"action"
    },
]

const renderRow =(item:Patient) => (
    <tr key={item.id} className="border-b border-gray-200 text-sm text-neutral hover:bg-over hover:cursor-pointer">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm font-light">{item.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.id}</td>
        <td className="hidden md:table-cell">{item.nif}</td>
        <td className="hidden md:table-cell">{item.state_type}</td>
        <td className="hidden md:table-cell">{item.attendance_type}</td>
        <td className="hidden md:table-cell">{item.mobile_phone}</td>
        <td className="hidden md:table-cell">{item.city}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`./patients/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blueLight">
                        <i className="bi bi-eye"></i>
                    </button>
                </Link>
                    {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-peach">
                    <Image src="/delete.png" alt="" width={16} height={16}/>
                    </button> */}
                    <FormModal2 table="patients" type="delete" id={item.id}/>
            </div>
        </td>
    </tr>
);

const PatientsListPage = async ({
    searchParams: initialSearchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const searchParams = await initialSearchParams;
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMETROS SEARCH
    const query: Prisma.PatientWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        const id = parseInt(value);
                        query.OR = [
                            ...(isNaN(id) ? [] : [{ id: { equals: id } }]),
                            { name: { contains: value, mode: "insensitive" } },
                            { nif: { contains: value, mode: "insensitive" } }
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.patient.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.patient.count({ where: query })
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos os Pacientes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeacrh2 />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-peach">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-peach">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        <FormModal2 table="patients" type="create" />
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default PatientsListPage;
