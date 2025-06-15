
import FormModal2 from "@/components/FormModal2"
import SortButton from "@/components/SortButton"
import TableSeacrh2 from "@/components/TableSearch2"
import MedicationListClient from "@/components/MedicationListClient"
import { withPrisma } from "@/lib/prisma"
import { Medication } from "@prisma/client"




const MedicationListPage = async () => {
    // Get all medications for client-side filtering
    const data = await withPrisma(async (prisma) => {
        return await prisma.medication.findMany({
            orderBy: { name: 'asc' }
        });
    });

    // Convert Decimal fields to number for JSON serialization
    const initialData = data.map(item => ({
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
            {/* CLIENT-SIDE LIST WITH API SEARCH */}
            <MedicationListClient initialData={initialData} />
        </div>
    )
  
}

export default MedicationListPage

