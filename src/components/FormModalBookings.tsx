"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import Image from "next/image";
import { format } from "date-fns"; // Import date-fns for formatting dates

// Utility function to format date in Portuguese timezone (handles summer/winter time automatically)
const formatDateTimePortugal = (dateString: string) => {
  const date = new Date(dateString);
  // Use Intl.DateTimeFormat for proper timezone handling that automatically adjusts for DST
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const dateStr = `${parts.find(p => p.type === 'day')?.value}/${parts.find(p => p.type === 'month')?.value}/${parts.find(p => p.type === 'year')?.value}`;
  const timeStr = `${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}`;

  return {
    dateTime: `${dateStr} ${timeStr}`,
    time: timeStr
  };
};

// Utility function to format datetime for datetime-local input (handles timezone properly)
const formatForDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  // Use Intl.DateTimeFormat for proper timezone handling that automatically adjusts for DST
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const formatted = formatter.format(date);
  return formatted.replace(' ', 'T');
};

// Helper function to convert datetime-local to UTC ISO string properly
// Handles Europe/Lisbon timezone with DST support
const convertToUTCISO = (datetimeLocalString: string): string => {
  if (!datetimeLocalString || datetimeLocalString.trim() === "") {
    throw new Error("Data e hora são obrigatórias!");
  }

  // datetime-local format: "2025-06-10T08:00"
  // This represents LOCAL time in Portugal (Europe/Lisbon timezone)
  
  // Split on T to get date and time parts
  const [datePart, timePart] = datetimeLocalString.split('T');
  
  if (!datePart || !timePart) {
    throw new Error("Formato de data/hora inválido!");
  }

  // Parse date: YYYY-MM-DD
  const [year, month, day] = datePart.split('-').map(Number);
  
  // Parse time: HH:mm (with optional :ss)
  const timeParts = timePart.split(':').map(Number);
  const hour = timeParts[0] || 0;
  const minute = timeParts[1] || 0;
  const second = timeParts[2] || 0;

  // Validate the parsed values
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
    throw new Error("Formato de data/hora inválido!");
  }

  // To get Portugal's UTC offset for a specific date, we use a trick:
  // Create a date, format it in both UTC and Portugal timezone, then calculate offset
  const testDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  
  // Format in Portugal timezone to see what it looks like there
  const portugueseFormatter = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  
  const portugueseTime = portugueseFormatter.format(testDate);
  const [pYear, pMonth, pDay, pHour, pMinute, pSecond] = portugueseTime.split(/[-/\s:]/);
  
  // If the Portugal-formatted version doesn't match what we input, calculate the offset
  const inputHour = hour;
  const inputMinute = minute;
  const portugueseHour = parseInt(pHour);
  const portugueseMinute = parseInt(pMinute);
  
  // The offset tells us how many hours Portugal is ahead of UTC
  // offset = Portugal time - UTC time
  // We started with UTC, so: offset = formatted_hour - UTC_hour
  const offsetHours = portugueseHour - inputHour;
  
  // Now apply the offset to get the true UTC time
  // If input is 08:00 and offset is +1, then UTC is 08:00 - 1 = 07:00
  const trueUTCDate = new Date(Date.UTC(year, month - 1, day, hour - offsetHours, minute, second));
  
  if (isNaN(trueUTCDate.getTime())) {
    throw new Error("Data inválida!");
  }

  return trueUTCDate.toISOString();
};

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FormModalBookings = ({
  table,
  patients,
  products,
  prefilledPatient
}: {
  table: string;
  patients: any[];
  products: any[];
  prefilledPatient?: { id: number; name: string } | null;
}) => {
  const router = useRouter();
  
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
  const [loadingBookings, setLoadingBookings] = useState(false); // State for loading bookings
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null); // State for the booking to confirm deletion

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
        booking_StartdateTime: formatForDateTimeLocal(booking.booking_StartdateTime),
        booking_EnddateTime: formatForDateTimeLocal(booking.booking_EnddateTime),
      });
      setEditBookingId(bookingId);
    }
  };


  const fetchBookings = async () => {
    if (!selectedPatient) {
      alert("Selecione um paciente.");
      return;
    }

    setLoadingBookings(true);
    try {
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
    } finally {
      setLoadingBookings(false);
    }
  };

  // Initialize pre-filled patient if provided
  useEffect(() => {
    if (prefilledPatient) {
      setSelectedPatient({ value: prefilledPatient.id, label: prefilledPatient.name });
    }
  }, [prefilledPatient]);

  // Auto-fetch bookings when modal opens in edit or delete mode and patient is selected
  useEffect(() => {
    if (open && (mode === "edit" || mode === "delete") && selectedPatient) {
      fetchBookings();
    }
  }, [open, mode, selectedPatient]);

  const handleCreate = async () => {
    // Validate required fields
    if (!selectedPatient) {
      toast("Selecione um paciente!", { type: "error", autoClose: 2000 });
      return;
    }
    if (!attendanceType) {
      toast("Selecione o tipo de atendimento!", { type: "error", autoClose: 2000 });
      return;
    }
    if (!startDate || !endDate) {
      toast("Selecione data e hora!", { type: "error", autoClose: 2000 });
      return;
    }

    try {
      // Convert dates using the timezone conversion function
      const startISO = convertToUTCISO(startDate);
      const endISO = convertToUTCISO(endDate);

      const response = await fetch(`/api/${table}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: selectedPatient?.value,
          medication_ids: selectedProducts.map(p => p.value),
          attendance_type: attendanceType?.value,
          booking_StartdateTime: startISO,
          booking_EnddateTime: endISO,
        }),
      });

      if (response.ok) {
        toast("Marcação Criada com sucesso!",
          {type: "success", autoClose: 2000, pauseOnHover: false, closeOnClick: true}
        );
        setOpen(false); // Close the modal
        router.refresh(); // Refresh the page to show the new booking
      } else {
        const errorData = await response.json();
        toast(errorData.error || "Ocorreu um erro.", { type: "error", autoClose: 2000 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao criar a marcação.";
      toast(message, { type: "error", autoClose: 2000 });
    }
  };



  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
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
        router.refresh(); // Refresh the page to show the updated bookings
      } else {
        const errorData = await response.json();
        toast(errorData.error || "Ocorreu um erro ao apagar.", { type: "error", autoClose: 2000 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao apagar a marcação.";
      toast(message, { type: "error", autoClose: 2000 });
    }
  };

  const handleEdit = async () => {
    if (!editBookingId || !editForm) return;

    try {
      // Convert to ISO string using proper timezone handling
      const startISO = convertToUTCISO(editForm.booking_StartdateTime);
      const endISO = convertToUTCISO(editForm.booking_EnddateTime);

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
        router.refresh(); // Refresh the page to show the updated booking
      } else {
        const errorData = await response.json();
        toast(errorData.error || "Ocorreu um erro ao atualizar.", { type: "error", autoClose: 2000 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a marcação.";
      toast(message, { type: "error", autoClose: 2000 });
    }
  };

  const resetSelections = () => {
    // Don't reset selectedPatient if we have a prefilledPatient
    if (!prefilledPatient) {
      setSelectedPatient(null);
    }
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
        <i className="bi bi-calendar-check text-white text-sm"></i>
      </button>

      {/* Modal overlay and content */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg relative w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-center text-neutral">
              {mode === "create" ? "Criar Marcação" : mode === "edit" ? "Editar Marcação" : "Apagar Marcação"}
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
                  options={prefilledPatient
                    ? [{ value: prefilledPatient.id, label: prefilledPatient.name }]
                    : patients.map((p) => ({ value: p.id, label: p.name }))
                  }
                  value={selectedPatient}
                  onChange={prefilledPatient ? undefined : (option) => setSelectedPatient(option as { value: any; label: any })}
                  placeholder="Selecione um paciente..."
                  isDisabled={!!prefilledPatient}
                />
                {prefilledPatient && (
                  <p className="text-xs text-gray-500 mt-1">Este campo é preenchido automaticamente</p>
                )}
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
                  options={prefilledPatient
                    ? [{ value: prefilledPatient.id, label: prefilledPatient.name }]
                    : patients.map((p) => ({ value: p.id, label: p.name }))
                  }
                  value={selectedPatient}
                  onChange={prefilledPatient ? undefined : (option) => {
                    setSelectedPatient(option as { value: any; label: any });
                    setBookings([]);
                    setEditBookingId(null);
                    setEditForm(null);
                  }}
                  placeholder="Selecione um paciente..."
                  isDisabled={!!prefilledPatient}
                />
                {prefilledPatient && (
                  <p className="text-xs text-gray-500 mt-1">Este campo é preenchido automaticamente</p>
                )}
                {selectedPatient && bookings.length > 0 && !editBookingId && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-neutralLight">Marcações para {selectedPatient?.label}</h3>
                    <ul className="mt-2">
                      {bookings.map((booking) => (
                        <li key={booking.id} className="flex justify-between items-center border-b py-2">
                          <span className="text-sm text-neutral">
                            {(() => {
                              const startFormatted = formatDateTimePortugal(booking.booking_StartdateTime);
                              const endFormatted = formatDateTimePortugal(booking.booking_EnddateTime);
                              return `${startFormatted.dateTime} - ${endFormatted.time}`;
                            })()}
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
                {selectedPatient && loadingBookings && (
                  <div className="mt-4 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    <p className="text-sm text-neutralLight">A carregar marcações...</p>
                  </div>
                )}
                {selectedPatient && !loadingBookings && bookings.length === 0 && (
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
                  options={prefilledPatient
                    ? [{ value: prefilledPatient.id, label: prefilledPatient.name }]
                    : patients.map((p) => ({ value: p.id, label: p.name }))
                  }
                  value={selectedPatient}
                  onChange={prefilledPatient ? undefined : (option) => {
                    setSelectedPatient(option as { value: any; label: any });
                    setBookings([]);
                    setConfirmDeleteId(null);
                  }}
                  placeholder="Selecione um paciente..."
                  isDisabled={!!prefilledPatient}
                />
                {prefilledPatient && (
                  <p className="text-xs text-gray-500 mt-1">Este campo é preenchido automaticamente</p>
                )}
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
                ) : selectedPatient && loadingBookings ? (
                  <div className="mt-4 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    <p className="text-sm text-neutralLight">A carregar marcações...</p>
                  </div>
                ) : selectedPatient && !loadingBookings && bookings.length === 0 ? (
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


          </div>
        </div>
      )}
    </>
  );
};

export default FormModalBookings;