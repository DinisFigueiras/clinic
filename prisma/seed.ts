import { PrismaClient, Gender, PatientStat, PatientAttendance } from "@prisma/client";

// Create a fresh Prisma client for seeding with connection pooling disabled
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.includes('?')
        ? process.env.DATABASE_URL + "&prepared_statements=false&connection_limit=1&pool_timeout=0"
        : process.env.DATABASE_URL + "?prepared_statements=false&connection_limit=1&pool_timeout=0"
    }
  }
});

async function main() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data first
    console.log("Clearing existing data...");
    await prisma.bookings.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.medication.deleteMany({});
    console.log("Existing data cleared successfully!");
  } catch (error) {
    console.log("Note: Some tables might be empty already, continuing...");
  }

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

  // REALISTIC PATIENTS
  const patients = [
    { id: 1, name: "Maria Silva Santos", email: "maria.santos@gmail.com", gender: Gender.Feminino, age: 72, nif: "123456789", phone: "912345678", state: PatientStat.Reformado, attendance: PatientAttendance.Domicilio, address: "Rua das Flores, 15", city: "Sacavém", postal: "2685-123", obs: "Hipertensão arterial controlada" },
    { id: 2, name: "João Manuel Costa", email: "joao.costa@hotmail.com", gender: Gender.Masculino, age: 68, nif: "234567890", phone: "913456789", state: PatientStat.Reformado, attendance: PatientAttendance.Clinica, address: "Av. da República, 42", city: "Loures", postal: "2670-456", obs: "Diabetes tipo 2" },
    { id: 3, name: "Ana Beatriz Ferreira", email: "ana.ferreira@sapo.pt", gender: Gender.Feminino, age: 45, nif: "345678901", phone: "914567890", state: PatientStat.Ativo, attendance: PatientAttendance.Clinica, address: "Rua do Comércio, 8", city: "Sacavém", postal: "2685-789", obs: "Alergia à penicilina" },
    { id: 4, name: "Carlos Alberto Pereira", email: "carlos.pereira@gmail.com", gender: Gender.Masculino, age: 58, nif: "456789012", phone: "915678901", state: PatientStat.Ativo, attendance: PatientAttendance.Domicilio, address: "Largo da Igreja, 3", city: "Moscavide", postal: "2685-012", obs: "Problemas cardíacos" },
    { id: 5, name: "Isabel Maria Rodrigues", email: "isabel.rodrigues@outlook.com", gender: Gender.Feminino, age: 63, nif: "567890123", phone: "916789012", state: PatientStat.Reformado, attendance: PatientAttendance.Clinica, address: "Rua Nova, 27", city: "Sacavém", postal: "2685-345", obs: "Artrite reumatoide" },
    { id: 6, name: "António José Oliveira", email: "antonio.oliveira@gmail.com", gender: Gender.Masculino, age: 75, nif: "678901234", phone: "917890123", state: PatientStat.Reformado, attendance: PatientAttendance.Domicilio, address: "Travessa do Sol, 12", city: "Loures", postal: "2670-678", obs: "Medicação para tensão" },
    { id: 7, name: "Fernanda Lopes Martins", email: "fernanda.martins@sapo.pt", gender: Gender.Feminino, age: 52, nif: "789012345", phone: "918901234", state: PatientStat.Ativo, attendance: PatientAttendance.Clinica, address: "Rua Central, 56", city: "Sacavém", postal: "2685-901", obs: "Colesterol elevado" },
    { id: 8, name: "Manuel Francisco Sousa", email: "manuel.sousa@hotmail.com", gender: Gender.Masculino, age: 69, nif: "890123456", phone: "919012345", state: PatientStat.Reformado, attendance: PatientAttendance.Domicilio, address: "Beco das Rosas, 4", city: "Moscavide", postal: "2685-234", obs: "Insuficiência renal leve" },
    { id: 9, name: "Rosa Maria Gonçalves", email: "rosa.goncalves@gmail.com", gender: Gender.Feminino, age: 41, nif: "901234567", phone: "920123456", state: PatientStat.Ativo, attendance: PatientAttendance.Clinica, address: "Rua da Paz, 89", city: "Sacavém", postal: "2685-567", obs: "Enxaquecas frequentes" },
    { id: 10, name: "Pedro Miguel Alves", email: "pedro.alves@outlook.com", gender: Gender.Masculino, age: 55, nif: "012345678", phone: "921234567", state: PatientStat.Ativo, attendance: PatientAttendance.Domicilio, address: "Quinta do Vale, 18", city: "Loures", postal: "2670-890", obs: "Dores nas costas crónicas" },
    { id: 11, name: "Conceição Santos Lima", email: "conceicao.lima@sapo.pt", gender: Gender.Feminino, age: 78, nif: "123450987", phone: "922345678", state: PatientStat.Reformado, attendance: PatientAttendance.Domicilio, address: "Rua do Pinhal, 7", city: "Sacavém", postal: "2685-123", obs: "Osteoporose" },
    { id: 12, name: "Rui Carlos Mendes", email: "rui.mendes@gmail.com", gender: Gender.Masculino, age: 47, nif: "234561098", phone: "923456789", state: PatientStat.Ativo, attendance: PatientAttendance.Clinica, address: "Av. dos Descobrimentos, 33", city: "Moscavide", postal: "2685-456", obs: "Ansiedade controlada" },
    { id: 13, name: "Lurdes Fernanda Nunes", email: "lurdes.nunes@hotmail.com", gender: Gender.Feminino, age: 66, nif: "345672109", phone: "924567890", state: PatientStat.Reformado, attendance: PatientAttendance.Clinica, address: "Rua da Liberdade, 21", city: "Sacavém", postal: "2685-789", obs: "Fibromialgia" },
    { id: 14, name: "José António Ribeiro", email: "jose.ribeiro@outlook.com", gender: Gender.Masculino, age: 61, nif: "456783210", phone: "925678901", state: PatientStat.Reformado, attendance: PatientAttendance.Domicilio, address: "Largo do Mercado, 9", city: "Loures", postal: "2670-012", obs: "Próstata aumentada" },
    { id: 15, name: "Manuela Costa Dias", email: "manuela.dias@gmail.com", gender: Gender.Feminino, age: 49, nif: "567894321", phone: "926789012", state: PatientStat.Ativo, attendance: PatientAttendance.Clinica, address: "Rua do Rosário, 44", city: "Sacavém", postal: "2685-345", obs: "Tiróide hipoativa" }
  ];

  for (const patient of patients) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        gender: patient.gender,
        date_of_birth: new Date(new Date().setFullYear(new Date().getFullYear() - patient.age)),
        mobile_phone: patient.phone,
        nif: patient.nif,
        state_type: patient.state,
        attendance_type: patient.attendance,
        observations: patient.obs,
        address_line1: patient.address,
        address_line2: null,
        city: patient.city,
        postal_code: patient.postal
      },
    });
  }

  // REALISTIC MEDICATIONS
  const medications = [
    { id: 1, name: "Paracetamol", stock: 150, type: "Analgésico", dosage: "500mg", price: 3.50, supplier: "Farmácia Central" },
    { id: 2, name: "Ibuprofeno", stock: 120, type: "Anti-inflamatório", dosage: "400mg", price: 4.20, supplier: "Medifarm" },
    { id: 3, name: "Omeprazol", stock: 80, type: "Protetor gástrico", dosage: "20mg", price: 8.90, supplier: "Farmácia Central" },
    { id: 4, name: "Losartan", stock: 95, type: "Anti-hipertensor", dosage: "50mg", price: 12.30, supplier: "Medifarm" },
    { id: 5, name: "Metformina", stock: 110, type: "Antidiabético", dosage: "850mg", price: 6.75, supplier: "Farmácia São João" },
    { id: 6, name: "Sinvastatina", stock: 75, type: "Hipolipemiante", dosage: "20mg", price: 9.40, supplier: "Farmácia Central" },
    { id: 7, name: "Levotiroxina", stock: 60, type: "Hormona tiroideia", dosage: "75mcg", price: 11.20, supplier: "Medifarm" },
    { id: 8, name: "Amlodipina", stock: 85, type: "Anti-hipertensor", dosage: "5mg", price: 7.80, supplier: "Farmácia São João" },
    { id: 9, name: "Diclofenac", stock: 90, type: "Anti-inflamatório", dosage: "75mg", price: 5.60, supplier: "Farmácia Central" },
    { id: 10, name: "Furosemida", stock: 70, type: "Diurético", dosage: "40mg", price: 4.90, supplier: "Medifarm" },
    { id: 11, name: "Captopril", stock: 100, type: "Anti-hipertensor", dosage: "25mg", price: 6.30, supplier: "Farmácia São João" },
    { id: 12, name: "Insulina", stock: 45, type: "Antidiabético", dosage: "100UI/ml", price: 25.50, supplier: "Farmácia Central" },
    { id: 13, name: "Warfarina", stock: 55, type: "Anticoagulante", dosage: "5mg", price: 13.70, supplier: "Medifarm" },
    { id: 14, name: "Prednisona", stock: 65, type: "Corticosteroide", dosage: "20mg", price: 8.20, supplier: "Farmácia São João" },
    { id: 15, name: "Alprazolam", stock: 40, type: "Ansiolítico", dosage: "0.5mg", price: 15.90, supplier: "Farmácia Central" },
    { id: 16, name: "Cálcio + Vitamina D", stock: 130, type: "Suplemento", dosage: "600mg+400UI", price: 12.80, supplier: "Medifarm" },
    { id: 17, name: "Ferro", stock: 85, type: "Suplemento", dosage: "80mg", price: 7.40, supplier: "Farmácia São João" },
    { id: 18, name: "Vitamina B12", stock: 95, type: "Vitamina", dosage: "1000mcg", price: 9.60, supplier: "Farmácia Central" },
    { id: 19, name: "Ácido Fólico", stock: 110, type: "Vitamina", dosage: "5mg", price: 5.20, supplier: "Medifarm" },
    { id: 20, name: "Magnésio", stock: 75, type: "Suplemento", dosage: "400mg", price: 11.50, supplier: "Farmácia São João" }
  ];

  for (const med of medications) {
    await prisma.medication.create({
      data: {
        id: med.id,
        name: med.name,
        stock: med.stock,
        type: med.type,
        dosage: med.dosage,
        price: med.price,
        supplier: med.supplier
      },
    });
  }

  // REALISTIC BOOKINGS - Mix of past, present and future appointments
  const today = new Date();
  const bookings = [
    // Today's appointments
    { patient_id: 1, medication_id: 4, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30) },
    { patient_id: 3, medication_id: 2, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0) },
    { patient_id: 7, medication_id: 6, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30) },
    { patient_id: 12, medication_id: 15, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0) },

    // Tomorrow's appointments
    { patient_id: 2, medication_id: 5, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0) },
    { patient_id: 6, medication_id: 11, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30) },
    { patient_id: 9, medication_id: 1, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0) },

    // Day after tomorrow
    { patient_id: 4, medication_id: 13, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0) },
    { patient_id: 11, medication_id: 16, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 30) },
    { patient_id: 15, medication_id: 7, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 30) },

    // Next week appointments
    { patient_id: 5, medication_id: 14, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30) },
    { patient_id: 8, medication_id: 10, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 14, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 15, 0) },
    { patient_id: 13, medication_id: 9, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 11, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 12, 0) },
    { patient_id: 14, medication_id: 8, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 16, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 16, 30) },

    // Future appointments (next month)
    { patient_id: 1, medication_id: 4, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth() + 1, 5, 9, 0), end: new Date(today.getFullYear(), today.getMonth() + 1, 5, 9, 30) },
    { patient_id: 3, medication_id: 2, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth() + 1, 12, 10, 30), end: new Date(today.getFullYear(), today.getMonth() + 1, 12, 11, 0) },
    { patient_id: 7, medication_id: 6, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth() + 1, 18, 14, 0), end: new Date(today.getFullYear(), today.getMonth() + 1, 18, 14, 30) },
    { patient_id: 10, medication_id: 12, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth() + 1, 25, 15, 30), end: new Date(today.getFullYear(), today.getMonth() + 1, 25, 16, 0) },

    // Past appointments (for history)
    { patient_id: 2, medication_id: 5, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 8, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 0) },
    { patient_id: 6, medication_id: 11, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 11, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 11, 30) },
    { patient_id: 9, medication_id: 1, attendance: PatientAttendance.Clinica, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 15, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 16, 0) },
    { patient_id: 4, medication_id: 13, attendance: PatientAttendance.Domicilio, start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 9, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 10, 0) },
  ];

  for (const booking of bookings) {
    const newBooking = await prisma.bookings.create({
      data: {
        patient_id: booking.patient_id,
        attendance_type: booking.attendance,
        booking_StartdateTime: booking.start,
        booking_EnddateTime: booking.end,
      },
    });

    // Create medication relationship if medication exists
    if (booking.medication_id) {
      await prisma.bookingMedications.create({
        data: {
          booking_id: newBooking.id,
          medication_id: booking.medication_id,
        },
      });
    }
  }

  console.log("Seeding completed successfully with realistic clinic data!");
  console.log(`Created ${patients.length} patients, ${medications.length} medications, and ${bookings.length} bookings`);
}

main()
  .then(async () => {
    console.log("✅ Seeding completed successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });