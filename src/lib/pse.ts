import { Building2, User } from "lucide-react";

export const userTypes = [
    {
        label: "Persona Natural",
        value: "person",
        icon: User,
    },
    {
        label: "Persona Jurídica",
        value: "company",
        icon: Building2,
    },
];

export type PseFormValues = {
    ticketId: string;
    amount: number;
    paymentDescription: string;
    userType: string;
    identificationType: string;
    identificationNumber: string;
    acceptTerms: boolean;
    name: string;
    phone: string;
    email: string;
    address: string;
    financialInstitutionCode: string;
    financialInstitutionName: string;
    idUrlGenerated: number | null;
    accounts?: Array<{
        id: number;
        amount: number;
        cupones?: Array<{ id: number; codigo: string }>
    }>;
    additionalPayments?: Array<{ id: number; amount: number }>;
};

export type CuentaType = {
    id: number;
    nro_cuenta: string;
    direccion?: string;
    valor_internet?: number;
    valor_telefonia?: number;
    valor_television?: number;
    valor_total?: number;
    plan?: number;
    tipo_servicio?: { id: number; descripcion: string };
    tipo_plan?: { id: number; descripcion: string };
    cupones?: Array<{ id: number; codigo: string }>;
};

export type PseServiceFormValues = {
    ticketId: string;
    amount: number;
    paymentDescription: string;
    userType: string;
    identificationType: string;
    identificationNumber: string;
    acceptTerms: boolean;
    name: string;
    phone: string;
    email: string;
    address: string;
    financialInstitutionCode: string;
    financialInstitutionName: string;
    idUrlGenerated: number | null;
    accounts?: Array<{
        id: number;
        internet_amount: number;
        telephony_amount: number;
        tv_amount: number;
        total_amount: number;
        cupones?: Array<{ id: number; codigo: string }>;
        description?: string;
    }>;
    additionalPayments?: Array<{ id: number; amount: number, cuota: number, description: string }>;
}

export type selectTypeOption = {
    value: string;
    label: string;
    valor_identificacion: string;
};

export type selectBankOption = {
    financialInstitutionCode: string;
    financialInstitutionName: string;
};

export type couponType = {
    id: number;
    codigo: string;
    descripcion: string;
    razon?: string;
    valor_descuento?: number;
    fechaCreacion?: string;
    fecha_fin?: string;
    activo?: boolean;
    tipo_descuento_descripcion: string;
}

export type aditionalPaymentType = {
    id: number;
    fecha_realizacion: string;
    valor_total: number;
    observacion?: string;
    cuotas: number;
    ultimo_pago?: {
        id: number;
        fecha_pago: string;
        numero_cuota: number;
    };
    detalles_factura_cobro?: Array<{
        id_detalle_factura_cobro: number;
        valor: number;
        cantidad: number;
        descripcion: string;
    }>;
}

export const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
    return formatted;
};