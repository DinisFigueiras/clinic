import BigCalendar from "@/components/BigCalendar"
import BigCalendarContainer from "@/components/BigCalendarContainer"
import EventCalendar from "@/components/EventCalendar"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import EventCalendarContainerPatientID from "@/components/EventCalendarContainerPatientID"
import FormContainer from "@/components/FormContainer"
import FormModal2 from "@/components/FormModal2"
import prisma from "@/lib/prisma"
import { Patient } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const SinglePatientPage = async ({params}: {params: Promise<{id:string}>}) => {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const patient: Patient | null = await prisma.patient.findUnique({
        where: {id},
    });

    if (!patient) {
        return notFound();
    }

    const today = new Date();

    // Count past bookings (bookings with a start date before today)
    const pastBookingsCount = await prisma.bookings.count({
        where: {
            patient_id: Number(id),
            booking_StartdateTime: {
                lt: today, // Less than today
            },
        },
    });
    // Count future bookings (bookings with a start date on or after today)
    const futureBookingsCount = await prisma.bookings.count({
        where: {
            patient_id: Number(id),
            booking_StartdateTime: {
                gte: today, // Greater than or equal to today
            },
        },
    });

    
    const medicationUsage = await prisma.bookings.groupBy({
    by: ['medication_id'],
    where: {
        patient_id: Number(id),
        medication_id: { not: null },
        booking_StartdateTime: {
            lt: today, // Only past bookings
        },
    },
    _count: { medication_id: true },
    });

    const medicationNames = await prisma.medication.findMany({
        where: {
            id: { in: medicationUsage.map(m => m.medication_id).filter((id): id is number => id !== null) }
        },
        select: { id: true, name: true }
    });

    const medicationMap = Object.fromEntries(medicationNames.map(m => [m.id, m.name]));





    // Get all past bookings with medication for this patient
    const pastBookingsWithMedication = await prisma.bookings.findMany({
        where: {
            patient_id: Number(id),
            medication_id: { not: null },
            booking_StartdateTime: { lt: today },
        },
        include: {
            medication: true,
        },
        orderBy: {
            booking_StartdateTime: "asc",
        },
    });

    // Group bookings by medication_id
    const bookingsByMedication: {
        [medicationId: number]: { name: string; bookings: { id: number; date: Date }[] }
    } = {};

    pastBookingsWithMedication.forEach(b => {
        if (!b.medication) return;
        if (!bookingsByMedication[b.medication_id!]) {
            bookingsByMedication[b.medication_id!] = {
                name: b.medication.name,
                bookings: [],
            };
        }
        bookingsByMedication[b.medication_id!].bookings.push({
            id: b.id,
            date: b.booking_StartdateTime,
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
                        {/* <Image src="/avatar.png"
                         alt="" 
                         width={144}
                          height={144} 
                          className="w-36 h-36 rounded-full object-cover"/> */}
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
                    <BigCalendarContainer/>
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
                {/* <div className="bg-white p-4 rounded-md mt-4">
                    <h2 className="text-xl font-semibold text-neutral">Produtos Utilizados</h2>
                    {medicationUsage.length === 0 ? (
                        <p className="text-sm text-neutralLight">Nenhum produto utilizado.</p>
                    ) : (
                        <ul className="text-sm text-neutralLight list-disc pl-5">
                            {medicationUsage.map(med => (
                                <li key={med.medication_id}>
                                    {med.medication_id !== null ? (medicationMap[med.medication_id] || "Produto desconhecido") : "Produto desconhecido"}: <b>{med._count.medication_id}</b> vezes
                                </li>
                            ))}
                        </ul>
                    )}
                </div> */}

            </div>
        </div>
    )
}

export default SinglePatientPage