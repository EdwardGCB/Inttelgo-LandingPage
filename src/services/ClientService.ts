import ApiService from "@/apis/ApiService.js";

const primaryPath = "cliente/";
const secondaryPath = "tipoidentificacion/";
class ClientService {
    getIdentifyTypes(): Promise<any> {
        return ApiService.get(secondaryPath + `select`);
    }
    consultByIdentification(identification: string): Promise<any> {
        return ApiService.get(primaryPath + `generate_token/${identification}`);
    }
}

export default new ClientService();
