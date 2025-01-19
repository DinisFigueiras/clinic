import BigCalendar from "@/components/BigCalendar"
import EventCalendar from "@/components/EventCalendar"
import FormModal from "@/components/FormModal"
import Image from "next/image"
import Link from "next/link"

const SinglePatientPage = () => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/*LEFT*/}
            <div className="w-full xl:w-2/3">
                {/*TOP*/}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/*USER INFO CARD*/}
                    <div className="bg-blueSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                        <Image src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                         alt="" 
                         width={144}
                          height={144} 
                          className="w-36 h-36 rounded-full object-cover"/>
                        </div>
                        <div className="w-2/3 flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">John Doe</h1>
                            <FormModal
                                table="patients"
                                type="update"
                                data={{
                                    id: 1,
                                    username: "Dinis",
                                    email: "test@gmail.com",
                                    password: "1234",
                                    firstName: "Dinis",
                                    lastName: "Figueiras",
                                    phone: "931111111",
                                    address: "Rua de teste",
                                    bloodType: "A+",
                                    birthday: "2000-10-18",
                                    sex: "Male",
                                    img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                }}
                                />
                        </div>
                            <p className="text-sm text-gray-500">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/blood.png" alt="" width={14} height={14}/>
                                    <span>A+</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14}/>
                                    <span>January 2025</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14}/>
                                    <span>user@gmail.com</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14}/>
                                    <span>932751614</span>
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
                               <h1 className="text-xl font-semibold">90%</h1>
                               <span className="text-sm text-gray-400">Attendance</span> 
                            </div>
                        </div>
                        {/*CARD 2*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">2</h1>
                               <span className="text-sm text-gray-400">Branches</span> 
                            </div>
                        </div>
                        {/*CARD 3*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">6</h1>
                               <span className="text-sm text-gray-400">Lessons</span> 
                            </div>
                        </div>
                        {/*CARD 4*/}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="">
                               <h1 className="text-xl font-semibold">6</h1>
                               <span className="text-sm text-gray-400">Classes</span> 
                            </div>
                        </div>
                    </div>
                </div>
                {/*BOTTOM*/}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Patients Schedule</h1>
                    <BigCalendar/>
                </div>
            </div>
            {/*RIGHT*/}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                    <Link className="p-3 rounded-md text-blueSky" href="/">Patients Classes</Link>
                    <Link className="p-3 rounded-md text-purple" href="/">Patients Students</Link>
                    <Link className="p-3 rounded-md text-yellow" href="/">Patients Lessons</Link>
                    <Link className="p-3 rounded-md text-pink-400" href="/">Patients Examns</Link>
                    <Link className="p-3 rounded-md text-blue-400" href="/">Patients Assignments</Link>
                </div>
            </div>
            <EventCalendar/>
            </div>
        </div>
    )
}

export default SinglePatientPage