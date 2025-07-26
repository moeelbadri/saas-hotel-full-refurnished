import { apiRequest } from "@/utils/helpers";

export async function getMessages() {
    return apiRequest<{ messages: any[] }>("/user/messages/getMessages", "GET");
}
export async function getUsers() {
    return (await apiRequest<{ users: any[] }>("/user/messages/getUsers", "GET"))?.data.users?.map((item: any) => ({ label: item.full_name, value: item.user_id }));
}
export async function putMessages(message: any) {
    return apiRequest<{ messages: any }>("/user/messages/putMessages", "PUT", message);
}
export async function patchMarkAsRead(id?: any) {
    return apiRequest<{ messages: any }>("/user/messages/patchMarkAsRead", "PATCH", { id });
}
export async function getAnnouncements(){
    return apiRequest<{ announcements: any[] }>("/user/messages/getAnnouncements", "GET");
}
