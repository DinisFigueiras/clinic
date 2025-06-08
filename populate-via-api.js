// Populate database via API calls to the live application
const BASE_URL = 'https://clinica-sacavem.netlify.app';

// Realistic patient data
const patients = [
    { id: 3, name: "Maria Silva Santos", email: "maria.santos@gmail.com", gender: "Feminino", age: 72, nif: "123456789", phone: "912345678", state: "Reformado", attendance: "Domicilio", address: "Rua das Flores, 15", city: "Sacavém", postal: "2685-123", obs: "Hipertensão arterial controlada" },
    { id: 4, name: "João Manuel Costa", email: "joao.costa@hotmail.com", gender: "Masculino", age: 68, nif: "234567890", phone: "913456789", state: "Reformado", attendance: "Clinica", address: "Av. da República, 42", city: "Loures", postal: "2670-456", obs: "Diabetes tipo 2" },
    { id: 5, name: "Ana Beatriz Ferreira", email: "ana.ferreira@sapo.pt", gender: "Feminino", age: 45, nif: "345678901", phone: "914567890", state: "Ativo", attendance: "Clinica", address: "Rua do Comércio, 8", city: "Sacavém", postal: "2685-789", obs: "Alergia à penicilina" },
    { id: 6, name: "Carlos Alberto Pereira", email: "carlos.pereira@gmail.com", gender: "Masculino", age: 58, nif: "456789012", phone: "915678901", state: "Ativo", attendance: "Domicilio", address: "Largo da Igreja, 3", city: "Moscavide", postal: "2685-012", obs: "Problemas cardíacos" },
    { id: 7, name: "Isabel Maria Rodrigues", email: "isabel.rodrigues@outlook.com", gender: "Feminino", age: 63, nif: "567890123", phone: "916789012", state: "Reformado", attendance: "Clinica", address: "Rua Nova, 27", city: "Sacavém", postal: "2685-345", obs: "Artrite reumatoide" },
    { id: 8, name: "António José Oliveira", email: "antonio.oliveira@gmail.com", gender: "Masculino", age: 75, nif: "678901234", phone: "917890123", state: "Reformado", attendance: "Domicilio", address: "Travessa do Sol, 12", city: "Loures", postal: "2670-678", obs: "Medicação para tensão" }
];

// Realistic medications
const medications = [
    { id: 5, name: "Paracetamol", stock: 150, type: "Analgésico", dosage: "500mg", price: 3.50, supplier: "Farmácia Central" },
    { id: 6, name: "Ibuprofeno", stock: 120, type: "Anti-inflamatório", dosage: "400mg", price: 4.20, supplier: "Medifarm" },
    { id: 7, name: "Omeprazol", stock: 80, type: "Protetor gástrico", dosage: "20mg", price: 8.90, supplier: "Farmácia Central" },
    { id: 8, name: "Losartan", stock: 95, type: "Anti-hipertensor", dosage: "50mg", price: 12.30, supplier: "Medifarm" },
    { id: 9, name: "Metformina", stock: 110, type: "Antidiabético", dosage: "850mg", price: 6.75, supplier: "Farmácia São João" },
    { id: 10, name: "Sinvastatina", stock: 75, type: "Hipolipemiante", dosage: "20mg", price: 9.40, supplier: "Farmácia Central" }
];

async function makeRequest(url, method, data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error with ${method} ${url}:`, error);
        throw error;
    }
}

async function createPatient(patient) {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - patient.age);
    
    const patientData = {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        gender: patient.gender,
        date_of_birth: birthDate.toISOString().split('T')[0],
        mobile_phone: patient.phone,
        nif: patient.nif,
        state_type: patient.state,
        attendance_type: patient.attendance,
        observations: patient.obs,
        address_line1: patient.address,
        address_line2: "",
        city: patient.city,
        postal_code: patient.postal
    };
    
    return await makeRequest(`${BASE_URL}/api/patients/create`, 'POST', patientData);
}

async function createMedication(medication) {
    return await makeRequest(`${BASE_URL}/api/medications/create`, 'POST', medication);
}

async function createBooking(booking) {
    return await makeRequest(`${BASE_URL}/api/bookings/create`, 'POST', booking);
}

async function populateDatabase() {
    console.log('🚀 Starting database population via API...');
    
    try {
        // Create patients
        console.log('👥 Creating patients...');
        for (const patient of patients) {
            try {
                await createPatient(patient);
                console.log(`✅ Created patient: ${patient.name}`);
            } catch (error) {
                console.log(`⚠️  Patient ${patient.name} might already exist or error occurred`);
            }
        }
        
        // Create medications
        console.log('💊 Creating medications...');
        for (const medication of medications) {
            try {
                await createMedication(medication);
                console.log(`✅ Created medication: ${medication.name}`);
            } catch (error) {
                console.log(`⚠️  Medication ${medication.name} might already exist or error occurred`);
            }
        }
        
        // Create bookings
        console.log('📅 Creating bookings...');
        const today = new Date();
        const bookings = [
            // Today's appointments
            { patient_id: 3, medication_id: 8, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30).toISOString() },
            { patient_id: 5, medication_id: 6, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString() },
            { patient_id: 7, medication_id: 10, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30).toISOString() },
            
            // Tomorrow's appointments
            { patient_id: 4, medication_id: 9, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0).toISOString() },
            { patient_id: 8, medication_id: 5, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30).toISOString() },
            { patient_id: 6, medication_id: 7, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0).toISOString() },
            
            // Day after tomorrow
            { patient_id: 7, medication_id: 8, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0).toISOString() },
            { patient_id: 3, medication_id: 6, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 30).toISOString() },
            
            // Next week appointments
            { patient_id: 5, medication_id: 9, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30).toISOString() },
            { patient_id: 4, medication_id: 10, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 14, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 15, 0).toISOString() }
        ];
        
        for (const booking of bookings) {
            try {
                await createBooking(booking);
                console.log(`✅ Created booking: Patient ${booking.patient_id} - ${booking.attendance_type} - ${new Date(booking.booking_StartdateTime).toLocaleString()}`);
            } catch (error) {
                console.log(`⚠️  Booking creation failed or already exists`);
            }
        }
        
        console.log('🎉 Database population completed!');
        console.log(`📊 Summary: ${patients.length} patients, ${medications.length} medications, ${bookings.length} bookings attempted`);
        console.log('🖼️  Your app should now have realistic data for portfolio screenshots!');
        
    } catch (error) {
        console.error('❌ Population failed:', error);
    }
}

// Check if we're running in Node.js environment
if (typeof window === 'undefined') {
    // Node.js environment - use node-fetch
    const fetch = require('node-fetch');
    global.fetch = fetch;
    populateDatabase();
} else {
    // Browser environment
    console.log('Run this script in Node.js environment');
}

module.exports = { populateDatabase };
