import { useEffect, useRef } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserLoginSchema, type UserLoginFormValues } from "@/Forms/User"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CardFooter } from "@/components/ui/card"
import { useUser } from "@/contexts/User"

const EMPTY_PIN = ["", "", "", "", "", ""]

// ✅ Fuera del componente — identidad estable entre renders
interface PinInputsProps {
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    onDigit: (index: number, value: string) => void
    onKeyDown: (e: React.KeyboardEvent, index: number) => void
    disabled?: boolean
}

function PinInputs({ refs, onDigit, onKeyDown, disabled }: PinInputsProps) {
    const { control } = useFormContext<UserLoginFormValues>()

    return (
        <FormField
            control={control}
            name="pin"
            render={({ field, fieldState }) => (
                <FormItem className="w-full">
                    <FormLabel className="text-sm sm:text-base">PIN</FormLabel>
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
                                    disabled={disabled}
                                    onChange={(e) => onDigit(i, e.target.value)}
                                    onKeyDown={(e) => onKeyDown(e, i)}
                                    className="h-11 w-11 sm:h-12 sm:w-12 text-center text-xl focus-visible:ring-orange-500"
                                />
                            ))}
                        </div>
                    </FormControl>
                    {fieldState.error && <FormMessage className="text-center" />}
                </FormItem>
            )}
        />
    )
}

interface LoginFormProps {
    onSubmit: (data: UserLoginFormValues) => Promise<void>
    isLoading: boolean
    rulesAccepted: boolean
    setRulesAccepted: (v: boolean) => void
    setRulesOpen: (v: boolean) => void
    setPinDialogOpen: (v: boolean) => void
}

export function LoginForm({
    onSubmit,
    isLoading,
    rulesAccepted,
    setRulesAccepted,
    setRulesOpen,
    setPinDialogOpen,
}: LoginFormProps) {
    const pinRefs = useRef<(HTMLInputElement | null)[]>([])
    const { error } = useUser();
    const form = useForm<UserLoginFormValues>({
        resolver: zodResolver(UserLoginSchema),
        mode: "onChange",
        defaultValues: {
            identificacion: "",
            pin: [...EMPTY_PIN],
        },
    })

    useEffect(() => {
        if (rulesAccepted) {
            form.trigger()
        }
    }, [rulesAccepted, form])

    const handlePinDigit = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const current = form.getValues("pin")
        const updated = [...current]
        updated[index] = value.slice(-1)
        form.setValue("pin", updated, { shouldValidate: true })
        if (value && index < 5) pinRefs.current[index + 1]?.focus()
    }

    const handlePinKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace") {
            const current = form.getValues("pin")
            if (!current[index] && index > 0) {
                pinRefs.current[index - 1]?.focus()
            }
        }
    }

    const isDisabled = !rulesAccepted || !form.formState.isValid

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col items-center px-3 sm:px-6"
            >
                {/* Cédula */}
                <FormField
                    control={form.control}
                    name="identificacion"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-sm sm:text-base">
                                Número de cédula
                            </FormLabel>
                            <FormControl>
                                <Input
                                    inputMode="numeric"
                                    placeholder="Ej. 1234567890"
                                    disabled={isLoading}
                                    autoFocus
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* PIN */}
                <PinInputs
                    refs={pinRefs}
                    onDigit={handlePinDigit}
                    onKeyDown={handlePinKeyDown}
                    disabled={isLoading}
                />

                {/* Error del servidor */}
                {error && (
                    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700 w-full">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Checkbox de aceptación */}
                <div className="mt-4 flex items-start gap-2 w-full">
                    <input
                        type="checkbox"
                        id="accept-rules"
                        checked={rulesAccepted}
                        onChange={(e) => setRulesAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 cursor-pointer accent-orange-500"
                    />
                    <label
                        htmlFor="accept-rules"
                        className="cursor-pointer select-none text-sm leading-snug"
                    >
                        He leído y acepto las{" "}
                        <button
                            type="button"
                            onClick={() => setRulesOpen(true)}
                            className="text-orange-400 underline hover:text-orange-300 transition-colors"
                        >
                            reglas
                        </button>{" "}
                        pactadas por Inttelgo para participar
                    </label>
                </div>

                <CardFooter className="pt-2 w-full px-0 flex flex-col gap-2">
                    <Button
                        variant="orange"
                        type="submit"
                        disabled={isDisabled}
                        className="w-full"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : "Ingresar"}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                        ¿Aún no tienes PIN?
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setPinDialogOpen(true)}
                    >
                        Generar PIN
                    </Button>
                </CardFooter>
            </form>
        </Form>
    )
}