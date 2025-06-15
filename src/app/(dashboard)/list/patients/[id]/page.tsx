import BigCalendarContainerPatient from "@/components/BigCalendarContainerPatient"
import EventCalendarContainerPatientID from "@/components/EventCalendarContainerPatientID"
import FormModal2 from "@/components/FormModal2"
import { withPrisma } from "@/lib/prisma"
import { Patient } from "@prisma/client"
import Image from "next/image"
import { notFound } from "next/navigation"

const SinglePatientPage = async ({params}: {params: Promise<{id:string}>}) => {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    
    const {
        patient,
        pastBookingsCount,
        futureBookingsCount,
        pastBookingsWithMedication
    } = await withPrisma(async (prisma) => {
        const patient: Patient | null = await prisma.patient.findUnique({
            where: {id},
        });

        if (!patient) {
            return { patient: null, pastBookingsCount: 0, futureBookingsCount: 0, pastBookingsWithMedication: [] };
        }

        const today = new Date();

        // Use a single transaction to get all data efficiently
        const [pastBookingsCount, futureBookingsCount, pastBookingsWithMedication] = await prisma.$transaction([
            // Count past bookings
            prisma.bookings.count({
                where: {
                    patient_id: Number(id),
                    booking_StartdateTime: { lt: today },
                },
            }),
            // Count future bookings
            prisma.bookings.count({
                where: {
                    patient_id: Number(id),
                    booking_StartdateTime: { gte: today },
                },
            }),
            // Get past bookings with medications
            prisma.bookings.findMany({
                where: {
                    patient_id: Number(id),
                    booking_StartdateTime: { lt: today },
                    bookingMedications: {
                        some: {} // Has at least one medication
                    }
                },
                include: {
                    bookingMedications: {
                        include: {
                            medication: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    booking_StartdateTime: "asc",
                },
                take: 50 // Limit to last 50 bookings for performance
            })
        ]);

        return {
            patient,
            pastBookingsCount,
            futureBookingsCount,
            pastBookingsWithMedication
        };
    });

    if (!patient) {
        return notFound();
    }

    // Group bookings by medication_id
    const bookingsByMedication: {
        [medicationId: number]: { name: string; bookings: { id: number; date: Date }[] }
    } = {};

    pastBookingsWithMedication.forEach(booking => {
        booking.bookingMedications.forEach(bm => {
            if (!bookingsByMedication[bm.medication_id]) {
                bookingsByMedication[bm.medication_id] = {
                    name: bm.medication.name,
                    bookings: [],
                };
            }
            bookingsByMedication[bm.medication_id].bookings.push({
                id: booking.id,
                date: booking.booking_StartdateTime,
            });
        });
    });

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/*LEFT*/}
            <div className="w-full xl:w-2/3">
                {/*TOP*/}
                <div className="flex flex-col lg:flex-row gap-4 ">
                    {/*USER INFO CARD*/}
                    <div className="py-6 px-4 rounded-md flex-1 flex gap-4 bg-blueLight text-neutral items-center min-h-[90px]">
                        <div className="w-1/3 flex items-center justify-center">
                        <i className="bi bi-person-circle text-[90px] w-36 h-36 text-black " ></i>
                        </div>
                        <div className="w-2/3 flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold">{patient.name}</h1>
                            <FormModal2 table="patients" type="update" data={patient}/>
                        </div>
                            <p className="text-sm text-neutralLight mb-2">
                                {patient.observations || "Sem observações."}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <i className="bi bi-credit-card-2-front-fill"></i>
                                    <span>{patient.nif}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <i className="bi bi-calendar2-week-fill"></i>
                                    <span>{new Intl.DateTimeFormat("pt-PT").format(patient.date_of_birth)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <i className="bi bi-envelope-fill"></i>
                                    <span>{patient.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <i className="bi bi-telephone-fill"></i>
                                    <span>
                                    {patient.mobile_phone
                                        ? patient.mobile_phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3")
                                        : "-"}
                                    </span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <i className="bi bi-telephone-outbound-fill"></i>
                                    <span>
                                    {patient.landline_phone
                                        ? patient.landline_phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3")
                                        : "-"}
                                    </span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2 flex-grow">
                                    <i className="bi bi-house-fill"></i>
                                    <span>{patient.address_line1 + " " + patient.address_line2 + ", " + patient.city + " -" + patient.postal_code || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*SMALL CARDS*/}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/*CARD 1*/}
                        <div className="bg-peachLight p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold text-neutral">{patient.attendance_type}</h1>
                               <span className="text-sm text-neutralLight font-light">Tipo de Atendimento</span> 
                            </div>
                        </div>
                        {/*CARD 2*/}
                        <div className="bg-peachLight p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold text-neutral">{patient.state_type}</h1>
                               <span className="text-sm text-neutralLight font-light">Estado do Paciente</span> 
                            </div>
                        </div>
                        {/*CARD 3*/}
                        <div className="bg-peachLight p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold text-neutral">{pastBookingsCount}</h1>
                               <span className="text-sm text-neutralLight font-light">Marcações Realizadas</span> 
                            </div>
                        </div>
                        {/*CARD 4*/}
                        <div className="bg-peachLight p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ">
                            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold text-neutral ">{futureBookingsCount}</h1>
                               <span className="text-sm text-neutralLight font-light">Marcações Futuras</span> 
                            </div>
                        </div>
                    </div>
                </div>
                {/*BOTTOM*/}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <BigCalendarContainerPatient patientId={id} />
                </div>
            </div>
            {/*RIGHT*/}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendarContainerPatientID 
                    searchParams={{}}
                    patientId={id} 
                />
                <div className="bg-white p-4 rounded-md mt-4">
                    <h2 className="text-xl font-semibold text-neutral">Produtos Utilizados</h2>
                    {Object.keys(bookingsByMedication).length === 0 ? (
                        <p className="text-sm text-neutralLight">Nenhum produto utilizado.</p>
                    ) : (
                        <ul className="text-sm text-neutralLight list-disc pl-5">
                            {Object.entries(bookingsByMedication).map(([medId, med]) => (
                                <li key={medId}>
                                    <span className="font-semibold text-blue">{med.name}</span>: {med.bookings.length} vezes
                                    <ul className="ml-4 list-[circle]">
                                        {med.bookings.map(b => (
                                            <li key={b.id}>
                                                {b.date.toLocaleDateString("pt-PT", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}{" "}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SinglePatientPage
