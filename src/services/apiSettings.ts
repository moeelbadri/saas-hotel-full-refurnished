import { Alert } from "@/utils/types";
import {supabase} from "./supabase";
import { apiRequest, formatCurrency } from "@/utils/helpers";
interface HotelSettings {
    address1: string;
    address2: string;
    amenities: null; // or you can change it to amenities: any if it can be any type
    breakfast_price: number;
    created_at: string;
    hotel_id: string;
    hotel_name: string;
    id: string;
    id_scan: boolean;
    max_booking_length: number;
    max_guests_per_booking: number;
    max_kids_per_booking: number;
    max_number_cabins: number;
    max_number_users: number;
    min_booking_length: number;
    owner_id: string;
    package_id: string;
    starting_police_case_id: number;
    vat: number;
  }
export async function getSettings() {
    return apiRequest<{ settings: HotelSettings }>("/user/settings/getSettings", "GET");
}
export async function getAmenities(){
   return (await apiRequest<{ amenities: [] }>("/user/settings/getAmenities", "GET")).data.amenities.map((item: any) => ({ label: item.name, value: item.id, amenity_id: item.amenity_id, isFixed: false }));
}

const getIntersectionDays = (
    startDate: Date,
    endDate: Date,
    discountStartDate: Date,
    discountEndDate: Date
): number => {
    // Ensure the dates are in the correct order
    const start = new Date(Math.max(new Date(startDate).getTime(),new Date(discountStartDate).getTime()));
    const end = new Date(Math.min(new Date(endDate).getTime(), new Date(discountEndDate).getTime()));
    if (start > end) {
        return 0; // No intersection
    }
    // Calculate the difference in days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If the difference is negative, it means there is no intersection
    return diffDays >= 0 ? diffDays : 0; // +1 to include both start and end dates in the count
};

export async function getPickedAmenities(days?:any,discounts?:any,startDate?:any,endDate?:any) {
    return (await apiRequest<{ amenities: [] }>("/user/settings/getPickedAmenities", "GET")).data.amenities.map((item: any) => ({ label: item.name,value: item.amenity_id, id: item.id ,price : item.price,included : item.included, isFixed: false }));
        const {hotelId,profile} = await getHotelID();

    const intersectedDays = Math.ceil(getIntersectionDays(new Date(startDate), new Date(endDate), new Date(discounts?.[0]?.start_date), new Date(discounts?.[0]?.end_date)))
    const { data, error } = await supabase
        .rpc("get_amenities_with_names",{hotel_idv:hotelId})
    if (error) {
        console.error(error);
        throw new Error("Settings could not be loaded");
    }
    const processedData = data
    .filter((item: any) => ((item.enabled !== false&&!item.included)||days == 0)) // Filter out items with enabled === false
    .map((item: any) => {
        const discounted= discounts?.[0]?.discountsThings?.[0].Amenities_ids?.includes(item.id)||discounts?.[0]?.discountsThings?.[0].Amenities_ids===null;
            const finalCost =  ((days - intersectedDays ) * item.price) + 
            (intersectedDays ?? 0) * (item.price * ((discounted===true?(100-(discounts?.[0]?.discount ?? 0)):100) / 100));
        return {
        label: days > 0 ? `${item.name} - ${formatCurrency(intersectedDays>0?finalCost:item.price*days)}` : item.name,
        name : item.name,
        // color: "#FFFFFF",
        value: item.id,
        isFixed: item.included,
        totalcost: days > 0 ? (intersectedDays>0?finalCost:item.price*days) : 0,
        price: item.price,
        included: item.included,
        }
    }
);

    return processedData;
}
export async function putAmenities(newSetting: any) {
    return apiRequest<{ settings: HotelSettings }>("/user/settings/putAmenities", "PUT", newSetting);
}
export async function getBreakfast(){
    const { data, error } = await supabase
        .from("settings")
        .select("breakfastPrice")
    if (error) {
        console.error(error);
        throw new Error("Breakfast could not be loaded");
    }
    return data[0]?.breakfastPrice;
}
// We expect a newSetting object that looks like {setting: newValue}
export async function updateSettings(newSetting: any) {
       return apiRequest<{ settings: HotelSettings }>("/user/settings/updateSettings", "PATCH", newSetting);
}

export async function updateHotel(newHotel: any) {
        const {hotelId,profile} = await getHotelID();

    const { data, error } = await supabase
        .from("hotels")
        .update(newHotel)
        // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
        .eq("id", hotelId)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Settings could not be updated");
    }
    return data;
}
export async function getAlerts(field:any, direction:any,all: boolean) {
    return apiRequest<{ alerts: any[] , count : number , oldcount : number }>("/user/alerts/getAlerts", "GET", { field, direction , all});
    // const {hotelId,profile} = await getHotelID();

    // let query:any= supabase
    //     .from("alerts")
    //     .select("*,profiles(FullName)")
    //     .eq("hotel_id", hotelId)
    //     if(!all){
    //         query.filter("time_resolved", "is", null)
    //         .order("priority_level", { ascending: true })
    //         // .gt("end_date", new Date().toISOString())
    //         .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
    //     }else{
    //         console.log(field,direction)
    //         query.order(field, { ascending: direction === "asc" })
    //     }
        
    //     const { data, error } = await query;
    // if (error) {
    //     console.error(error);
    //     throw new Error("Alerts could not be loaded");
    // }
    // return data;
}
export async function putAlerts(alerts: Alert) {
    const {profiles,type,editId,...alertsData} = alerts;
    if(editId) alertsData.id=editId;
    return apiRequest<{ alerts: any[] }>("/user/alerts/putAlerts", "PUT", { alertsData });
    
    // console.log(alertsData)
    // const { data, error } = await supabase
    //     .from("alerts")
    //     .upsert(alertsData)
    //     .select();
    // if (error) {
    //     console.error(error);
    //     throw new Error("Alerts could not be loaded");
    // }
    // console.log(data)
    // return data;
}
export async function deleteAlerts(alerts: Alert) {
    const { data, error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", alerts.id);
    if (error) {
        console.error(error);
        throw new Error("Alerts could not be deleted");
    }
    return data;
}