"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function TableSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (query) {
        newParams.set("search", query);
      } else {
        newParams.delete("search");
      }
      router.push(`?${newParams.toString()}`);
    }, 150); // Debounce time: 300ms

    return () => clearTimeout(delayDebounce);
  }, [query, router, searchParams]);

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-neutral px-2">
    <Image src="/search.png" alt="" width={14} height={14}/>
    <input
        
        type="text"
        placeholder="Procurar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[200px] p-2 bg-transparent outline-none"
        />
    </div>
    
  );
}
