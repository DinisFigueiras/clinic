"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { bookingschema, Bookingschema } from "@/lib/formValidationSchemas";
import { createBookings, updateBookings } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Define the Option type for Patient and Medication
type OptionType = {
  label: string; // This will be the patient's name
  value: number; // This will be the patient's ID
};

const BookingsForm3 = ({ patients, products, type, data, setOpen }: { patients: any[], products: any[], type: "create" | "update", data?: any, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<OptionType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<OptionType | null>(null);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Use setValue to programmatically update form values
  } = useForm<Bookingschema>({
    resolver: zodResolver(bookingschema),
    defaultValues: data ?? {},  // If updating, use existing data as default
  });

  const [state, formAction] = useActionState(
    async (
      state: { success: boolean; error: boolean | string },
      payload: Bookingschema
    ) => {
      if (type === "create") {
        return await createBookings(state, payload);
      } else {
        return await updateBookings(state, payload);
      }
    },
    { success: false, error: false }
  );

  // Form submission handler with validation
  const onsubmit = handleSubmit((data) => {
    // Validate patient selection before submission
    if (data.patient_id === undefined || data.patient_id === null) {
      toast.error("Por favor selecione um paciente!");
      return;
    }

    startTransition(() => {
      formAction(data);
    });
  });
  

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Marcação ${type === "create" ? "criada" : "atualizada"} com sucesso!`,
        { type: "success", autoClose: 2000, pauseOnHover: false, closeOnClick: true }
      );
      setOpen(false);
      router.refresh();
    }
    if(state.error && typeof state.error === "string"){
      toast.dismiss();
      toast(state.error,
        { type: "error", autoClose: 3000, pauseOnHover: false, closeOnClick: true }
      );
    }
  }, [state, router, setOpen, type]);

  // Filter patients as the user types
  useEffect(() => {
    if (patientSearch) {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(patientSearch.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [patientSearch, patients]);

  // Filter products as the user types
  useEffect(() => {
    if (productSearch) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productSearch, products]);

  const handlePatientSelect = (selectedOption: OptionType | null) => {
    setSelectedPatient(selectedOption);
    setPatientSearch(selectedOption ? selectedOption.label : ''); // Update the search box with the selected name
  
    // Log selected patient to verify
    console.log("Selected Patient:", selectedOption);
  
    // Check if patient_id is properly selected
    const patientId = selectedOption ? selectedOption.value : undefined; // It could be undefined if no patient is selected
    
    // Set patient_id only if it's valid
    if (patientId !== undefined) {
      setValue("patient_id", patientId);
    }
  
    // Set patient_name only if selectedOption is valid
    setValue("patient", selectedOption ? selectedOption.label : "");
  };
  
  

  const handleProductSelect = (selectedOption: OptionType | null) => {
    setSelectedProduct(selectedOption);
    setProductSearch(selectedOption ? selectedOption.label : ''); // Update the search box with the selected name
  };

  const loadPatientOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
    const filteredOptions = filteredPatients
      .filter((patient) => patient.name.toLowerCase().includes(inputValue.toLowerCase()))
      .map((patient) => ({
        label: patient.name, // Name displayed in the dropdown
        value: patient.id, // ID sent to the form
      }));
    callback(filteredOptions); // Call the callback function with the filtered options
  };

  const loadProductOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
    const filteredOptions = filteredProducts
      .filter((product) => product.name.toLowerCase().includes(inputValue.toLowerCase()))
      .map((product) => ({
        label: product.name,
        value: product.id,
      }));
    callback(filteredOptions); // Call the callback function with the filtered options
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={onsubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Criar uma nova marcação" : "Editar uma marcação"}</h1>

      {/* Patient Selection */}
      <label className="block mb-2">
        Selecionar o paciente:
        <span className="text-red-500 ml-1">*</span>
      </label>
      <AsyncSelect
        cacheOptions
        value={selectedPatient}
        onInputChange={setPatientSearch}
        loadOptions={loadPatientOptions} // Use the updated loadOptions function
        onChange={handlePatientSelect}
        placeholder="Search for a patient..."
      />

      {/* Product Selection (Optional) */}
      <label className="block mt-4 mb-2">Selecionar o produto (opcional):</label>
      <AsyncSelect
        cacheOptions
        value={selectedProduct}
        onInputChange={setProductSearch}
        loadOptions={loadProductOptions} // Use the updated loadOptions function
        onChange={handleProductSelect}
        placeholder="Search for a product (optional)..."
        isClearable // Allow clearing the selection
      />

      {/* Start and End Time */}
      <label className="block mt-4 mb-2">
        Data de inicio da marcação:
        <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type="datetime-local"
        {...register("booking_StartdateTime")}
        className="p-2 border rounded"
      />
      {errors.booking_StartdateTime && <span className="text-red-500">{errors.booking_StartdateTime.message}</span>}

      <label className="block mt-4 mb-2">
        Data de fim da marcação:
        <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type="datetime-local"
        {...register("booking_EnddateTime")}
        className="p-2 border rounded"
      />
      {errors.booking_EnddateTime && <span className="text-red-500">{errors.booking_EnddateTime.message}</span>}

      {/* Attendance Type */}
      <label className="block mt-4 mb-2">
        Tipo de atendimento:
        <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        {...register("attendance_type")}
        className="p-2 border rounded"
      >
        <option value="Clinica">Clinica</option>
        <option value="Domicilio">Domicilio</option>
      </select>
      {errors.attendance_type && <span className="text-red-500">{errors.attendance_type.message}</span>}

      {state.error && <span className="text-red-500">Erro ao criar a marcação</span>}

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default BookingsForm3;
