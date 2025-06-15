"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { medicationschema, Medicationschema } from "@/lib/formValidationSchemas";
import { createMedication, updateMedication } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

/**
 * Form component for creating and updating medications
 */
const MedicationForm = ({
    type,
    data,
    setOpen
    }:{
        type:"create" | "update";
        data?:any;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => {

    const [nextId, setNextId] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<Medicationschema>({
        resolver: zodResolver(medicationschema),
        });

    // Fetch next ID for create mode
    useEffect(() => {
        if (type === "create") {
            fetch("/api/medications/next-id")
                .then(res => res.json())
                .then(data => setNextId(data.nextId))
                .catch(err => console.error("Error fetching next ID:", err));
        }
    }, [type]);

    // Form action handler for create/update operations
    const [state, formAction] = useActionState(
        type === "create" ? createMedication : updateMedication, {
        success: false,
        error: false
    })

    // Form submission handler
    const onsubmit = handleSubmit(data => {
        startTransition(() => {
            formAction(data);
        });
    })

    const router = useRouter();

    // Handle form submission results (success notifications)
    useEffect(() => {
        if(state.success){
            toast(`Medicamento ${type === "create" ? "criado": "editado"}!`,
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
                <InputField
                    label="ID do Medicamento"
                    inputName="id"
                    type="number"
                    defaultValue={type === "create" ? nextId : data?.id}
                    register={register}
                    error={errors?.id}
                    readonly={true}
                    required={false}
                />
                <InputField label="Nome do produto" inputName="name" defaultValue={data?.name} register={register} error={errors?.name} required={true}/>
                <InputField label="Stock" inputName="stock" type="number" defaultValue={data?.stock} register={register} error={errors?.stock} required={false}/>
                <InputField label="Tipo do produto" inputName="type" defaultValue={data?.type} register={register} error={errors?.type} required={false}/>
                <InputField label="Dosagem do produto" inputName="dosage" defaultValue={data?.dosage} register={register} error={errors?.dosage} required={false}/>
                <InputField
                    label="Preço"
                    inputName="price"
                    type="number"
                    defaultValue={data?.price}
                    register={register}
                    error={errors?.price}
                    required={false}
                    inputProps={{ step: "0.01", min: "0", placeholder: "Ex: 12.30" }}
                />
                <InputField label="Fornecedor" inputName="supplier" defaultValue={data?.supplier} register={register} error={errors?.supplier} required={false}/>
            </div>
            <button className="bg-blue text-white p-2 rounded-md">{type === "create" ? "Criar" : "Editar"}</button>
        </form>
    )
};

export default MedicationForm