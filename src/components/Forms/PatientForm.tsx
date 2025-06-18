"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { patientschema, Patientschema, checkPatientIdExists } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { createPatients, updatePatients } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Form component for creating and updating patients
 */
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
        setError,
        clearErrors,
        watch,
        setValue
        } = useForm<Patientschema>({
        resolver: zodResolver(patientschema),
        });

    // State for ID validation
    const [isCheckingId, setIsCheckingId] = useState(false);
    const watchedId = watch("id");

    // Watch attendance_type and state_type for real-time value calculation
    const watchedAttendanceType = watch("attendance_type");
    const watchedStateType = watch("state_type");

    // Form action handler for create/update operations
    const [state, formAction] = useActionState(
    async (
        state: { success: boolean; error: boolean | string },
        payload: Patientschema
    ) => {
        if (type === "create") {
        return await createPatients(state, payload);
        } else {
        return await updatePatients(state, payload);
        }
    },
    { success: false, error: false }
    );

    // Form submission handler
    const onsubmit = handleSubmit(data => {
        startTransition(() => {
            formAction(data);
        });
    })

    // Helper function to format date for input field
    const formatDateForInput = (date: string | Date | undefined) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    };

    const router = useRouter();

    // Handle form submission results (success/error notifications)
    useEffect(() => {
        if(state.success){
            toast(`Paciente ${type === "create" ? "criado": "editado"}!`,
                { type: "success", autoClose: 2000, pauseOnHover: false, closeOnClick: true }
            );
            setOpen(false);
            router.refresh();
        }
        if(state.error && typeof state.error === "string"){
            toast.dismiss();
            toast(state.error,
                {
                    type: "error",
                    autoClose: 3000,
                    pauseOnHover: false,
                    closeOnClick: true,
                    toastId: "patient-form-error"
                }
            );
        }
    },[state, router, setOpen, type]);

    // Check for duplicate ID when creating a new patient
    useEffect(() => {
        if (type === "create" && watchedId && !isNaN(Number(watchedId))) {
            const checkId = async () => {
                setIsCheckingId(true);
                try {
                    const exists = await checkPatientIdExists(Number(watchedId));
                    if (exists) {
                        setError("id", {
                            type: "manual",
                            message: "Este ID já existe! Por favor, escolha outro ID."
                        });
                    } else {
                        clearErrors("id");
                    }
                } catch (error) {
                    console.error("Error checking ID:", error);
                } finally {
                    setIsCheckingId(false);
                }
            };

            const timeoutId = setTimeout(checkId, 500); // Debounce for 500ms
            return () => clearTimeout(timeoutId);
        }
    }, [watchedId, type, setError, clearErrors]);

    // Real-time value calculation based on attendance_type and state_type
    useEffect(() => {
        // Only auto-populate if both fields are selected and it's clinic attendance
        if (watchedAttendanceType === "Clinica" && watchedStateType) {
            let calculatedValue: number | null = null;

            // Value: 23.5 if attendance type is clinic and state type is Reformado or Estudante
            if (watchedStateType === "Reformado" || watchedStateType === "Estudante") {
                calculatedValue = 23.5;
            }
            // Value: 28.5 if attendance type is clinic and state type is Ativo
            else if (watchedStateType === "Ativo") {
                calculatedValue = 28.5;
            }

            // Set the calculated value
            if (calculatedValue !== null) {
                setValue("value", calculatedValue);
            }
        }
        // Clear value if attendance is not Clinica
        else if (watchedAttendanceType === "Domicilio") {
            setValue("value", null);
        }
    }, [watchedAttendanceType, watchedStateType, setValue]);

    return(
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold text-neutral text-center">{type === "create" ? "Criar um novo paciente" : "Editar o paciente"}</h1>
            {/*INPUTS DOS PACIENTES*/}
            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">
                        ID
                        <span className="text-red-500 ml-1">*</span>
                        {isCheckingId && type === "create" && <span className="text-blue-500 ml-2">Verificando...</span>}
                    </label>
                    <input
                        type="number"
                        {...register("id")}
                        className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${type === "update" ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}`}
                        defaultValue={data?.id}
                        readOnly={type === "update"}
                    />
                    {errors?.id?.message && <p className="text-xs text-red-400">{errors.id.message.toString()}</p>}
                </div>
                <InputField label="Email" inputName="email" defaultValue={data?.email} register={register} error={errors?.email}/>
                <InputField label="NIF" inputName="nif" type="number" defaultValue={data?.nif} register={register} error={errors?.nif}/>
                <InputField label="Nome do Paciente" inputName="name" defaultValue={data?.name} register={register} error={errors?.name} required={true}/>
                <InputField label="Telemovel" inputName="mobile_phone" type="string" defaultValue={data?.mobile_phone} register={register} error={errors?.mobile_phone}/>
                <InputField label="Telefone Fixo" inputName="landline_phone" type="string" defaultValue={data?.landline_phone} register={register} error={errors?.landline_phone}/>
                <InputField label="Cidade" inputName="city" defaultValue={data?.city} register={register} error={errors?.city}/>
                <InputField label="Codigo Postal" inputName="postal_code" defaultValue={data?.postal_code} register={register} error={errors?.postal_code}/>
                <InputField label="Morada" inputName="address_line1" defaultValue={data?.address_line1} register={register} error={errors?.address_line1}/>
                <InputField label="Complemento de Morada" inputName="address_line2" defaultValue={data?.address_line2} register={register} error={errors?.address_line2}/>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">
                        Genero
                    </label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data?.gender}>
                        <option value="">Selecionar...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                    {errors.gender?.message && <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">
                        Estado
                    </label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("state_type")} defaultValue={data?.state_type}>
                        <option value="">Selecionar...</option>
                        <option value="Reformado">Reformado</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Estudante">Estudante</option>
                    </select>
                    {errors.state_type?.message && <p className="text-xs text-red-400">{errors.state_type.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">
                        Atendimento
                    </label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("attendance_type")} defaultValue={data?.attendance_type}>
                        <option value="">Selecionar...</option>
                        <option value="Clinica">Clinica</option>
                        <option value="Domicilio">Domicilio</option>
                    </select>
                    {errors.attendance_type?.message && <p className="text-xs text-red-400">{errors.attendance_type.message.toString()}</p>}
                </div>
                <InputField label="Data de Nascimento" inputName="date_of_birth" type="date" defaultValue={formatDateForInput(data?.date_of_birth)} register={register} error={errors?.date_of_birth}/>
                <InputField label="Observações" inputName="observations" type="text" defaultValue={data?.observations} register={register} error={errors?.observations} />
                <InputField
                    label="Valor"
                    inputName="value"
                    type="number"
                    defaultValue={data?.value}
                    register={register}
                    error={errors?.value}
                    required={false}
                    inputProps={{ step: "0.01", min: "0", placeholder: "Ex: 12.30" }}
                />
                <InputField label="Profissão" inputName="profession" type="text" defaultValue={data?.profession} register={register} error={errors?.profession} />
                <InputField label="Família" inputName="family" type="text" defaultValue={data?.family} register={register} error={errors?.family} />
            </div>
            <button className="bg-blue text-white p-2 rounded-md">{type === "create" ? "Criar" : "Editar"}</button>
            
        </form>
    )
    
};

export default PatientForm
