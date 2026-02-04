import ApiService from "@/apis/ApiService.js";

const primaryPath = "pse/";
class PSEService {
    consultTransaction(transactionId: string): Promise<any> {
        return ApiService.get(`${primaryPath}verifyTransaction/${transactionId}`, { headers: { "Content-Type": "application/json" } });
    }

    paymentConsultByID(id: string): Promise<any> {
        return ApiService.get(`${primaryPath}generate_url/${id}`, { headers: { "Content-Type": "application/json" } });
    }

    getBanks(): Promise<any> {
        return ApiService.get(`${primaryPath}banco`);
    }

    generatePayment(data: string): Promise<any> {
        return ApiService.post(`${primaryPath}iniciar_transaccion`, data, { headers: { "Content-Type": "application/json" } });
    }

    consultAccount(): Promise<any> {
        return ApiService.get(`${primaryPath}cuenta/corte`, { headers: { "Content-Type": "application/json" } });
    }

    consultAdditionalPayments(clientId: number, status: number): Promise<any> {
        return ApiService.get(`factura-cobro/client/status/${clientId}`, { params: { status: status }, headers: { "Content-Type": "application/json" } });
    }

    payBill(data: string) {
        return ApiService.post(`${primaryPath}factura`, data, { headers: { "Content-Type": "application/json" } })
    }

    generatePDF(id: String) {
        return ApiService.get(`${primaryPath}pdf/${id}`, { responseType: "blob", })
    }
}

export default new PSEService();
