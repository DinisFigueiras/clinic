#!/bin/bash

# Script to populate database with realistic data using curl
BASE_URL="https://clinica-sacavem.netlify.app"

echo "🚀 Starting database population with realistic clinic data..."

# Create realistic patients
echo "👥 Creating patients..."

# Patient 1: Maria Silva Santos
curl -X POST "$BASE_URL/api/patients/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 3,
    "email": "maria.santos@gmail.com",
    "name": "Maria Silva Santos",
    "gender": "Feminino",
    "date_of_birth": "1952-03-15",
    "mobile_phone": "912345678",
    "nif": "123456789",
    "state_type": "Reformado",
    "attendance_type": "Domicilio",
    "observations": "Hipertensão arterial controlada",
    "address_line1": "Rua das Flores, 15",
    "address_line2": "",
    "city": "Sacavém",
    "postal_code": "2685-123"
  }'

echo "✅ Created patient: Maria Silva Santos"

# Patient 2: João Manuel Costa
curl -X POST "$BASE_URL/api/patients/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 4,
    "email": "joao.costa@hotmail.com",
    "name": "João Manuel Costa",
    "gender": "Masculino",
    "date_of_birth": "1956-07-22",
    "mobile_phone": "913456789",
    "nif": "234567890",
    "state_type": "Reformado",
    "attendance_type": "Clinica",
    "observations": "Diabetes tipo 2",
    "address_line1": "Av. da República, 42",
    "address_line2": "",
    "city": "Loures",
    "postal_code": "2670-456"
  }'

echo "✅ Created patient: João Manuel Costa"

# Patient 3: Ana Beatriz Ferreira
curl -X POST "$BASE_URL/api/patients/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "email": "ana.ferreira@sapo.pt",
    "name": "Ana Beatriz Ferreira",
    "gender": "Feminino",
    "date_of_birth": "1979-11-08",
    "mobile_phone": "914567890",
    "nif": "345678901",
    "state_type": "Ativo",
    "attendance_type": "Clinica",
    "observations": "Alergia à penicilina",
    "address_line1": "Rua do Comércio, 8",
    "address_line2": "",
    "city": "Sacavém",
    "postal_code": "2685-789"
  }'

echo "✅ Created patient: Ana Beatriz Ferreira"

# Create realistic medications
echo "💊 Creating medications..."

# Medication 1: Paracetamol
curl -X POST "$BASE_URL/api/medications/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "name": "Paracetamol",
    "stock": 150,
    "type": "Analgésico",
    "dosage": "500mg",
    "price": 3.50,
    "supplier": "Farmácia Central"
  }'

echo "✅ Created medication: Paracetamol"

# Medication 2: Ibuprofeno
curl -X POST "$BASE_URL/api/medications/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 6,
    "name": "Ibuprofeno",
    "stock": 120,
    "type": "Anti-inflamatório",
    "dosage": "400mg",
    "price": 4.20,
    "supplier": "Medifarm"
  }'

echo "✅ Created medication: Ibuprofeno"

# Medication 3: Losartan
curl -X POST "$BASE_URL/api/medications/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 8,
    "name": "Losartan",
    "stock": 95,
    "type": "Anti-hipertensor",
    "dosage": "50mg",
    "price": 12.30,
    "supplier": "Medifarm"
  }'

echo "✅ Created medication: Losartan"

# Create realistic bookings
echo "📅 Creating bookings..."

# Today's appointment 1
TODAY=$(date +%Y-%m-%d)
curl -X POST "$BASE_URL/api/bookings/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"patient_id\": 3,
    \"medication_ids\": [8],
    \"attendance_type\": \"Domicilio\",
    \"booking_StartdateTime\": \"${TODAY}T09:00:00.000Z\",
    \"booking_EnddateTime\": \"${TODAY}T09:30:00.000Z\"
  }"

echo "✅ Created booking: Maria Silva Santos - Today 09:00"

# Today's appointment 2
curl -X POST "$BASE_URL/api/bookings/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"patient_id\": 5,
    \"medication_id\": 6,
    \"attendance_type\": \"Clinica\",
    \"booking_StartdateTime\": \"${TODAY}T10:30:00.000Z\",
    \"booking_EnddateTime\": \"${TODAY}T11:00:00.000Z\"
  }"

echo "✅ Created booking: Ana Beatriz Ferreira - Today 10:30"

# Tomorrow's appointment
TOMORROW=$(date -d "+1 day" +%Y-%m-%d)
curl -X POST "$BASE_URL/api/bookings/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"patient_id\": 4,
    \"medication_id\": 5,
    \"attendance_type\": \"Clinica\",
    \"booking_StartdateTime\": \"${TOMORROW}T08:30:00.000Z\",
    \"booking_EnddateTime\": \"${TOMORROW}T09:00:00.000Z\"
  }"

echo "✅ Created booking: João Manuel Costa - Tomorrow 08:30"

echo "🎉 Database population completed!"
echo "📊 Summary: 3 patients, 3 medications, 3 bookings created"
echo "🖼️ Your app should now have realistic data for portfolio screenshots!"
echo ""
echo "🌐 Visit your app: $BASE_URL/admin/"
