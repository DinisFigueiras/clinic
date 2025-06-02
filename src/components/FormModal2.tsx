"use client";

import { deleteBookings, deleteMedication, deletePatients } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Action map for deleting data
const deleteActionMap = {
  patients: deletePatients,
  medication: deleteMedication,
  bookings: deleteBookings,
};

// Dynamically loaded form components
const PatientForm = dynamic(() => import("./Forms/PatientForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MedicationForm = dynamic(() => import("./Forms/MedicationForm"), {
  loading: () => <h1>Loading...</h1>,
});
const BookingsForm = dynamic(() => import("./Forms/BookingForm3"), {
  loading: () => <h1>Loading...</h1>,
});

// Forms map that renders appropriate form based on table type
const forms: {
  [key: string]: (setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update", data?: any, patients?: any[], products?: any[]) => JSX.Element;
} = {
  patients: (setOpen, type, data) => <PatientForm type={type} data={data} setOpen={setOpen} />,
  medication: (setOpen, type, data) => <MedicationForm type={type} data={data} setOpen={setOpen} />,
  bookings: (setOpen, type, data, patients = [], products = []) => (
    <BookingsForm type={type} data={data} setOpen={setOpen} patients={patients} products={products} />
  ),
};

// FormModal component
const FormModal = ({
  table,
  type,
  data,
  id,
  patients = [], // Default to empty array if undefined
  products = [], // Default to empty array if undefined
}: {
  table: "patients" | "medication" | "bookings";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
  patients?: any[]; // Optional, default to empty array
  products?: any[]; // Optional, default to empty array
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = type === "create" ? "bg-blue" : type === "update" ? "bg-blueLight" : "bg-red-400";

  const [open, setOpenState] = useState(false); // Rename state variable to avoid conflict with prop

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], { success: false, error: false });
    const router = useRouter();
    

    useEffect(() => {
      if (state.success) {
        toast(`Produto apagado!`,
          {type: "error", autoClose: 2000, pauseOnHover: false, closeOnClick: true}
        );
        setOpenState(false); // Close the modal
        router.refresh();
      }
    }, [state, router]);

    // Message for delete action
    const deleteMessage =
      table === "patients"
        ? "Todos os dados guardados serão perdidos. Têm a certeza que pretende apagar este paciente?"
        : table === "medication"
        ? `Todos os dados guardados serão perdidos. Têm a certeza que pretende apagar este produto?`
        : `Todos os dados guardados serão perdidos. Têm a certeza que pretende apagar esta marcação?`;

    // Delete form
    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" defaultValue={id} hidden />
        <span className="text-center font-medium">{deleteMessage}</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Apagar
          <i className="bi bi-trash text-md ml-2"></i>
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpenState, type, data, patients, products) // Pass patients and products to the form
    ) : (
      "Tabela nao encontrada!"
    );
  };

  return (
    <>
      {/* Button to open the modal */}
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpenState(true)} // Update state when opening the modal
      >
        {type === "create" && <i className="bi bi-plus-lg text-lg"></i>}
        {type === "update" && <i className="bi bi-pencil-square text-sm"></i>}
        {type === "delete" && <i className="bi bi-trash text-md"></i>}
      </button>

      {/* Modal overlay and content */}
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            {/* Close button */}
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpenState(false)}>
              <i className="bi bi-x-lg"></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
