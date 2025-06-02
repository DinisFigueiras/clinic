"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { patientschema, Patientschema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { createPatients, updatePatients } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PatientForm = ({
    type,
    data,
    setOpen
    }:{
        type:"create" | "update";
        data?:any;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<Patientschema>({
        resolver: zodResolver(patientschema),
        });

    const [state, formAction] = useActionState(
            type=== "create" ? createPatients: updatePatients, {
            success:false, error:false
        })  

    const onsubmit = handleSubmit(data =>{
        startTransition(() => {
            formAction(data);
        });
    })

    const formatDateForInput = (date: string | Date | undefined) => {
        if (!date) return "";
        const d = new Date(date); // Parse the date
        return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    };

    console.log("Patient data:", data);

    const router = useRouter();
    useEffect(() => {

        if(state.success){
            toast(`Paciente ${type === "create" ? "criado": "editado"}!`);
            setOpen(false);
            router.refresh();
        }
    },[state, router, setOpen, type]);

    return(
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Criar um novo paciente" : "Editar o paciente"}</h1>
            {/*INPUTS DOS PACIENTES*/}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="ID" inputName="id" type="number" defaultValue={data?.id} register={register} error={errors?.id}/>
                <InputField label="Email" inputName="email" defaultValue={data?.email} register={register} error={errors?.email}/>
                <InputField label="NIF" inputName="nif" type="number" defaultValue={data?.nif} register={register} error={errors?.nif}/>
                <InputField label="Nome do Paciente" inputName="name" defaultValue={data?.name} register={register} error={errors?.name}/>
                <InputField label="Telemovel" inputName="mobile_phone" type="string" defaultValue={data?.mobile_phone} register={register} error={errors?.mobile_phone}/>
                <InputField label="Cidade" inputName="city" defaultValue={data?.city} register={register} error={errors?.city}/>
                <InputField label="Codigo Postal" inputName="postal_code" defaultValue={data?.postal_code} register={register} error={errors?.postal_code}/>
                <InputField label="Morada" inputName="address_line1" defaultValue={data?.address_line1} register={register} error={errors?.address_line1}/>
                <InputField label="Complemento de Morada" inputName="address_line2" defaultValue={data?.address_line2} register={register} error={errors?.address_line2}/>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Genero</label>
                <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data?.gender}>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Estado</label>
                <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("state_type")} defaultValue={data?.state_type}>
                    <option value="Reformado">Reformado</option>
                    <option value="Ativo">Ativo</option>
                </select>
                {errors.state_type?.message && <p className="text-xs text-red-400">{errors.state_type.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Atendimento</label>
                <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("attendance_type")} defaultValue={data?.attendance_type}>
                    <option value="Clinica">Clinica</option>
                    <option value="Domicilio">Domicilio</option>
                </select>
                {errors.attendance_type?.message && <p className="text-xs text-red-400">{errors.attendance_type.message.toString()}</p>}
                </div>
                <InputField label="Data de Nascimento" inputName="date_of_birth" type="date" defaultValue={formatDateForInput(data?.date_of_birth)} register={register} error={errors?.date_of_birth}/>
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Criar" : "Editar"}</button>
            
        </form>
    )
    
};

export default PatientForm

