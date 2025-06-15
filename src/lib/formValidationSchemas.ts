import { z } from "zod";

/**
 * Zod validation schemas for form data validation
 */

/**
 * Check if patient ID already exists in database via API
 */
export const checkPatientIdExists = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`/api/patients/check-id?id=${id}`);
        if (!response.ok) {
            throw new Error('Failed to check ID');
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking patient ID:", error);
        return false;
    }
};

// Patient form validation schema
export const patientschema = z.object({
    id: z.coerce.number().min(1, {message: "Id é obrigatório"}),
    email: z.string().optional().refine((val) => !val || val === "" || z.string().email().safeParse(val).success, {
        message: "Email inválido"
    }),
    name: z.string().min(3, { message: 'O nome do paciente têm de conter pelo menos 3 caracteres!' }).max(50, { message: 'O nome do paciente nao pode ter mais de 50 caracteres!' }),
    gender: z.string().optional().refine((val) => !val || val === "" || ["Masculino", "Feminino"].includes(val), {
        message: "Genero inválido"
    }),
    date_of_birth: z
      .string()
      .optional()
      .refine((val) => !val || val === "" || !isNaN(Date.parse(val)), { message: "Data de nascimento inválida" })
      .transform((val) => val && val !== "" ? new Date(val) : undefined)
      .refine(
        (date) => {
          if (!date) return true;
          const now = new Date();
          return date <= now;
        },
        { message: "A data de nascimento não pode ser no futuro" }
      )
      .refine(
        (date) => {
          if (!date) return true;
          const now = new Date();
          const minDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return date <= minDate;
        },
        { message: "O paciente deve ter pelo menos 1 ano" }
    ),
   mobile_phone: z
  .string()
  .optional()
  .refine((val) => !val || val === "" || (val.length === 9 && /^\d+$/.test(val)), { message: "Telemovel inválido (deve ter 9 dígitos)" }),
    landline_phone: z
  .string()
  .optional()
  .refine((val) => !val || val === "" || (val.length === 9 && /^\d+$/.test(val)), { message: "Telefone fixo inválido (deve ter 9 dígitos)" }),
    nif: z.string().optional().refine((val) => !val || val === "" || (val.length <= 9 && /^\d*$/.test(val)), {
        message: "NIF inválido (máximo 9 dígitos)"
    }),
    state_type: z.string().optional().refine((val) => !val || val === "" || ["Ativo", "Reformado", "Estudante"].includes(val), {
        message: "Estado inválido"
    }),
    attendance_type: z.string().optional().refine((val) => !val || val === "" || ["Clinica", "Domicilio"].includes(val), {
        message: "Tipo de atendimento inválido"
    }),
    observations: z.string().optional(),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional()
  });

export type Patientschema = z.infer<typeof patientschema>;

// Medication form validation schema
export const medicationschema = z.object({
    id: z.coerce.number().min(1, {message: "Id é obrigatório"}),
    name: z.string().min(1, { message: 'Nome do produto é obrigatório' }),
    stock: z.coerce.number().min(1, {message: "Stock é obrigatório"}),
    type:z.string().min(1, {message: "Tipo é obrigatório"}),
    dosage: z.string().min(1, {message: "Dosagem é obrigatório"}),
    price: z.coerce.number().min(0.01, {message: "Preço é obrigatório"}).multipleOf(0.01, {message: "Preço deve ter no máximo 2 casas decimais"}),
    supplier: z.string().min(1, {message: "Fornecedor é obrigatório"})
  });

export type Medicationschema = z.infer<typeof medicationschema>;

// Booking form validation schema
export const bookingschema = z.object({
    id: z.coerce.number(),
    patient_id: z.coerce.number().min(3, { message: 'O nome do paciente têm de conter pelo menos 3 caracteres!' }).max(20, { message: 'O nome do paciente nao pode ter mais de 50 caracteres!' }),
    patient: z.string().min(3, { message: 'O nome do paciente têm de conter pelo menos 3 caracteres!' }).max(20, { message: 'O nome do paciente nao pode ter mais de 50 caracteres!' }),
    medication_ids: z.array(z.coerce.number()).optional(),
    medications: z.array(z.string()).optional(),
    attendance_type: z.enum(["Clinica", "Domicilio"], {message: "Este campo é obrigatório!"}),
    booking_StartdateTime:  z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data de começo é obirgatória!" }).transform((val) => new Date(val)),
    booking_EnddateTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data de fim é obirgatória!" }).transform((val) => new Date(val)),
});

export type Bookingschema = z.infer<typeof bookingschema>;

