"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookingschema, Bookingschema } from "@/lib/formValidationSchemas";
import { createBookings } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const BookingsForm = ({
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
        setValue,
        formState: { errors },
        } = useForm<Bookingschema>({
        resolver: zodResolver(bookingschema),
        });

    const [state, formAction] = useActionState(createBookings, {
        success:false, error:false
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const onsubmit = handleSubmit(data =>{
        console.log("Form submitted with data:", data);
        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if(state.success){
            toast(`Marcação ${type === "create" ? "criada": "editada"}!`);
            setOpen(false);
            router.refresh();
        }
    },[state, router, setOpen, type]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            axios.get(`/api/patients?search=${searchQuery}`)
                .then(response => {
                    const results = Array.isArray(response.data) ? response.data : [];
                    console.log("Search results:", results); // Add this line
                    setSearchResults(results);
                })
                .catch(error => {
                    console.error("Error fetching search results:", error);
                    setSearchResults([]);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return(
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Criar uma nova marcação" : "Editar uma marcação"}</h1>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Procurar Paciente</label>
                <input
                    type="text"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Procurar Paciente..."
                />
                {searchResults.length > 0 && (
                    <ul className="bg-white border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto z-10">
                        {searchResults.map((patient) => (
                            <li
                                key={patient.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setValue("patient_id", patient.id);
                                    setValue("patient", patient.name);
                                    setSearchQuery("");
                                    setSearchResults([]);
                                }}
                            >
                                {patient.name} (ID: {patient.id})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {state.error && <span className="text-red-500">Erro ao criar o produto</span>}

            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
};

export default BookingsForm;