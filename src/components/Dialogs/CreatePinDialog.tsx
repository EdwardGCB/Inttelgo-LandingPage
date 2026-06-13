import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock } from "lucide-react"
import { useRef } from "react"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPINSchema, type UserPINFormValues } from "@/Forms/User"
import { useUser } from "@/contexts/User"

interface CreatePinDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const EMPTY_PIN = ["", "", "", "", "", ""]

// ✅ Fuera del componente padre — identidad estable entre renders
interface PinInputsProps {
    fieldName: "pin" | "confirm_pin"
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    label: string
    onDigit: (index: number, value: string, fieldName: "pin" | "confirm_pin", refs: React.MutableRefObject<(HTMLInputElement | null)[]>) => void
    onKeyDown: (e: React.KeyboardEvent, index: number, fieldName: "pin" | "confirm_pin", refs: React.MutableRefObject<(HTMLInputElement | null)[]>) => void
}

function PinInputs({ fieldName, refs, label, onDigit, onKeyDown }: PinInputsProps) {
    const { control } = useFormContext<UserPINFormValues>()

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="flex justify-center gap-2">
                            {field.value.map((digit: string, i: number) => (
                                <Input
                                    key={i}
                                    ref={(el) => {
                                        refs.current[i] = el
                                    }}
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => onDigit(i, e.target.value, fieldName, refs)}
                                    onKeyDown={(e) => onKeyDown(e, i, fieldName, refs)}
                                    className="h-12 w-12 text-center text-xl focus-visible:ring-orange-500"
                                />
                            ))}
                        </div>
                    </FormControl>
                    {fieldState.error && <FormMessage />}
                </FormItem>
            )}
        />
    )
}

export function CreatePinDialog({ open, onOpenChange }: CreatePinDialogProps) {
    const { createPin } = useUser()
    const pinRefs = useRef<(HTMLInputElement | null)[]>([])
    const confirmRefs = useRef<(HTMLInputElement | null)[]>([])

    const form = useForm<UserPINFormValues>({
        resolver: zodResolver(UserPINSchema),
        mode: "onChange",
        defaultValues: {
            identificacion: "",
            pin: [...EMPTY_PIN],
            confirm_pin: [...EMPTY_PIN],
        },
    })

    const handlePinDigit = (
        index: number,
        value: string,
        fieldName: "pin" | "confirm_pin",
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        if (!/^\d*$/.test(value)) return
        const current = form.getValues(fieldName)
        const updated = [...current]
        updated[index] = value.slice(-1)
        form.setValue(fieldName, updated, { shouldValidate: true })
        if (value && index < 5) refs.current[index + 1]?.focus()
    }

    const handlePinKeyDown = (
        e: React.KeyboardEvent,
        index: number,
        fieldName: "pin" | "confirm_pin",
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        if (e.key === "Backspace") {
            const current = form.getValues(fieldName)
            if (!current[index] && index > 0) {
                refs.current[index - 1]?.focus()
            }
        }
    }

    const onSubmit = async (data: UserPINFormValues) => {
        const res = await createPin(data)
        if (res) {
            form.reset()
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) form.reset(); onOpenChange(v) }}>
            <DialogContent className="max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FF9900] to-[#EC5406]">
                                    <Lock className="h-4 w-4 text-white" />
                                </div>
                                Crear PIN
                            </DialogTitle>
                            <DialogDescription>
                                Ingresa tu número de cédula y crea un PIN seguro para participar.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <FormField
                                control={form.control}
                                name="identificacion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de cédula</FormLabel>
                                        <FormControl>
                                            <Input
                                                inputMode="numeric"
                                                placeholder="Ej. 1234567890"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <PinInputs
                                fieldName="pin"
                                refs={pinRefs}
                                label="Crear PIN"
                                onDigit={handlePinDigit}
                                onKeyDown={handlePinKeyDown}
                            />
                            <PinInputs
                                fieldName="confirm_pin"
                                refs={confirmRefs}
                                label="Confirmar PIN"
                                onDigit={handlePinDigit}
                                onKeyDown={handlePinKeyDown}
                            />

                            <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                <span>Tu PIN es personal e intransferible. No lo compartas con nadie.</span>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => { form.reset(); onOpenChange(false) }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="orange"
                                className="flex-1"
                                disabled={!form.formState.isValid}
                            >
                                Crear PIN
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}