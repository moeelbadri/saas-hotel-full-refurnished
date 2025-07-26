import { apiRequest } from "@/utils/helpers";

export async function getNotifications() {
    return apiRequest<{ notifications: any[] }>("/user/notifications/getNotifications", "GET");
}
export async function patchMarkAsRead(id?: any) {
    console.log(id)
    return apiRequest<{ notifications: any }>("/user/notifications/patchMarkAsRead", "PATCH", { id });
}