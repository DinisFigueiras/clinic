"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { medicationschema, Medicationschema } from "@/lib/formValidationSchemas";
import { createMedication, updateMedication } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MedicationForm = ({
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
        } = useForm<Medicationschema>({
        resolver: zodResolver(medicationschema),
        });

    const [state, formAction] = useActionState(
        type=== "create" ? createMedication: updateMedication, {
        success:false, error:false
    })  

    const onsubmit = handleSubmit(data =>{
        console.log(data);
        startTransition(() => {
            formAction(data);
        });
    })


    const router = useRouter();
    useEffect(() => {

        if(state.success){
            toast(`Paciente ${type === "create" ? "criado": "editado"}!`,
                { type: "success", autoClose: 2000, pauseOnHover: false, closeOnClick: true }
            );
            setOpen(false);
            router.refresh();
        }
    },[state, router, setOpen, type]);



    return(
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold text-neutral text-center">{type === "create" ? "Criar um novo produto" : "Editar o produto"}</h1>
            {/*INPUTS DOS PRODUTOS*/}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="ID" inputName="id" type="number" defaultValue={data?.id} register={register} error={errors?.id} readonly={type === "update"} required={true}/>
                <InputField label="Nome do produto" inputName="name" defaultValue={data?.name} register={register} error={errors?.name} required={true}/>
                <InputField label="Stock" inputName="stock" type="number" defaultValue={data?.stock} register={register} error={errors?.stock} required={true}/>
                <InputField label="Tipo do produto" inputName="type" defaultValue={data?.type} register={register} error={errors?.type} required={true}/>
                <InputField label="Dosagem do produto" inputName="dosage" defaultValue={data?.dosage} register={register} error={errors?.dosage} required={true}/>
                <InputField label="Preço" inputName="price" type="number" defaultValue={data?.price} register={register} error={errors?.price} required={true}/>
                <InputField label="Fornecedor" inputName="supplier" defaultValue={data?.supplier} register={register} error={errors?.supplier} required={true}/>
            </div>
            {/* {state.error && <span className="text-red-500">Erro ao criar o produto</span>} */}

            <button className="bg-blue text-white p-2 rounded-md">{type === "create" ? "Criar" : "Editar"}</button>
        </form>
    )
};

export default MedicationForm
 {/*4h31min34 */}