"use client";

import { useState } from "react";
import Select from "react-select";
import Image from "next/image";
import { format } from "date-fns"; // Import date-fns for formatting dates
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FormModalBookings = ({
  table,
  patients,
  products
}: {
  table: string;
  patients: any[];
  products: any[];
}) => {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [mode, setMode] = useState<"create" | "delete">("create"); // Toggle between create and delete modes
  const [selectedPatient, setSelectedPatient] = useState<{ value: any; label: any } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ value: any; label: any } | null>(null);
  const [attendanceType, setAttendanceType] = useState<{ value: string; label: string } | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookings, setBookings] = useState<any[]>([]); // State to store bookings for the selected patient
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null); // State for the booking to confirm deletion


  const router = useRouter();

  const attendanceOptions = [
    { value: "Clinica", label: "Clínica" },
    { value: "Domicilio", label: "Domicílio" },
  ];

  const fetchBookings = async () => {
    if (!selectedPatient) {
      alert("Selecione um paciente.");
      return;
    }

    const response = await fetch(`/api/bookings/by-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientName: selectedPatient.label }),
    });

    if (response.ok) {
      const data = await response.json();
      setBookings(data);
    } else {
      alert("Erro ao tentar ver as marcações deste paciente.");
    }
  };


  const handleCreate = async () => {
    const response = await fetch(`/api/${table}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: selectedPatient?.value,
        medication_id: selectedProduct?.value,
        attendance_type: attendanceType?.value,
        booking_StartdateTime: startDate,
        booking_EnddateTime: endDate,
      }),
    });

    if (response.ok) {
      toast("Marcação Criada com sucesso!");
      setOpen(false); // Close the modal
    } else {
      alert("Ocorreu um erro.");
    }
  };


  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    const response = await fetch(`/api/${table}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: confirmDeleteId }),
    });

    if (response.ok) {
      toast(`Marcação apagada com sucesso!`);
      setBookings((prev) => prev.filter((booking) => booking.id !== confirmDeleteId)); // Remove the deleted booking from the list
      setConfirmDeleteId(null); // Reset confirmation state
      
    } else {
      alert("Ocorreu um erro.");
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500"
        onClick={() => setOpen(true)}
      >
      <Image src="/create.png" alt="Manage Bookings" width={16} height={16} />
      </button>

      {/* Modal overlay and content */}
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "Criar Marcação" : "Apagar Marcação"}
            </h2>

            {/* Mode Toggle */}
            <div className="flex justify-between mt-4">
              <button
                className={`px-4 py-2 rounded ${mode === "create" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("create")}
              >
                Criar
              </button>
              <button
                className={`px-4 py-2 rounded ${mode === "delete" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("delete")}
              >
                Apagar
              </button>
            </div>

            {/* Create Booking Form */}
            {mode === "create" && (
              <div className="mt-4">
                <label className="block text-sm font-medium">Nome do Paciente</label>
                <Select
                  options={patients.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(option) => setSelectedPatient(option as { value: any; label: any })}
                />
                <label className="block text-sm font-medium mt-4">Medicação</label>
                <Select
                  options={products.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(option) => setSelectedProduct(option)}
                />
                <label className="block text-sm font-medium mt-4">Atendimento</label>
                <Select
                  options={attendanceOptions}
                  onChange={(option) => setAttendanceType(option)}
                />
                <label className="block text-sm font-medium mt-4">Hora de Inicio</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label className="block text-sm font-medium mt-4">Hora de Fim</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleCreate}
                >
                  Criar Marcação
                </button>
              </div>
            )}

            {/* Delete Booking Form */}
            {mode === "delete" && (
              <div className="mt-4">
                <label className="block text-sm font-medium">Escolher Paciente</label>
                <Select
                  options={patients.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(option) => {
                    setSelectedPatient(option as { value: any; label: any });
                    setBookings([]);
                    setConfirmDeleteId(null); 
                  }}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={fetchBookings}
                >
                  Ver marcações
                </button>
                {selectedPatient && bookings.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Marcações para {selectedPatient?.label}</h3>
                    <ul className="mt-2">
                      {bookings.map((booking) => (
                        <li key={booking.id} className="flex justify-between items-center border-b py-2">
                          <span>
                            {format(new Date(booking.booking_StartdateTime), "dd/MM/yyyy HH:mm")} -{" "}
                            {format(new Date(booking.booking_EnddateTime), "dd/MM/yyyy HH:mm")}
                          </span>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={() => setConfirmDeleteId(booking.id)}
                          >
                            Apagar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : selectedPatient && bookings.length === 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Este paciente não tem marcações.
                    </p>
                  </div>
                ) : !selectedPatient ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Selecione um paciente para ver as marcações.
                  </p>
                </div>
              ): null}
              </div>
            )}

            {/* Delete Confirmation Form */}
            {confirmDeleteId && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                 {bookings
                    .filter((booking) => booking.id === confirmDeleteId)
                    .map((selectedBooking) => (
                      <div key={selectedBooking.id}>
                        <p className="text-sm text-gray-700">
                          Tem certeza que deseja apagar esta marcação?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Detalhes da Marcação:</strong>
                        </p>
                        <p className="text-sm text-gray-500">
                          Início: {format(new Date(selectedBooking.booking_StartdateTime), "dd/MM/yyyy HH:mm")}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fim: {format(new Date(selectedBooking.booking_EnddateTime), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                    ))}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleDelete}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {/* Close button */}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModalBookings;