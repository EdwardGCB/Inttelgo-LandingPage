import ApiService from "@/apis/ApiExperience";

const sportPath = "sports-betting/";
class ExperienceService {
    sport = {
        consultMatches(id: string, conditions: any = undefined): Promise<any> {
            return ApiService.get(`${sportPath}competitions/${id}/matches`, { params: conditions, headers: { "Content-Type": "application/json" } });
        },
        consultStandings(id: string, conditions: any = undefined): Promise<any> {
            return ApiService.get(`${sportPath}competitions/${id}/standings`, { params: conditions, headers: { "Content-Type": "application/json" } });
        },
        createSuscription(id: string, form: any = { resource_type: "match", events: ["status_changed", "goal", "goal_cancelled"] }) {
            return ApiService.post(`${sportPath}subscriptions/user/${id}`, form, { headers: { "Content-Type": "application/json" } });
        },
        createWebSocket(id: string) {
            const base = import.meta.env.VITE_WEB_SOCKET
            return new WebSocket(`${base}/${sportPath}ws/${id}`);
        },
        consultUserPredictions(userId: number): Promise<any> {
            return ApiService.get(`${sportPath}predictions/user/${userId}`, { headers: { "Content-Type": "application/json" } });
        },
        createUserPredictions(userId: number, match_id: number, form: any): Promise<any> {
            return ApiService.post(`${sportPath}predictions/user/${userId}/matches/${match_id}`, form, { headers: { "Content-Type": "application/json" } });
        },
        updateUserPredictions(userId: number, match_id: number, form: any): Promise<any> {
            return ApiService.put(`${sportPath}predictions/user/${userId}/matches/${match_id}`, form, { headers: { "Content-Type": "application/json" } });
        },
        consultUsersScores(conditions: any = undefined) {
            return ApiService.get(`${sportPath}scores`, { params: conditions, headers: { "Content-Type": "application/json" } })
        }
    }
}

export default new ExperienceService();
