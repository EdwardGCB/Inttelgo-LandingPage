import z from "zod"

export const UserPINSchema = z
    .object({
        identificacion: z
            .string()
            .min(6, "Mínimo 6 dígitos")
            .max(12, "Máximo 12 dígitos")
            .regex(/^\d+$/, "Solo números"),
        pin: z
            .array(z.string().length(1).regex(/^\d$/))
            .length(6, "El PIN debe tener 6 dígitos"),
        confirm_pin: z
            .array(z.string().length(1).regex(/^\d$/))
            .length(6, "El PIN debe tener 6 dígitos"),
    })
    .refine((data) => data.pin.join("") === data.confirm_pin.join(""), {
        message: "Los PINs no coinciden",
        path: ["confirm_pin"],
    })

export const UserLoginSchema = z.object({
    identificacion: z
        .string()
        .min(6, "Mínimo 6 dígitos")
        .max(12, "Máximo 12 dígitos")
        .regex(/^\d+$/, "Solo números"),
    pin: z
        .array(z.string().length(1).regex(/^\d$/, "Solo números"))
        .length(6, "El PIN debe tener 6 dígitos"),
})

export type UserLoginFormValues = z.infer<typeof UserLoginSchema>
export type UserPINFormValues = z.infer<typeof UserPINSchema>