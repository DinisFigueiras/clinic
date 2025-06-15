"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Table from "./Table";
import FormModal2 from "./FormModal2";
import { ITEM_PER_PAGE } from "@/lib/settings";

interface Medication {
  id: number;
  name: string;
  stock: number;
  type: string;
  dosage: string;
  price: number;
  supplier: string;
}

const columns = [
  {
    header: "Informação",
    accessor: "info"
  },
  {
    header: "Stock",
    accessor: "stock",
    className: "hidden md:table-cell"
  },
  {
    header: "Tipo de Medicamento",
    accessor: "type",
    className: "hidden md:table-cell"
  },
  {
    header: "Dosagem",
    accessor: "dosage",
    className: "hidden md:table-cell"
  },
  {
    header: "Preço",
    accessor: "price",
    className: "hidden lg:table-cell"
  },
  {
    header: "Fornecedor",
    accessor: "supplier",
    className: "hidden lg:table-cell"
  },
  {
    header: "Ações",
    accessor: "action"
  },
];

const renderRow = (item: Medication) => (
  <tr key={item.id} className="border-b border-gray-200 text-sm text-neutral hover:bg-over hover:cursor-pointer">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm font-light">{item.id}</p>
      </div>
    </td>
    <td className={`hidden md:table-cell ${item.stock < 5 ? "text-red-500 font-bold" : ""}`}>{item.stock}</td>
    <td className="hidden md:table-cell">{item.type}</td>
    <td className="hidden md:table-cell">{item.dosage}</td>
    <td className="hidden md:table-cell">{item?.price ? `${Number(item.price).toFixed(2)} €` : "€"}</td>
    <td className="hidden md:table-cell">{item.supplier}</td>
    <td>
      <div className="flex items-center gap-2">
        <FormModal2 table="medication" type="update" data={item} />
        <FormModal2 table="medication" type="delete" id={item.id} />
      </div>
    </td>
  </tr>
);

export default function MedicationListClient({ initialData }: { initialData: Medication[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [medications, setMedications] = useState<Medication[]>(initialData);
  const [isSearching, setIsSearching] = useState(false);

  // Client-side filtering for smooth experience
  const filteredMedications = search.trim()
    ? medications.filter(medication =>
        medication.name.toLowerCase().includes(search.toLowerCase()) ||
        medication.id.toString().includes(search) ||
        medication.type.toLowerCase().includes(search.toLowerCase()) ||
        medication.dosage.toLowerCase().includes(search.toLowerCase()) ||
        medication.supplier.toLowerCase().includes(search.toLowerCase())
      )
    : medications;

  // Pagination logic
  const totalCount = filteredMedications.length;
  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);
  const startIndex = (page - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const paginatedMedications = filteredMedications.slice(startIndex, endIndex);

  // Reset to initial data when search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setMedications(initialData);
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



  // Pagination controls with smooth scroll to top
  const changePage = (newPage: number) => {
    // First, smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Then navigate after scroll animation starts
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }, 200);
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div>
      <Table
        columns={columns}
        renderRow={renderRow}
        data={paginatedMedications}
        sort={searchParams.get("sort") || undefined}
      />

      {/* No results message */}
      {filteredMedications.length === 0 && search && (
        <div className="text-center py-8 text-gray-500">
          {isSearching ? "A procurar..." : `Nenhum medicamento encontrado para "${search}"`}
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, totalCount)} de {totalCount} medicamentos
          {search && ` para "${search}"`}
        </div>
      )}
    </div>
  );
}
