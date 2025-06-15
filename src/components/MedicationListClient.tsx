"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Table from "./Table";
import FormModal2 from "./FormModal2";

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
  const search = searchParams.get("search") || "";
  
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

  // Reset to initial data when search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setMedications(initialData);
      setIsSearching(false);
    }
  }, [search, initialData]);

  return (
    <div>
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredMedications} 
        sort={searchParams.get("sort") || undefined}
      />
      {filteredMedications.length === 0 && search && (
        <div className="text-center py-8 text-gray-500">
          {isSearching ? "A procurar..." : `Nenhum medicamento encontrado para "${search}"`}
        </div>
      )}
    </div>
  );
}
