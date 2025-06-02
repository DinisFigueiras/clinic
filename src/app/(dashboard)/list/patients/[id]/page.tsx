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

const SinglePatientPage = async ({params}: {params: {id:string}}) => {

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

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/*LEFT*/}
            <div className="w-full xl:w-2/3">
                {/*TOP*/}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/*USER INFO CARD*/}
                    <div className="bg-blueSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                        <Image src="/avatar.png"
                         alt="" 
                         width={144}
                          height={144} 
                          className="w-36 h-36 rounded-full object-cover"/>
                        </div>
                        <div className="w-2/3 flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">{patient.name}</h1>
                            <FormModal2 table="patients" type="update" data={patient}/>
                        </div>
                            <p className="text-sm text-gray-500">
                                {patient.observations || "Sem observações."}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/class.png" alt="" width={14} height={14}/>
                                    <span>{patient.nif}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14}/>
                                    <span>{new Intl.DateTimeFormat("pt-PT").format(patient.date_of_birth)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14}/>
                                    <span>{patient.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14}/>
                                    <span>{patient.mobile_phone || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2 flex-grow">
                                    <Image src="/home.png" alt="" width={14} height={14}/>
                                    <span>{patient.address_line1 + " " + patient.address_line2 + ", " + patient.city + " -" + patient.postal_code || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*SMALL CARDS*/}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/*CARD 1*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">{patient.attendance_type}</h1>
                               <span className="text-sm text-gray-400">Tipo de Atendimento</span> 
                            </div>
                        </div>
                        {/*CARD 2*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">{patient.state_type}</h1>
                               <span className="text-sm text-gray-400">Estado do Paciente</span> 
                            </div>
                        </div>
                        {/*CARD 3*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">{pastBookingsCount}</h1>
                               <span className="text-sm text-gray-400">Marcações Realizadas</span> 
                            </div>
                        </div>
                        {/*CARD 4*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">{futureBookingsCount}</h1>
                               <span className="text-sm text-gray-400">Marcações Futuras</span> 
                            </div>
                        </div>
                    </div>
                </div>
                {/*BOTTOM*/}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Calendario </h1>
                    <BigCalendarContainer/>
                </div>
            </div>
            {/*RIGHT*/}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <EventCalendarContainerPatientID 
                searchParams={Promise.resolve({})} 
                patientId={id} 
            />
            </div>
        </div>
    )
}

export default SinglePatientPage