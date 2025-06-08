// Direct seeding script using the same approach as API routes
const { PrismaClient } = require('@prisma/client');

// Use the same connection approach as your working API routes
const prismaClientSingleton = () => {
    const baseUrl = process.env.DATABASE_URL || "";
    const url = baseUrl.includes('?')
        ? `${baseUrl}&prepared_statements=false&connection_limit=1`
        : `${baseUrl}?prepared_statements=false&connection_limit=1`;

    return new PrismaClient({
        log: ['error'],
        datasources: {
            db: { url }
        }
    });
};

const prisma = prismaClientSingleton();

async function withPrisma(operation) {
    try {
        return await operation(prisma);
    } finally {
        // Don't disconnect here, let it happen at the end
    }
}

async function main() {
    console.log("🚀 Starting database seeding with realistic clinic data...");

    try {
        // Clear existing data
        console.log("🧹 Clearing existing data...");
        await withPrisma(async (prisma) => {
            await prisma.bookings.deleteMany({});
            await prisma.patient.deleteMany({});
            await prisma.medication.deleteMany({});
        });
        console.log("✅ Existing data cleared!");

        // Create realistic patients
        console.log("👥 Creating realistic patients...");
        const patients = [
            { id: 3, name: "Maria Silva Santos", email: "maria.santos@gmail.com", gender: "Feminino", age: 72, nif: "123456789", phone: "912345678", state: "Reformado", attendance: "Domicilio", address: "Rua das Flores, 15", city: "Sacavém", postal: "2685-123", obs: "Hipertensão arterial controlada" },
            { id: 4, name: "João Manuel Costa", email: "joao.costa@hotmail.com", gender: "Masculino", age: 68, nif: "234567890", phone: "913456789", state: "Reformado", attendance: "Clinica", address: "Av. da República, 42", city: "Loures", postal: "2670-456", obs: "Diabetes tipo 2" },
            { id: 5, name: "Ana Beatriz Ferreira", email: "ana.ferreira@sapo.pt", gender: "Feminino", age: 45, nif: "345678901", phone: "914567890", state: "Ativo", attendance: "Clinica", address: "Rua do Comércio, 8", city: "Sacavém", postal: "2685-789", obs: "Alergia à penicilina" },
            { id: 6, name: "Carlos Alberto Pereira", email: "carlos.pereira@gmail.com", gender: "Masculino", age: 58, nif: "456789012", phone: "915678901", state: "Ativo", attendance: "Domicilio", address: "Largo da Igreja, 3", city: "Moscavide", postal: "2685-012", obs: "Problemas cardíacos" },
            { id: 7, name: "Isabel Maria Rodrigues", email: "isabel.rodrigues@outlook.com", gender: "Feminino", age: 63, nif: "567890123", phone: "916789012", state: "Reformado", attendance: "Clinica", address: "Rua Nova, 27", city: "Sacavém", postal: "2685-345", obs: "Artrite reumatoide" },
            { id: 8, name: "António José Oliveira", email: "antonio.oliveira@gmail.com", gender: "Masculino", age: 75, nif: "678901234", phone: "917890123", state: "Reformado", attendance: "Domicilio", address: "Travessa do Sol, 12", city: "Loures", postal: "2670-678", obs: "Medicação para tensão" },
            { id: 9, name: "Fernanda Lopes Martins", email: "fernanda.martins@sapo.pt", gender: "Feminino", age: 52, nif: "789012345", phone: "918901234", state: "Ativo", attendance: "Clinica", address: "Rua Central, 56", city: "Sacavém", postal: "2685-901", obs: "Colesterol elevado" },
            { id: 10, name: "Manuel Francisco Sousa", email: "manuel.sousa@hotmail.com", gender: "Masculino", age: 69, nif: "890123456", phone: "919012345", state: "Reformado", attendance: "Domicilio", address: "Beco das Rosas, 4", city: "Moscavide", postal: "2685-234", obs: "Insuficiência renal leve" }
        ];

        for (const patient of patients) {
            await withPrisma(async (prisma) => {
                const birthDate = new Date();
                birthDate.setFullYear(birthDate.getFullYear() - patient.age);
                
                await prisma.patient.create({
                    data: {
                        id: patient.id,
                        email: patient.email,
                        name: patient.name,
                        gender: patient.gender,
                        date_of_birth: birthDate,
                        mobile_phone: patient.phone,
                        nif: patient.nif,
                        state_type: patient.state,
                        attendance_type: patient.attendance,
                        observations: patient.obs,
                        address_line1: patient.address,
                        address_line2: null,
                        city: patient.city,
                        postal_code: patient.postal
                    }
                });
            });
            console.log(`✅ Created patient: ${patient.name}`);
        }

        // Create realistic medications
        console.log("💊 Creating realistic medications...");
        const medications = [
            { id: 5, name: "Paracetamol", stock: 150, type: "Analgésico", dosage: "500mg", price: 3.50, supplier: "Farmácia Central" },
            { id: 6, name: "Ibuprofeno", stock: 120, type: "Anti-inflamatório", dosage: "400mg", price: 4.20, supplier: "Medifarm" },
            { id: 7, name: "Omeprazol", stock: 80, type: "Protetor gástrico", dosage: "20mg", price: 8.90, supplier: "Farmácia Central" },
            { id: 8, name: "Losartan", stock: 95, type: "Anti-hipertensor", dosage: "50mg", price: 12.30, supplier: "Medifarm" },
            { id: 9, name: "Metformina", stock: 110, type: "Antidiabético", dosage: "850mg", price: 6.75, supplier: "Farmácia São João" },
            { id: 10, name: "Sinvastatina", stock: 75, type: "Hipolipemiante", dosage: "20mg", price: 9.40, supplier: "Farmácia Central" },
            { id: 11, name: "Levotiroxina", stock: 60, type: "Hormona tiroideia", dosage: "75mcg", price: 11.20, supplier: "Medifarm" },
            { id: 12, name: "Amlodipina", stock: 85, type: "Anti-hipertensor", dosage: "5mg", price: 7.80, supplier: "Farmácia São João" }
        ];

        for (const med of medications) {
            await withPrisma(async (prisma) => {
                await prisma.medication.create({
                    data: {
                        id: med.id,
                        name: med.name,
                        stock: med.stock,
                        type: med.type,
                        dosage: med.dosage,
                        price: med.price,
                        supplier: med.supplier
                    }
                });
            });
            console.log(`✅ Created medication: ${med.name}`);
        }

        // Create realistic bookings
        console.log("📅 Creating realistic bookings...");
        const today = new Date();
        const bookings = [
            // Today's appointments
            { patient_id: 3, medication_id: 8, attendance: "Domicilio", start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30) },
            { patient_id: 5, medication_id: 6, attendance: "Clinica", start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0) },
            { patient_id: 9, medication_id: 10, attendance: "Clinica", start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30) },
            
            // Tomorrow's appointments
            { patient_id: 4, medication_id: 9, attendance: "Clinica", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0) },
            { patient_id: 8, medication_id: 5, attendance: "Domicilio", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30) },
            { patient_id: 6, medication_id: 12, attendance: "Domicilio", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0) },
            
            // Day after tomorrow
            { patient_id: 7, medication_id: 7, attendance: "Clinica", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0) },
            { patient_id: 10, medication_id: 11, attendance: "Domicilio", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 30) },
            
            // Next week appointments
            { patient_id: 3, medication_id: 8, attendance: "Domicilio", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30) },
            { patient_id: 5, medication_id: 6, attendance: "Clinica", start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 14, 30), end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 15, 0) }
        ];

        for (const booking of bookings) {
            await withPrisma(async (prisma) => {
                await prisma.bookings.create({
                    data: {
                        patient_id: booking.patient_id,
                        medication_id: booking.medication_id,
                        attendance_type: booking.attendance,
                        booking_StartdateTime: booking.start,
                        booking_EnddateTime: booking.end
                    }
                });
            });
            console.log(`✅ Created booking: Patient ${booking.patient_id} - ${booking.attendance} - ${booking.start.toLocaleString()}`);
        }

        console.log("🎉 Database seeding completed successfully!");
        console.log(`📊 Summary: ${patients.length} patients, ${medications.length} medications, ${bookings.length} bookings created`);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .then(() => {
        console.log("✅ Seeding process completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Seeding process failed:", error);
        process.exit(1);
    });
