import { z } from "zod";

export const PseSchema = z.object({
    ticketId: z.string().min(1, "El ID del ticket es requerido"),

    userType: z.enum(["person", "business"], {
        required_error: "El tipo de usuario es requerido",
        invalid_type_error: "Selecciona un tipo de usuario válido",
    }),

    amount: z.number({
        required_error: "El monto es requerido",
        invalid_type_error: "El monto debe ser un número",
    }).positive("El monto debe ser mayor a 0"),

    paymentDescription: z.string().min(1, "La descripción del pago es requerida"),

    identificationType: z.string().min(1, "El tipo de identificación es requerido"),

    identificationNumber: z.string()
        .min(1, "El número de identificación es requerido")
        .regex(/^[0-9]+$/, "El número de identificación solo debe contener números"),

    name: z.string()
        .min(1, "El nombre es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres"),

    phone: z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
        .min(7, "El teléfono debe tener al menos 7 dígitos"),

    email: z.string()
        .min(1, "El email es requerido")
        .email("Ingresa un email válido"),

    address: z.string()
        .min(1, "La dirección es requerida")
        .min(5, "La dirección debe tener al menos 5 caracteres"),

    financialInstitutionCode: z.string()
        .min(1, "Debes seleccionar un banco")
        .refine((val) => val !== "0", "Debes seleccionar un banco"),

    financialInstitutionName: z.string().min(1, "El nombre del banco es requerido"),

    acceptTerms: z.boolean()
        .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
    idUrlGenerated: z.number().nullable(),
    recaptchaToken: z.string({
        required_error: "Confirma que no eres un robot",
        invalid_type_error: "Confirma que no eres un robot",
    }).min(1, "Confirma que no eres un robot")
});


export const PseServiceSchema = z.object({
    ticketId: z.string().min(1, "El ID del ticket es requerido"),
    userType: z.enum(["person", "company"], {
        required_error: "El tipo de usuario es requerido",
        invalid_type_error: "Selecciona un tipo de usuario válido",
    }),
    amount: z.number({
        required_error: "El monto es requerido",
        invalid_type_error: "El monto debe ser un número",
    }).positive("El monto debe ser mayor a 0"),
    paymentDescription: z.string().min(1, "La descripción del pago es requerida"),
    identificationType: z.string().min(1, "El tipo de identificación es requerido"),
    identificationNumber: z.string()
        .min(1, "El número de identificación es requerido")
        .regex(/^[0-9]+$/, "El número de identificación solo debe contener números"),
    name: z.string()
        .min(1, "El nombre es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
    phone: z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
        .min(7, "El teléfono debe tener al menos 7 dígitos"),
    email: z.string()
        .min(1, "El email es requerido")
        .email("Ingresa un email válido"),
    address: z.string()
        .min(1, "La dirección es requerida")
        .min(5, "La dirección debe tener al menos 5 caracteres"),
    financialInstitutionCode: z.string()
        .min(1, "Debes seleccionar un banco")
        .refine((val) => val !== "0", "Debes seleccionar un banco"),
    financialInstitutionName: z.string().min(1, "El nombre del banco es requerido"),
    acceptTerms: z.boolean()
        .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
    accounts: z.array(z.object({
        id: z.number(),
        internet_amount: z.number(),
        telephony_amount: z.number(),
        tv_amount: z.number(),
        total_amount: z.number(),
        cupones: z.array(z.object({
            id: z.number(),
            codigo: z.string(),
        })).optional(),
        description: z.string().optional()
    })).optional(),
    additionalPayments: z.array(z.object({
        id: z.number(),
        amount: z.number(),
        cuota: z.number(),
        description: z.string().optional(),
    })).optional(),
    idUrlGenerated: z.number().nullable(),
    recaptchaToken: z.string({
        required_error: "Confirma que no eres un robot",
        invalid_type_error: "Confirma que no eres un robot",
    }).min(1, "Confirma que no eres un robot")
}).superRefine((data, ctx) => {
    const hasAccounts = data.accounts && data.accounts.length > 0;
    const hasAdditionalPayments = data.additionalPayments && data.additionalPayments.length > 0;

    if (!hasAccounts && !hasAdditionalPayments) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe existir al menos una cuenta o un pago adicional",
            path: ["accounts"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debe existir al menos una cuenta o un pago adicional",
            path: ["additionalPayments"],
        });
    }
});