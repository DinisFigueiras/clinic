// Script to populate the database with realistic clinic data via API calls
const BASE_URL = 'https://clinica-sacavem.netlify.app';

// Realistic Portuguese patients
const patients = [
  { id: 1, name: "Maria Silva Santos", email: "maria.santos@gmail.com", gender: "Feminino", age: 72, nif: "123456789", phone: "912345678", state: "Reformado", attendance: "Domicilio", address: "Rua das Flores, 15", city: "Sacavém", postal: "2685-123", obs: "Hipertensão arterial controlada" },
  { id: 2, name: "João Manuel Costa", email: "joao.costa@hotmail.com", gender: "Masculino", age: 68, nif: "234567890", phone: "913456789", state: "Reformado", attendance: "Clinica", address: "Av. da República, 42", city: "Loures", postal: "2670-456", obs: "Diabetes tipo 2" },
  { id: 3, name: "Ana Beatriz Ferreira", email: "ana.ferreira@sapo.pt", gender: "Feminino", age: 45, nif: "345678901", phone: "914567890", state: "Ativo", attendance: "Clinica", address: "Rua do Comércio, 8", city: "Sacavém", postal: "2685-789", obs: "Alergia à penicilina" },
  { id: 4, name: "Carlos Alberto Pereira", email: "carlos.pereira@gmail.com", gender: "Masculino", age: 58, nif: "456789012", phone: "915678901", state: "Ativo", attendance: "Domicilio", address: "Largo da Igreja, 3", city: "Moscavide", postal: "2685-012", obs: "Problemas cardíacos" },
  { id: 5, name: "Isabel Maria Rodrigues", email: "isabel.rodrigues@outlook.com", gender: "Feminino", age: 63, nif: "567890123", phone: "916789012", state: "Reformado", attendance: "Clinica", address: "Rua Nova, 27", city: "Sacavém", postal: "2685-345", obs: "Artrite reumatoide" },
  { id: 6, name: "António José Oliveira", email: "antonio.oliveira@gmail.com", gender: "Masculino", age: 75, nif: "678901234", phone: "917890123", state: "Reformado", attendance: "Domicilio", address: "Travessa do Sol, 12", city: "Loures", postal: "2670-678", obs: "Medicação para tensão" },
  { id: 7, name: "Fernanda Lopes Martins", email: "fernanda.martins@sapo.pt", gender: "Feminino", age: 52, nif: "789012345", phone: "918901234", state: "Ativo", attendance: "Clinica", address: "Rua Central, 56", city: "Sacavém", postal: "2685-901", obs: "Colesterol elevado" },
  { id: 8, name: "Manuel Francisco Sousa", email: "manuel.sousa@hotmail.com", gender: "Masculino", age: 69, nif: "890123456", phone: "919012345", state: "Reformado", attendance: "Domicilio", address: "Beco das Rosas, 4", city: "Moscavide", postal: "2685-234", obs: "Insuficiência renal leve" },
  { id: 9, name: "Rosa Maria Gonçalves", email: "rosa.goncalves@gmail.com", gender: "Feminino", age: 41, nif: "901234567", phone: "920123456", state: "Ativo", attendance: "Clinica", address: "Rua da Paz, 89", city: "Sacavém", postal: "2685-567", obs: "Enxaquecas frequentes" },
  { id: 10, name: "Pedro Miguel Alves", email: "pedro.alves@outlook.com", gender: "Masculino", age: 55, nif: "012345678", phone: "921234567", state: "Ativo", attendance: "Domicilio", address: "Quinta do Vale, 18", city: "Loures", postal: "2670-890", obs: "Dores nas costas crónicas" }
];

// Realistic medications
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
  { id: 10, name: "Furosemida", stock: 70, type: "Diurético", dosage: "40mg", price: 4.90, supplier: "Medifarm" }
];

// Function to create realistic bookings
function createBookings() {
  const today = new Date();
  return [
    // Today's appointments
    { patient_id: 1, medication_id: 4, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30).toISOString() },
    { patient_id: 3, medication_id: 2, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString() },
    { patient_id: 7, medication_id: 6, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30).toISOString() },
    
    // Tomorrow's appointments
    { patient_id: 2, medication_id: 5, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0).toISOString() },
    { patient_id: 6, medication_id: 1, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30).toISOString() },
    
    // Next week appointments
    { patient_id: 5, medication_id: 3, attendance_type: "Clinica", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 0).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30).toISOString() },
    { patient_id: 8, medication_id: 10, attendance_type: "Domicilio", booking_StartdateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 14, 30).toISOString(), booking_EnddateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 15, 0).toISOString() }
  ];
}

async function populateDatabase() {
  console.log('🚀 Starting database population...');
  
  try {
    // Create patients
    console.log('👥 Creating patients...');
    for (const patient of patients) {
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
      
      console.log(`Creating patient: ${patient.name}`);
      // Note: You'll need to manually create these through the UI since we don't have direct API access
    }
    
    console.log('💊 Medication data ready...');
    for (const med of medications) {
      console.log(`Medication: ${med.name} - ${med.dosage} - Stock: ${med.stock}`);
    }
    
    console.log('📅 Booking data ready...');
    const bookings = createBookings();
    for (const booking of bookings) {
      console.log(`Booking: Patient ${booking.patient_id} - ${booking.attendance_type} - ${new Date(booking.booking_StartdateTime).toLocaleString()}`);
    }
    
    console.log('✅ Data preparation complete! Please use the UI to create this data.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the population
populateDatabase();
