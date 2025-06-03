import { PrismaClient, Gender, PatientStat, PatientAttendance } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "2",
      username: "admin2",
    },
  });

    // PATIENTS
    for (let i = 1; i <= 30; i++) {
        await prisma.patient.create({
        data: {
            id: i, // Unique ID for the patient
            email: `paciente${i}@gmail.com`,
            name: `Utente${i}`,
            gender: i % 2 === 0 ? Gender.Masculino : Gender.Feminino,
            date_of_birth: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
            mobile_phone: `123456789${i}`,
            nif: `12345678${i}`,
            state_type: i % 2 === 0 ? PatientStat.Ativo : PatientStat.Reformado,
            attendance_type: i % 2 === 0 ? PatientAttendance.Clinica : PatientAttendance.Domicilio,
            observations: `Observação nr:${i}`,
            address_line1: `Rua nr${i}`,
            address_line2: `Lote ${i}`,
            city: `Samora Correi${i}`,
            postal_code: `2135-${i}`
        },
        });
    }


  // MEDICAMENTOS
  for (let i = 1; i <= 20; i++) {
    await prisma.medication.create({
      data: {
        id: i, // Unique ID for the medicine
        name: `Nome${i}`,
        stock: i,
        type: `Tipo de medicamento nr${i}`,
        dosage: `${i}mg`,
        price: `${i}.50`,
        supplier: "Farmacia"
      },
    });
  }



  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });