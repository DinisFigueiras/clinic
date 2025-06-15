"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormModal2 from "@/components/FormModal2";
import Table from "@/components/Table";
import Link from "next/link";

interface Patient {
  id: number;
  name: string;
  email: string | null;
  mobile_phone: string;
  landline_phone?: string | null; // Optional for backward compatibility
  nif?: string | null; // Optional for backward compatibility
  state_type?: string; // Optional for backward compatibility
  attendance_type?: string; // Optional for backward compatibility
  city?: string; // Optional for backward compatibility
}

const columns = [
  {
    header: "Informação",
    accessor: "info"
  },
  {
    header: "ID",
    accessor: "patientId",
    className: "hidden md:table-cell"
  },
  {
    header: "Telemovel",
    accessor: "phone",
    className: "hidden md:table-cell"
  },
  {
    header: "Estado",
    accessor: "state",
    className: "hidden md:table-cell"
  },
  {
    header: "Atendimento",
    accessor: "attendance",
    className: "hidden lg:table-cell"
  },
  {
    header: "NIF",
    accessor: "nif",
    className: "hidden lg:table-cell"
  },
  {
    header: "Cidade",
    accessor: "city",
    className: "hidden lg:table-cell"
  },
  {
    header: "Ações",
    accessor: "action"
  },
];

const renderRow = (item: Patient) => (
  <tr key={item.id} className="border-b border-gray-200 text-sm text-neutral hover:bg-over hover:cursor-pointer">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm font-light">{item.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.id}</td>
    <td className="hidden md:table-cell">{item.mobile_phone}</td>
    <td className="hidden md:table-cell">{item.state_type}</td>
    <td className="hidden md:table-cell">{item.attendance_type}</td>
    <td className="hidden md:table-cell">{item.nif}</td>
    <td className="hidden md:table-cell">{item.city}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`./${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blueLight">
            <i className="bi bi-eye"></i>
          </button>
        </Link>
        <FormModal2 table="patients" type="delete" id={item.id} />
      </div>
    </td>
  </tr>
);

export default function PatientListClient({ initialData }: { initialData: Patient[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [patients, setPatients] = useState<Patient[]>(initialData);
  const [isSearching, setIsSearching] = useState(false);

  // Client-side filtering for smooth experience
  const filteredPatients = search.trim()
    ? patients.filter(patient =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.mobile_phone.includes(search) ||
        (patient.landline_phone && patient.landline_phone.includes(search)) ||
        patient.id.toString().includes(search) ||
        (patient.email && patient.email.toLowerCase().includes(search.toLowerCase()))
      )
    : patients;

  // Reset to initial data when search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setPatients(initialData);
      setIsSearching(false);
    }
  }, [search, initialData]);



  return (
    <div>
      <Table
        columns={columns}
        renderRow={renderRow}
        data={filteredPatients}
        sort={searchParams.get("sort") || undefined}
      />
      {filteredPatients.length === 0 && search && (
        <div className="text-center py-8 text-gray-500">
          {isSearching ? "A procurar..." : `Nenhum paciente encontrado para "${search}"`}
        </div>
      )}
    </div>
  );
}
