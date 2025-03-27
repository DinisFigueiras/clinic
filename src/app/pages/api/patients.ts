import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/prisma"; // Adjust path to your database connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { search } = req.query;
    console.log("Received search query:", search); // Debug

    if (!search || typeof search !== "string") {
      return res.status(400).json({ error: "Invalid search query" });
    }

    const patients = await db.patient.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
    });

    console.log("Patients Found:", patients);
    return res.status(200).json(patients);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
