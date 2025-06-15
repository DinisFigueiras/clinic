
import FormModal2 from "@/components/FormModal2"
import SortButton from "@/components/SortButton"
import TableSeacrh2 from "@/components/TableSearch2"
import PatientListClient from "@/components/PatientListClient"
import { withPrisma } from "@/lib/prisma"

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



// Removed columns and renderRow - now handled in PatientListClient component

const PatientsListPage = async () => {
    // Get all patients for client-side pagination and filtering
    const initialData = await withPrisma(async (prisma) => {
        return await prisma.patient.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                mobile_phone: true,
                landline_phone: true,
                nif: true,
                state_type: true,
                attendance_type: true,
                city: true,
            },
            orderBy: { name: "asc" },
            // Load all patients for client-side pagination
        });
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos os Pacientes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeacrh2 />
                    <div className="flex items-center gap-4 self-end">
                        <SortButton />
                        <FormModal2 table="patients" type="create" />
                    </div>
                </div>
            </div>
            {/* CLIENT-SIDE LIST WITH API SEARCH */}
            <PatientListClient initialData={initialData} />
        </div>
    );
};

export default PatientsListPage;
