"use client";

import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useRouter } from "next/navigation";

const fetchPatients = async (inputValue: string) => {
  try {
    const response = await fetch(`/api/patients?search=${inputValue}`);
    
    // Log the status code and status text for additional context
    console.log("Response Status:", response.status, response.statusText);

    // Check if response is OK (not an error or redirect)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Details:", errorText); // Log the body content on error
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Log the raw response before parsing
    const text = await response.text();
    console.log("Raw API Response:", text);

    // Ensure the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid JSON response");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};





const BookingsForm2 = () => {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client
  }, []);

  return (
    <form className="p-4">
      <label className="block mb-2">Select Patient:</label>

      {isClient && ( // Prevents AsyncSelect from rendering on the server
        <AsyncSelect
          cacheOptions
          loadOptions={fetchPatients}
          defaultOptions
          onChange={setSelectedPatient}
          placeholder="Search for a patient..."
        />
      )}

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default BookingsForm2;
