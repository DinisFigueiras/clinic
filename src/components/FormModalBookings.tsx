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
  const [mode, setMode] = useState<"create" | "delete" | "edit">("create"); // Toggle between create and delete modes
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<{ value: any; label: any } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<{ value: any; label: any }[]>([]);
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


  // Fetch booking details for editing
  const fetchBookingDetails = (bookingId: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      // Convert booking medications to the format expected by the multi-select
      const selectedMedications = booking.bookingMedications?.map((bm: any) => ({
        value: bm.medication.id,
        label: bm.medication.name
      })) || [];

      setEditForm({
        selectedMedications,
        attendance_type: booking.attendance_type,
        booking_StartdateTime: booking.booking_StartdateTime.slice(0, 16),
        booking_EnddateTime: booking.booking_EnddateTime.slice(0, 16),
      });
      setEditBookingId(bookingId);
    }
  };


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
        medication_ids: selectedProducts.map(p => p.value),
        attendance_type: attendanceType?.value,
        booking_StartdateTime: startDate,
        booking_EnddateTime: endDate,
      }),
    });

    if (response.ok) {
      toast("Marcação Criada com sucesso!",
        {type: "success", autoClose: 2000, pauseOnHover: false, closeOnClick: true}
      );
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
      toast(`Marcação apagada com sucesso!`,
        { type: "error", autoClose: 2000, pauseOnHover: false, closeOnClick: true }
      );
      setBookings((prev) => prev.filter((booking) => booking.id !== confirmDeleteId)); // Remove the deleted booking from the list
      setConfirmDeleteId(null); // Reset confirmation state
      
    } else {
      alert("Ocorreu um erro.");
    }
  };

  const handleEdit = async () => {
    if (!editBookingId || !editForm) return;

    // Convert to ISO string if not already
    const startISO = new Date(editForm.booking_StartdateTime).toISOString();
    const endISO = new Date(editForm.booking_EnddateTime).toISOString();

    const response = await fetch(`/api/${table}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editBookingId,
        medication_ids: editForm.selectedMedications?.map((m: any) => m.value) || [],
        attendance_type: editForm.attendance_type,
        booking_StartdateTime: startISO,
        booking_EnddateTime: endISO,
      }),
    });
    if (response.ok) {
      toast("Marcação atualizada com sucesso!", { type: "success", autoClose: 2000 });
      // Refresh the bookings to get updated data
      fetchBookings();
      setEditBookingId(null);
      setEditForm(null);
    } else {
      alert("Ocorreu um erro ao atualizar.");
    }
  };

  const resetSelections = () => {
    setSelectedPatient(null);
    setBookings([]);
    setEditBookingId(null);
    setEditForm(null);
    setConfirmDeleteId(null);
  };
  
  return (
    <>
      {/* Button to open the modal */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-blueLight hover:bg-blue transition-colors duration-200"
        onClick={() => setOpen(true)}
      >
      <Image src="/create.png" alt="Manage Bookings" width={16} height={16} />
      </button>

      {/* Modal overlay and content */}
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <h2 className="text-lg font-semibold text-center text-neutral">
              {mode === "create" ? "Criar Marcação" : "Apagar Marcação"}
            </h2>

            {/* Mode Toggle */}
            <div className="flex justify-between mt-4">
              <button
                className={`px-4 py-2 rounded ${mode === "create" ? "bg-blue text-white" : "bg-gray-200"}`}
                onClick={() => {setMode("create"); resetSelections();}}
              >
                Criar
              </button>
              
              <button
                className={`px-4 py-2 rounded ${mode === "edit" ? "bg-peach text-white" : "bg-gray-200"}`}
                onClick={() => {setMode("edit"); resetSelections();}}
              >
                Editar
              </button>
              <button
                className={`px-4 py-2 rounded ${mode === "delete" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                onClick={() => {setMode("delete"); resetSelections();}}
              >
                Apagar
              </button>
            </div>

            {/* Create Booking Form */}
            {mode === "create" && (
              <div className="mt-4 text-neutral">
                <label className="block text-sm font-medium">
                  Nome do Paciente
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  options={patients.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(option) => setSelectedPatient(option as { value: any; label: any })}
                />
                <label className="block text-sm font-medium mt-4">Medicação</label>
                <Select
                  isMulti
                  options={products.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(options) => setSelectedProducts(options ? [...options] : [])}
                  placeholder="Selecione medicações..."
                />
                <label className="block text-sm font-medium mt-4">
                  Atendimento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  options={attendanceOptions}
                  onChange={(option) => setAttendanceType(option)}
                />
                <label className="block text-sm font-medium mt-4">
                  Hora de Inicio
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label className="block text-sm font-medium mt-4">
                  Hora de Fim
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue hover:bg-blueLight transition-colors duration-200 text-white rounded"
                  onClick={handleCreate}
                >
                  Criar Marcação
                </button>
              </div>
            )}

            {/* Edit Booking Form */}
            {mode === "edit" && (
              <div className="mt-4 text-neutral">
                <label className="block text-sm font-medium">Escolher Paciente</label>
                <Select
                  options={patients.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(option) => {
                    setSelectedPatient(option as { value: any; label: any });
                    setBookings([]);
                    setEditBookingId(null);
                    setEditForm(null);
                  }}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue hover:bg-blueLight transition-colors duration-200 text-white rounded"
                  onClick={fetchBookings}
                >
                  Ver marcações
                </button>
                {selectedPatient && bookings.length > 0 && !editBookingId && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-neutralLight">Marcações para {selectedPatient?.label}</h3>
                    <ul className="mt-2">
                      {bookings.map((booking) => (
                        <li key={booking.id} className="flex justify-between items-center border-b py-2">
                          <span className="text-sm text-neutral">
                            {format(new Date(booking.booking_StartdateTime), "dd/MM/yyyy HH:mm")} -{" "}
                            {format(new Date(booking.booking_EnddateTime), "HH:mm")}
                          </span>
                          <button
                            className="px-2 py-1 bg-peach hover:bg-peachLight transition-colors duration-200 text-white rounded"
                            onClick={() => fetchBookingDetails(booking.id)}
                          >
                            Editar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {editBookingId && editForm && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <label className="block text-sm font-medium mt-2">Medicação</label>
                    <Select
                      isMulti
                      options={products.map((p) => ({ value: p.id, label: p.name }))}
                      value={editForm.selectedMedications || []}
                      onChange={(options) =>
                        setEditForm((prev: any) => ({ ...prev, selectedMedications: options ? [...options] : [] }))
                      }
                      placeholder="Selecione medicações..."
                    />
                    <label className="block text-sm font-medium mt-2">
                      Atendimento
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select
                      options={attendanceOptions}
                      value={attendanceOptions.find((opt) => opt.value === editForm.attendance_type)}
                      onChange={(option) =>
                        setEditForm((prev: any) => ({ ...prev, attendance_type: option?.value }))
                      }
                    />
                    <label className="block text-sm font-medium mt-2">
                      Hora de Inicio
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded"
                      value={editForm.booking_StartdateTime}
                      onChange={(e) =>
                        setEditForm((prev: any) => ({ ...prev, booking_StartdateTime: e.target.value }))
                      }
                    />
                    <label className="block text-sm font-medium mt-2">
                      Hora de Fim
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded"
                      value={editForm.booking_EnddateTime}
                      onChange={(e) =>
                        setEditForm((prev: any) => ({ ...prev, booking_EnddateTime: e.target.value }))
                      }
                    />
                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 text-neutral rounded"
                        onClick={() => {
                          setEditBookingId(null);
                          setEditForm(null);
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 text-white rounded"
                        onClick={handleEdit}
                      >
                        Guardar Alterações
                      </button>
                    </div>
                  </div>
                )}
                {selectedPatient && bookings.length === 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-neutralLight">
                      Este paciente não tem marcações.
                    </p>
                  </div>
                )}
                {!selectedPatient && (
                  <div className="mt-4">
                    <p className="text-sm text-neutralLight">
                      Selecione um paciente para ver as marcações.
                    </p>
                  </div>
                )}
              </div>
            )}



            {/* Delete Booking Form */}
            {mode === "delete" && (
              <div className="mt-4 text-neutral">
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
                  className="mt-4 px-4 py-2 bg-blue hover:bg-blueLight transition-colors duration-200 text-white rounded"
                  onClick={fetchBookings}
                >
                  Ver marcações
                </button>
                {selectedPatient && bookings.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-neutralLight">Marcações para {selectedPatient?.label}</h3>
                    <ul className="mt-2">
                      {bookings.map((booking) => (
                        <li key={booking.id} className="flex justify-between items-center border-b py-2">
                          <span className="text-sm text-neutral">
                            {format(new Date(booking.booking_StartdateTime), "dd/MM/yyyy HH:mm")} -{" "}
                            {format(new Date(booking.booking_EnddateTime), "HH:mm")}
                          </span>
                          <button
                            className="px-2 py-1 bg-red-600 hover:bg-red-400 transition-colors duration-200 text-white rounded"
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
                    <p className="text-sm text-neutralLight">
                      Este paciente não tem marcações.
                    </p>
                  </div>
                ) : !selectedPatient ? (
                <div className="mt-4">
                  <p className="text-sm text-neutralLight">
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
                        <p className="text-sm text-red-500 font-bold">
                          Tem certeza que deseja apagar esta marcação?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Detalhes da Marcação:</strong>
                        </p>
                        <p className="text-sm text-gray-500">
                          
                          Dia: {format(new Date(selectedBooking.booking_StartdateTime), "dd/MM/yyyy HH:mm")} -{" "}
                            {format(new Date(selectedBooking.booking_EnddateTime), "HH:mm")}
                        </p>
                      </div>
                    ))}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2  bg-gray-300  hover:bg-gray-400 transition-colors duration-200 text-neutral rounded"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-300 hover:bg-red-600 transition-colors duration-200 text-white rounded"
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