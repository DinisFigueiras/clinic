"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function SortButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");
  const nextSort = currentSort === "name_asc" ? "name_desc" : "name_asc";

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", nextSort);
    params.set("page", "1"); // reset to first page on sort
    router.push(`?${params.toString()}`);
  };

   // Add rotation if ascending
  const rotationClass = currentSort === "name_asc" ? "rotate-180" : "";

  return (
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-peach"
      onClick={handleClick}
      title="Ordenar por nome"
    >
      <Image src="/sort.png" alt="" width={14} height={14} className={rotationClass} style={{ transition: "transform 0.2s" }}/>
    </button>
  );
}