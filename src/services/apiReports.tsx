import { getToday,getDaysDiff, subtractDates, apiRequest } from "../utils/helpers";
import { supabase } from "./supabase";
import { PAGE_SIZE } from "@/utils/constants";

export async function getStorageReports(item_id:any,num_days: any, sortby: any) {
    return apiRequest<{ reports: any[] }>("/user/reports/getStorageReports", "GET", { item_id, num_days, sortby });
}
export async function getAllStorageExpenses(days: any){
    return apiRequest<{ reports: any[] }>("/user/reports/getAllStorageExpenses", "GET", { days });
}
export async function getStorageReportsWithUsers(item_id:any,days: any, sortby: any,pageid:any = 1,limit:any = PAGE_SIZE) {
    return apiRequest<{ reports: any[] , count : string , oldcount : string }>("/user/reports/getStorageReportsWithUsers", "GET", { item_id,days,sortby,pageid,limit });
}
export async function deleteStorageActivity(id:any){
    return apiRequest<{ storage: any[] }>("/user/storage/deleteStorageActivity", "DELETE", { id });
}