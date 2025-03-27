import { NextApiRequest, NextApiResponse } from "next";
import  prisma  from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const search = req.query.search as string || "";

  try {
    const medications = await prisma.medication.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
      select: { id: true, name: true },
      take: 10, // Limit results
    });

    res.status(200).json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
