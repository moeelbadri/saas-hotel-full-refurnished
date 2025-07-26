import { useSettingsStore } from "@/components/WizardForm/useStore";
import { supabase } from "@/services/supabase";
import { formatDistance, parseISO, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
export class CustomError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "CustomError";

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
export type ApiResponse<T> = {
    status: string;
    code: number;
    message: string;
    data: T;
    timestamp: string;
    requestID: string;
};

export async function apiRequest<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: Record<string, any>,
    query?: Record<string, string>,
    includeCredentials: boolean = true
): Promise<ApiResponse<T>> {
    try {
        let base;
        try{
            base = `${window.location.protocol}//${window.location.hostname}:4444`; 
        }catch(e){
            base = "http://localhost:4444";
        }
        let fullUrl = `${base}${url}`; // "/user/statistics/getDashboardStats"
       // Replace null/undefined values with empty strings
       const sanitizedBody = body
       ? Object.fromEntries(
             Object.entries(body).map(([key, value]) => [key, value ?? ""])
         )
       : undefined;
       const sanitizedQuery = query
       ? Object.fromEntries(
             Object.entries(query).map(([key, value]) => [key, value ?? ""])
       )
       : undefined;
        if ((method === "GET" || method === "DELETE") && sanitizedBody) {
            const queryParams = new URLSearchParams(sanitizedBody as Record<string, string>).toString();
            fullUrl += `?${queryParams}`;
        }
        if(sanitizedQuery){
            const queryParams = new URLSearchParams(sanitizedQuery).toString();
            fullUrl += `?${queryParams}`;
        }
        if(body?.img?.["0"]) body.img = body?.img?.["0"];
        // Check if body contains File object
        const hasFile =  body?.img instanceof File;
        const options:RequestInit = {
            method,
            credentials: includeCredentials ? "include" : "same-origin",
        }
        if (hasFile) {
             // Create FormData for multipart/form-data
             const formData = new FormData();
             Object.entries(body!).forEach(([key, value]) => {
                 if (value instanceof File) {
                     formData.append(key, value); // File object
                 } else if (typeof value === "object") {
                     formData.append(key, JSON.stringify(value)); // Stringify nested objects
                 } else {
                     formData.append(key, value?.toString() || "");
                 }
             });
            options.body = formData;
        }else if(method !== "GET") {
            options.body = sanitizedBody ? JSON.stringify(sanitizedBody) : undefined;
            options.headers = { "Content-Type": "application/json" };
        }
        // No body for GET requests
        if (method === "GET") {
            delete options.body;
        }
        const response = await fetch(fullUrl,options);

        const data: ApiResponse<T> = await response.json();
        if (data === null) {
        throw new CustomError("Empty response body", response.status);
        }
        if (!response.ok) {
            throw new CustomError(data.message || "Unknown error", data.code || response.status);
        }
        
        return data;
    } catch (error) {
        console.error("API Request failed:", error);
        throw error;
    }
}



// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1: string, dateStr2: string) =>
    differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr: string,language?:string) =>
    formatDistance(parseISO(dateStr), new Date(), {
        locale: language !== "en" ? ar : enUS,
        addSuffix: true,

    })
        .replace("about ", "")
        .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = { end: false }) {
    const today = new Date();

    // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
    if (options?.end)
        // Set to the last second of the day
        today.setUTCHours(23, 59, 59, 999);
    else today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
};
export function getDaysDiff(end:Date, start:Date){
    return  Math.round(((new Date(end).getTime()) - (new Date(start).getTime())) / (1000 * 60 * 60 * 24));
}
const getLang = () => useSettingsStore.getState().Language;

export function formatCurrency(value: number): string {
    const Language = getLang();
    if(Language === "ar") return new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP",}).format(value);
  // 1. format the absolute value
  const absFormatted = new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
  }).format(Math.abs(value));

  // 2. if negative, inject “-” after the currency code/​symbol
  if (value < 0) {
    // ^\D+ matches all leading non-digits (e.g. “EGP ” including the NBSP)
    return absFormatted.replace(/^(\D+)/, "$1-");
  }

  // otherwise just return the normal formatted positive string
  return absFormatted;
}

  export  function getIntersectionDays1(start1: Date, end1: Date, start2: Date, end2: Date): number {
        const start = start1 > start2 ? start1 : start2;
        const end = end1 < end2 ? end1 : end2;
        if (start > end) return 0;
        return getDaysDiff(end, start);
    }
    export const getIntersectionDays = (
        startDate: Date,
        endDate: Date,
        StartDate: Date,
        EndDate: Date
    ): number => {
        // Ensure the dates are in the correct order
        const start = new Date(Math.max(new Date(startDate).getTime(),new Date(StartDate).getTime()));
        const end = new Date(Math.min(new Date(endDate).getTime(), new Date(EndDate).getTime()));

        if (start > end) {
            return 0; // No intersection
        }
        // Calculate the difference in days
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
        // If the difference is negative, it means there is no intersection
        return diffDays >= 0 ? diffDays : 0; // +1 to include both start and end dates in the count
    };
    export function generateDates(from:any, to:any) {
        const dates = [];
        const today = new Date();
        const currentDate = new Date(from);
        const toDate = new Date(to);
        while (currentDate <= toDate) {
            today.toISOString().split("T")[0] <= currentDate.toISOString().split("T")[0] && dates.push(new Date(currentDate).toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      }


      export function formateDate(datez:any,Language?:string) {
        if(!datez || datez == "Invalid Date") return "";
        const date = new Date(datez);
        const options = {
            year: 'numeric' as const,
            month: 'long' as const,
            day: 'numeric' as const,
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: true
          };
          const DateLanguage=(Language==="en"?"en-US":"ar");
          const formattedDate = new Intl.DateTimeFormat(DateLanguage, options).format(date);
          const formattedDateString = formattedDate.replace('، ', ' في ').split(Language==="en"?"at":"في");
          return formattedDateString;
        }
    export async function catchError<T>(promise : Promise<T>): Promise<[undefined, T] | [Error]> {
        return promise
            .then(data => {
                return [undefined, data] as [undefined, T];
            })
            .catch(error => {
                return [error];
            });
    }