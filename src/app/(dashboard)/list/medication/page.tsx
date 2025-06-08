
import FormModal2 from "@/components/FormModal2"
import Pagination from "@/components/Paginations"
import SortButton from "@/components/SortButton"
import Table from "@/components/Table"
import TableSeacrh2 from "@/components/TableSearch2"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Medication, Prisma } from "@prisma/client"
import Image from "next/image"


//AQUI OS CAMPOS VISIVEIS NA COLUNA DE Produtos
const columns = [
    {
        header:"Informação",
        accessor:"info"
    },
    {
        header:"Stock",
        accessor:"stock",
        className:"hidden md:table-cell"
    },
    {
        header:"Tipo de Medicamento",
        accessor:"type",
        className:"hidden md:table-cell"
    },
    {
        header:"Dosagem",
        accessor:"dosage",
        className:"hidden md:table-cell"
    },
    {
        header:"Preço",
        accessor:"price",
        className:"hidden lg:table-cell"
    },
    {
        header:"Fornecedor",
        accessor:"supplier",
        className:"hidden lg:table-cell"
    },
    {
        header:"Ações",
        accessor:"action"
    },
]

const renderRow =(item:Medication) => (
    <tr key={item.id} className="border-b border-gray-200 text-sm text-neutral hover:bg-over hover:cursor-pointer">
        <td className="flex items-center gap-4 p-4">
            {/* <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/> */}
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm font-light">{item.id}</p>
            </div>
        </td>
        <td className={`hidden md:table-cell ${item.stock < 5 ? "text-red-500 font-bold" : ""}`}>{item.stock}</td>
        <td className="hidden md:table-cell">{item.type}</td>
        <td className="hidden md:table-cell">{item.dosage}</td>
        <td className="hidden md:table-cell">{item?.price ? `${item.price.toString()} €`:  "€"}</td>
        <td className="hidden md:table-cell">{item.supplier}</td>
        <td>
            <div className="flex items-center gap-2">
                <FormModal2 table="medication" type="update" data={item}/>
                <FormModal2 table="medication" type="delete" id={item.id}/>
                {/* <FormContainer table="medication" type="update" data={item}/>
                <FormContainer table="medication" type="delete" id={item.id}/> */}
            </div>
        </td>
    </tr>
);

const MedicationListPage = async ({
    searchParams: initialSearchParams,
}:{
    searchParams: Promise<{ [key: string]: string | undefined}>;
}) => {
    const searchParams = await initialSearchParams;
    const {page,sort, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    //URL PARAMETROS SEARCH
    const query: Prisma.MedicationWhereInput = {}

    if (queryParams) {
        for(const [key,value] of Object.entries(queryParams)){
            if (value !== undefined) {
                switch(key){
                    case "search":
                        const id = parseInt(value);
                        query.OR = [
                            ...(isNaN(id) ? [] : [{ id: { equals: id } }]),
                            {name: {contains: value, mode: "insensitive"}}
                        ]
                    break;
                    default:
                        break;
                }
                
            }
        }
    }

    // Add orderBy for sorting by name
    let orderBy: Prisma.MedicationOrderByWithRelationInput = {};
    if (sort === "name_asc") {
        orderBy = { name: "asc" };
    } else if (sort === "name_desc") {
        orderBy = { name: "desc" };
    }

    const [data,count] = await prisma.$transaction([

        prisma.medication.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p-1),
            orderBy
        }),

        prisma.medication.count({where: query})
    ])
    

     // Convert Decimal fields to number
     const plainData = data.map(item => ({
        ...item,
        price: item.price.toNumber()
    }));

    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos os Produtos</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeacrh2/>
                    <div className="flex items-center gap-4 self-end">
                        <SortButton />
                            <FormModal2 table="medication" type="create"/>
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={plainData} sort={sort}/>
            {/* PAGINATION */}
            <Pagination page={p} count={count}/>
        </div>
    )
  
}

export default MedicationListPage

