"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FormModal2 from "@/components/FormModal2";
import Table from "@/components/Table";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";

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
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [patients, setPatients] = useState<Patient[]>(initialData);
  const [isSearching, setIsSearching] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  // Pagination logic
  const totalCount = filteredPatients.length;
  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);
  const startIndex = (page - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset to initial data when search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setPatients(initialData);
      setIsSearching(false);
    }
  }, [search, initialData]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (search.trim() && page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }
  }, [search, page, router, searchParams]);

  // Save scroll position before page changes
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position after page changes
  useEffect(() => {
    if (scrollPosition > 0) {
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [page, scrollPosition]);

  // Pagination controls with scroll preservation
  const changePage = (newPage: number) => {
    // Store current scroll position before navigation
    setScrollPosition(window.scrollY);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div>
      <Table
        columns={columns}
        renderRow={renderRow}
        data={paginatedPatients}
        sort={searchParams.get("sort") || undefined}
      />

      {/* No results message */}
      {filteredPatients.length === 0 && search && (
        <div className="text-center py-8 text-gray-500">
          {isSearching ? "A procurar..." : `Nenhum paciente encontrado para "${search}"`}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 flex items-center justify-between text-gray-500">
          <button
            disabled={!hasPrev}
            className="py-2 px-4 rounded-md bg-slate-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            onClick={() => changePage(page - 1)}
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageIndex = index + 1;
              return (
                <button
                  key={pageIndex}
                  className={`px-3 py-1 rounded-sm transition-colors ${
                    page === pageIndex
                      ? "bg-blue text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => changePage(pageIndex)}
                >
                  {pageIndex}
                </button>
              );
            })}
          </div>

          <button
            className="py-2 px-4 rounded-md bg-slate-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
            disabled={!hasNext}
            onClick={() => changePage(page + 1)}
          >
            Próximo →
          </button>
        </div>
      )}

      {/* Results info */}
      {totalCount > 0 && (
        <div className="text-center text-sm text-gray-500 pb-4">
          Mostrando {startIndex + 1}-{Math.min(endIndex, totalCount)} de {totalCount} pacientes
          {search && ` para "${search}"`}
        </div>
      )}
    </div>
  );
}
